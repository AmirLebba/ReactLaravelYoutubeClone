<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Video;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Jobs\ProcessVideo;
use Carbon\Carbon;

class VideoController extends Controller
{
    public function index()
    {
        $videos = Video::all()->map(function ($video) {
            $video->thumbnail = $video->thumbnail && Storage::exists("local/{$video->thumbnail}")
                ? asset(Storage::url($video->thumbnail))
                : asset('images/default-thumbnail.jpg');

            return $video;
        });

        return response()->json($videos);
    }

    public function getMetadata($id)
    {
        $video = Video::findOrFail($id);
        $videoUrls = json_decode($video->url, true);

        return response()->json([
            'id' => $video->id,
            'title' => $video->title,
            'description' => $video->description,
            'video_urls' => $videoUrls, // Array of resolutions
            'thumbnail' => asset(Storage::url($video->thumbnail)),
            'publisher_name' => $video->publisher_name,
            'views' => $video->views,
            'duration' => $video->duration,
            'published_time' => Carbon::parse($video->created_at)->diffForHumans(),
        ]);
    }

    public function streamVideo($id, $resolution = '720p')
    {
        $video = Video::findOrFail($id);
        $video->increment('views');

        $videoUrls = json_decode($video->url, true);
        if (!isset($videoUrls[$resolution])) {
            return response()->json(['error' => 'Requested resolution not available'], 400);
        }

        $filePath = $videoUrls[$resolution];
        if (!Storage::disk('local')->exists($filePath)) {
            return response()->json(['error' => 'Video file not found'], 404);
        }

        $path = Storage::disk('local')->path($filePath);
        $size = filesize($path);
        $mimeType = mime_content_type($path);

        $headers = [
            'Content-Type' => $mimeType,
            'Accept-Ranges' => 'bytes',
            'Content-Length' => $size,
        ];

        return response()->stream(function () use ($path) {
            readfile($path);
        }, 200, $headers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'video' => 'required|file|mimes:mp4,mov,avi|max:102400',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:5000',
        ]);

        // ✅ 1. Save the video to the public storage
        $path = $request->file('video')->store('videos', 'public');

        // ✅ 2. Create a temporary video record
        $video = Video::create([
            'title' => $validated['title'] ?? 'Untitled Video',
            'description' => $validated['description'] ?? '',
            'url' => '{}',
            'thumbnail' => '/images/default-thumbnail.jpg', // Placeholder until processed
            'user_id' => Auth::id(),
            'publisher_name' => Auth::user()->name,
            'duration' => null,  // Will be updated later
        ]);

        // ✅ 3. Dispatch the job with the video ID
        ProcessVideo::dispatch($video->id);

        // ✅ 4. Return a response with the video ID
        return response()->json([
            'message' => 'Video uploaded successfully! Processing in the background...',
            'video' => $video  // Send the video data to the frontend
        ], 201);
    }
}