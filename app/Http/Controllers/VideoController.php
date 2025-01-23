<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Video;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
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

    public function show($id)
    {
        $video = Video::findOrFail($id);

        // Increment views
        $video->increment('views');

        return response()->json([
            'id' => $video->id,
            'title' => $video->title,
            'description' => $video->description,
            'url' => $video->url,
            'thumbnail' => $video->thumbnail ? base64_encode(Storage::get("public/{$video->thumbnail}")) : null,
            'publisher_name' => $video->publisher_name,
            'views' => $video->views,
            'duration' => $video->duration,
            'published_time' => Carbon::parse($video->created_at)->diffForHumans(),
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'video' => 'required|file|mimes:mp4,mov,avi|max:102400',
            'title' => 'nullable|string',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|image|max:2048',
        ]);

        $path = $request->file('video')->store('videos', 'public');
        $thumbnailPath = $request->file('thumbnail')
            ? $request->file('thumbnail')->store('thumbnails', 'public')
            : null;

        // Calculate video duration
        $ffmpeg = FFMpeg\FFMpeg::create();
        $videoFile = $ffmpeg->open(Storage::path("public/$path"));
        $durationInSeconds = $videoFile->getStreams()->videos()->first()->get('duration');
        $duration = gmdate('H:i:s', $durationInSeconds);

        $video = Video::create([
            'title' => $validated['title'] ?? null,
            'description' => $validated['description'] ?? null,
            'url' => $path,
            'thumbnail' => $thumbnailPath,
            'user_id' => Auth::id(),
            'publisher_name' => Auth::user()->name, // Set publisher name
            'duration' => $duration,
        ]);

        return response()->json($video, 201);
    }
}
