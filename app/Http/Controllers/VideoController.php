<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Video;

class VideoController extends Controller
{
    public function index()
    {
        try {
            $videos = Video::all();
            return response()->json($videos);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function show($id)
    {
        return Video::with('user')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'video' => 'required|file|mimes:mp4,avi,mov',
            'title' => 'required|string|max:255',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg',
        ]);

        // Handle video upload
        $videoPath = $request->file('video')->store('videos');

        // Handle thumbnail upload or generation
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails');
        } elseif ($request->generateThumbnail === 'true') {
            $thumbnailPath = $this->generateThumbnail($videoPath); // Use FFmpeg or similar
        }

        $video = Video::create([
            'title' => $request->title,
            'description' => $request->description,
            'url' => $videoPath,
            'thumbnail' => $thumbnailPath,
            'user_id' => auth()->id(),
        ]);

        return response()->json(['message' => 'Video uploaded successfully!', 'video' => $video], 201);
    }
}
