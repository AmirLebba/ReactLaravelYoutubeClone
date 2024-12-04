<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class VideoController extends Controller
{
    public function index()
    {
        // Return a list of videos
    }

    public function show($id)
    {
        // Return a single video
    }

    public function store(Request $request)
    {
        // This method requires authentication
        $this->middleware('auth:api');

        // Upload a new video
    }
}
