<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Video;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Jobs\ProcessVideo;
use Carbon\Carbon;
use Illuminate\Support\Str;

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

        // Decode the URLs
        $videoUrls = json_decode($video->url, true);

        // Generate the full thumbnail URL
        $thumbnailUrl = Storage::url($video->thumbnail);

        return response()->json([
            'id' => $video->id,
            'unique_id' => $video->unique_id,
            'title' => $video->title,
            'description' => $video->description,
            'video_urls' => $videoUrls, // Array of resolutions
            'thumbnail' => $thumbnailUrl, // Full URL for the thumbnail
            'publisher_name' => $video->publisher_name,
            'views' => $video->views,
            'duration' => $video->duration,
            'published_time' => Carbon::parse($video->created_at)->diffForHumans(),
        ]);
    }

    public function streamVideo($uniqueId, $resolution = '720p')
    {
        // Find the video by its unique ID
        $video = Video::where('unique_id', $uniqueId)->first();

        if (!$video) {
            return response()->json(['error' => 'Video not found'], 404);
        }

        // Increment views with throttling (optional)
        if (!$this->isViewThrottled($video->id)) {
            $video->increment('views');
        }

        // Decode the URLs
        $videoUrls = json_decode($video->url, true);

        // Check if the requested resolution exists
        if (!isset($videoUrls[$resolution])) {
            return response()->json(['error' => 'Requested resolution not available'], 400);
        }

        // Get the file path and ensure it exists
        $filePath = $videoUrls[$resolution];
        if (!Storage::disk('local')->exists($filePath)) {
            return response()->json(['error' => 'Video file not found'], 404);
        }

        // Get file details
        $path = Storage::disk('local')->path($filePath);
        $size = filesize($path);
        $mimeType = Storage::mimeType($filePath); // Use Laravel's mimeType method

        // Set response headers
        $headers = [
            'Content-Type' => $mimeType,
            'Accept-Ranges' => 'bytes',
            'Content-Length' => $size,
        ];

        // Handle range requests for partial content streaming
        if (request()->hasHeader('Range')) {
            return $this->streamRangeResponse($path, $size, $mimeType);
        }

        // Stream the video file
        return response()->stream(function () use ($path) {
            $stream = fopen($path, 'rb');
            while (!feof($stream)) {
                echo fread($stream, 8192); // Stream in chunks
                flush();
            }
            fclose($stream);
        }, 200, $headers);
    }

    /**
     * Handle range requests for partial content streaming.
     */
    protected function streamRangeResponse($path, $size, $mimeType)
    {
        $range = request()->header('Range');
        list($start, $end) = sscanf($range, 'bytes=%d-%d');

        if ($end === null) {
            $end = $size - 1;
        }

        $length = $end - $start + 1;

        $headers = [
            'Content-Type' => $mimeType,
            'Content-Length' => $length,
            'Content-Range' => "bytes $start-$end/$size",
            'Accept-Ranges' => 'bytes',
        ];

        return response()->stream(function () use ($path, $start, $length) {
            $stream = fopen($path, 'rb');
            fseek($stream, $start);
            echo fread($stream, $length);
            fclose($stream);
        }, 206, $headers);
    }

    /**
     * Check if the view count should be throttled.
     */
    protected function isViewThrottled($videoId)
    {
        // Implement your throttling logic here (e.g., using cache or session)
        return false; // Example: No throttling
    }

    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'video' => 'required|file|mimes:mp4,mov,avi|max:102400', // 100MB max
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:5000',
        ], [
            'video.max' => 'The video file must not exceed 100MB.', // Custom error message
            'video.mimes' => 'The video file must be of type: mp4, mov, avi.', // Custom error message
        ]);

        try {
            // Generate a unique ID for the video
            $uniqueId = Str::uuid();

            // Generate a unique filename
            $extension = $request->file('video')->getClientOriginalExtension();
            $filename = "videos/{$uniqueId}.{$extension}"; // Include unique ID in the filename

            // Store the video in the public folder
            $path = $request->file('video')->storeAs('videos', basename($filename), 'public');

            Log::info("Uploaded file path: " . $path, [
                'user_id' => Auth::id(),
                'file_size' => $request->file('video')->getSize(),
                'mime_type' => $request->file('video')->getMimeType(),
            ]);

            // Save video details in the database
            $video = Video::create([
                'unique_id' => $uniqueId, // Store the unique ID
                'title' => $validated['title'] ?? 'Untitled Video',
                'description' => $validated['description'] ?? '',
                'url' => $filename, // Store the relative path
                'thumbnail' => '/images/default-thumbnail.jpg', // Default thumbnail
                'user_id' => Auth::id(),
                'publisher_name' => Auth::user()->name,
                'duration' => null, // Will be updated during processing
            ]);

            Log::info("Video ID {$video->id} saved in the database.", [
                'video_url' => $video->url,
                'user_id' => Auth::id(),
            ]);

            // Dispatch the processing job with a 5-second delay
            ProcessVideo::dispatch($video->id)->delay(now()->addSeconds(5));

            return response()->json([
                'message' => 'Video uploaded successfully! Processing in the background...',
                'video' => [
                    'id' => $video->id,
                    'title' => $video->title,
                    'description' => $video->description,
                    'uploaded_at' => $video->created_at,
                ],
            ], 201);
        } catch (\Exception $e) {
            Log::error("Video upload failed: " . $e->getMessage(), [
                'user_id' => Auth::id(),
                'file' => $request->file('video') ? $request->file('video')->getClientOriginalName() : null,
            ]);

            return response()->json([
                'message' => 'An error occurred while uploading the video. Please try again.',
            ], 500);
        }
    }
}