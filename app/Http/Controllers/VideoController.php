<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Video;

class VideoController extends Controller
{
    public function index()
    {
        return Video::with('user')->get(); // Include user who uploaded the video
    }

    public function show($id)
    {
        return Video::with('user')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'url' => 'required|string',
            'thumbnail' => 'required|string',
        ]);

        $video = auth()->user()->videos()->create($validated);

        return response()->json($video, 201);
    }
}