<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Video;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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

        // Provide metadata
        return response()->json([
            'id' => $video->id,
            'title' => $video->title,
            'description' => $video->description,
            'url' => route('video.stream', ['id' => $video->id]), // Link to the video streaming endpoint
            'thumbnail' => $video->thumbnail
                ? Storage::url($video->thumbnail)
                : asset('images/default-thumbnail.jpg'),
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
            'title' => 'nullable|string',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|image|max:2048',
        ]);

        // Store original video
        $originalPath = $request->file('video')->store('videos', 'public');
        $thumbnailPath = $request->file('thumbnail')
            ? $request->file('thumbnail')->store('thumbnails', 'public')
            : null;

        // Convert video to WebM format
        $webmPath = str_replace(['videos/', '.mp4', '.mov', '.avi'], ['videos/', '.webm'], $originalPath);
        $ffmpeg = FFMpeg\FFMpeg::create();

        try {
            $videoFile = $ffmpeg->open(Storage::path("public/$originalPath"));
            $videoFile->save(new FFMpeg\Format\Video\WebM(), Storage::path("public/$webmPath"));
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to convert video: ' . $e->getMessage()], 500);
        }

        // Get video duration
        $durationInSeconds = $videoFile->getStreams()->videos()->first()->get('duration');
        $duration = gmdate('H:i:s', $durationInSeconds);

        // Save video metadata to the database
        $video = Video::create([
            'title' => $validated['title'] ?? null,
            'description' => $validated['description'] ?? null,
            'url' => $webmPath, // Store the WebM version in the database
            'thumbnail' => $thumbnailPath,
            'user_id' => Auth::id(),
            'publisher_name' => Auth::user()->name,
            'duration' => $duration,
        ]);

        return response()->json($video, 201);
    }
}
