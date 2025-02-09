<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Video;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Jobs\ProcessVideo;


use Symfony\Component\HttpFoundation\StreamedResponse;
use FFMpeg;
use Carbon\Carbon;


class VideoController extends Controller
{
    public function index()
    {
        $videos = Video::all()->map(function ($video) {
            if ($video->thumbnail && Storage::exists("public/{$video->thumbnail}")) {
                $video->thumbnail = base64_encode(Storage::get("public/{$video->thumbnail}"));
            } else {
                $video->thumbnail = null; // Default if no thumbnail exists
            }
            return $video;
        });

        return response()->json($videos);
    }

    public function getMetadata($id)
    {
        $video = Video::findOrFail($id);

        // Ensure the thumbnail URL is properly formatted
        $thumbnailUrl = $video->thumbnail
            ? asset(Storage::url($video->thumbnail)) // Ensure full URL
            : asset('images/default-thumbnail.jpg');

        // Provide metadata
        return response()->json([
            'id' => $video->id,
            'title' => $video->title,
            'description' => $video->description,
            'url' => route('video.stream', ['id' => $video->id]), // Link to the video streaming endpoint
            'thumbnail' => $thumbnailUrl,
            'publisher_name' => $video->publisher_name,
            'views' => $video->views,
            'duration' => $video->duration,
            'published_time' => Carbon::parse($video->created_at)->diffForHumans(),
        ]);
    }


    public function streamVideo($id)
    {
        $video = Video::findOrFail($id);

        // Increment views only when streaming
        $video->increment('views');

        // Serve the video file directly
        $filePath = $video->url; // Assuming 'url' stores the video path in the 'public' disk

        if (!Storage::exists("public/$filePath")) {
            return response()->json(['error' => 'Video file not found'], 404);
        }

        $path = Storage::path("public/$filePath");
        $size = filesize($path);
        $mimeType = mime_content_type($path);

        $headers = [
            'Content-Type' => $mimeType,
            'Accept-Ranges' => 'bytes',
            'Content-Length' => $size,
        ];

        if (isset($_SERVER['HTTP_RANGE'])) {
            $range = $_SERVER['HTTP_RANGE'];
            list($start, $end) = explode('-', str_replace('bytes=', '', $range));

            $start = intval($start);
            $end = $end ? intval($end) : ($size - 1);

            $length = $end - $start + 1;

            $headers['Content-Range'] = "bytes $start-$end/$size";
            $headers['Content-Length'] = $length;

            $stream = fopen($path, 'rb');
            fseek($stream, $start);

            return response()->stream(function () use ($stream, $length) {
                echo fread($stream, $length);
                fclose($stream);
            }, 206, $headers);
        }

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
            'thumbnail' => 'nullable|image|max:2048',
        ]);

        // Store files securely
        $path = $request->file('video')->store('videos', 'private');
        $thumbnailPath = $request->file('thumbnail')
            ? $request->file('thumbnail')->store('thumbnails', 'private')
            : null;

        // Create video record
        $video = Video::create([
            'title' => $validated['title'] ?? null,
            'description' => $validated['description'] ?? null,
            'url' => $path,
            'thumbnail' => $thumbnailPath,
            'user_id' => Auth::id(),
            'publisher_name' => Auth::user()->name,
            'duration' => null, // Processed later
        ]);

        // Dispatch background job for processing
        ProcessVideo::dispatch($video);

        return response()->json([
            'message' => 'Video uploaded successfully! Processing in the background...',
            'video' => $video
        ], 201);
    }
}
