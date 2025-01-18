<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Video;

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
            'description' => 'required|string',
            'url' => 'required|string', // Assuming the URL is passed as a string
            'thumbnail' => 'required|string', // Assuming the thumbnail is passed as a string
        ]);

        // Use the authenticated user's ID
        $video = Video::create([
            'title' => $request->title,
            'description' => $request->description,
            'url' => $request->url,
            'thumbnail' => $request->thumbnail,
            'user_id' => auth()->id(), // Get the authenticated user's ID
        ]);

        return response()->json($video, 201);
    }
}
