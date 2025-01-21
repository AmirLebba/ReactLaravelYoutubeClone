<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Video;
use Illuminate\Support\Facades\Auth;

class VideoController extends Controller
{
    public function index()
    {
        $videos = Video::all();
        return response()->json($videos);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'video' => 'required|file|mimes:mp4,mov,avi|max:90240',
            'title' => 'nullable|string',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|image|max:2048', // Ensure this is validated
        ]);

        // Store video file
        $path = $request->file('video')->store('videos', 'public');

        // Store thumbnail file, if present
        $thumbnailPath = $request->file('thumbnail')
            ? $request->file('thumbnail')->store('thumbnails', 'public')
            : null;

        // Create video record
        $video = Video::create([
            'title' => $validated['title'] ?? null,
            'description' => $validated['description'] ?? null,
            'url' => $path,
            'thumbnail' => $thumbnailPath, // Save the thumbnail path
            'user_id' => Auth::id(),
        ]);

        return response()->json($video, 201);
    }
}
