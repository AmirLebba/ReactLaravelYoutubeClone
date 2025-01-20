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
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'video' => 'required|file|mimes:mp4,avi,mov|max:20480', // Example validation
            'thumbnail' => 'nullable|file|mimes:jpeg,png|max:2048',
        ]);

        $path = $request->file('video')->store('videos', 'public');
        $thumbnailPath = $request->file('thumbnail') ? $request->file('thumbnail')->store('thumbnails', 'public') : null;

        $video = Video::create([
            'title' => $request->title,
            'description' => $request->description,
            'url' => $path,
            'thumbnail' => $thumbnailPath,
            'user_id' => Auth::id(), // Automatically assign the authenticated user's ID
        ]);

        return response()->json($video, 201);
    }
}
