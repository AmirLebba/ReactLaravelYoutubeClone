<?php

namespace App\Jobs;

use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Video;
use FFMpeg\FFMpeg;
use FFMpeg\Format\Video\X264;
use FFMpeg\Format\Video\WebM;
use FFMpeg\Coordinate\Dimension;
use FFMpeg\Coordinate\TimeCode;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProcessVideo implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 900; // ⬅️ Increase execution time limit (5 mins)

    public $videoId;

    public function __construct($videoId)
    {
        $this->videoId = $videoId;
    }

    public function handle()
    {
        set_time_limit(3600); // 1 hour

        // Fetch the video from the database
        $video = Video::find($this->videoId);

        if (!$video) {
            Log::error("FFmpeg: Video not found in database for ID: " . $this->videoId);
            return;
        }

        // Check if the video URL is valid
        $originalPath = $video->url;
        if (empty($originalPath)) {
            Log::error("FFmpeg: Video URL is empty for video ID: " . $this->videoId);
            $video->update(['status' => 'Failed']);
            return;
        }

        // Update status to "Processing"
        $video->update(['status' => 'Processing']);
        Log::info("FFmpeg: Video status updated to Processing for video ID: " . $video->id);

        // Construct the full path to the video file
        $videoPath = storage_path("app/public/" . $originalPath);

        // Ensure the video file exists
        if (!Storage::disk('public')->exists($originalPath)) {
            Log::error("FFmpeg: File not found at path - " . $videoPath);
            $video->update(['status' => 'Failed']);
            return;
        }

        Log::info("FFmpeg: Processing file at path - " . $videoPath);

        try {
            // Initialize FFmpeg
            $ffmpeg = FFMpeg::create(['ffmpeg.threads' => 5]); // Increase threads to 5
            $videoFile = $ffmpeg->open($videoPath);

            // Validate video stream
            $streams = $videoFile->getStreams()->videos();
            if (count($streams) === 0) {
                Log::error("FFmpeg: No video streams found in file: " . $videoPath);
                $video->update(['status' => 'Failed']);
                return;
            }

            $durationInSeconds = $streams->first()->get('duration');
            if (!$durationInSeconds) {
                Log::error("FFmpeg: Unable to extract duration from video stream.");
                $video->update(['status' => 'Failed']);
                return;
            }

            $formattedDuration = gmdate("H:i:s", $durationInSeconds);

            // Get input video dimensions
            $inputWidth = $streams->first()->get('width');
            $inputHeight = $streams->first()->get('height');

            // Define resolutions to process
            $resolutions = [];
            if ($inputWidth >= 1920 && $inputHeight >= 1080) {
                $resolutions['1080p'] = ['width' => 1920, 'height' => 1080, 'bitrate' => 1700];
            }
            if ($inputWidth >= 1280 && $inputHeight >= 720) {
                $resolutions['720p'] = ['width' => 1280, 'height' => 720, 'bitrate' => 1000];
            }
            $resolutions['480p'] = ['width' => 854, 'height' => 480, 'bitrate' => 600];

            $videoUrls = []; // Define the array to store processed video URLs

            // Process each resolution
            foreach ($resolutions as $key => $res) {
                // Step 1: Resize the video
                $resizedFilename = "videos/{$video->unique_id}_{$key}_resized.mp4";
                $resizedPath = storage_path("app/public/{$resizedFilename}");

                $videoFile->filters()
                    ->resize(new Dimension($res['width'], $res['height']))
                    ->synchronize();

                // Save the resized video (without compression)
                $videoFile->save(new X264(), $resizedPath);

                // Step 2: Compress the resized video with two-pass encoding
                $compressedFilename = "videos/{$video->unique_id}_{$key}_compressed.mp4";
                $compressedPath = storage_path("app/public/{$compressedFilename}");

                // Manually construct the FFmpeg command for two-pass encoding
                $ffmpegCommand = sprintf(
                    'ffmpeg -y -i %s -c:v libx264 -b:v %dk -pass 1 -an -f mp4 /dev/null && ' .
                    'ffmpeg -y -i %s -c:v libx264 -b:v %dk -pass 2 -c:a aac -b:a 128k %s',
                    escapeshellarg($resizedPath), // Input file
                    $res['bitrate'], // Video bitrate
                    escapeshellarg($resizedPath), // Input file (again for the second pass)
                    $res['bitrate'], // Video bitrate
                    escapeshellarg($compressedPath) // Output file
                );

                // Execute the FFmpeg command
                exec($ffmpegCommand);

                // Delete the intermediate resized file
                Storage::disk('public')->delete($resizedFilename);

                // Store the compressed file path
                $videoUrls[$key] = $compressedFilename;
                Log::info("FFmpeg: Successfully processed and compressed resolution {$key}.");
            }

            // Generate and compress thumbnail
            $thumbnailFilename = "thumbnails/{$video->unique_id}.jpg";
            $thumbnailPath = storage_path("app/public/{$thumbnailFilename}");

            $videoFile->frame(TimeCode::fromSeconds(3))->save($thumbnailPath);
            $this->compressImage($thumbnailPath, $thumbnailPath, 75); // Ensure this method exists

            // Move processed files to private storage
            $privateDisk = Storage::disk('private');
            foreach ($videoUrls as $convertedFile) {
                if (Storage::disk('public')->exists($convertedFile)) {
                    $privateDisk->put($convertedFile, Storage::disk('public')->get($convertedFile));
                    Storage::disk('public')->delete($convertedFile);
                }
            }

            // Delete the original video file
            if (Storage::disk('public')->exists($originalPath)) {
                Storage::disk('public')->delete($originalPath);
            }

            // Update the video record
            $video->update([
                'url' => json_encode([
                    '1080p' => route('watch.video', ['uniqueId' => $video->unique_id, 'resolution' => '1080p']),
                    '720p'  => route('watch.video', ['uniqueId' => $video->unique_id, 'resolution' => '720p']),
                    '480p'  => route('watch.video', ['uniqueId' => $video->unique_id, 'resolution' => '480p']),
                ]),
                'duration' => $formattedDuration,
                'thumbnail' => Storage::url($thumbnailFilename),
                'status' => 'Completed', // Update status to "Completed"
            ]);

            Log::info("FFmpeg: Video status updated to Completed for video ID: " . $video->id);
            Log::info("FFmpeg: Video processing completed for video ID: " . $video->id);
        } catch (\Exception $e) {
            Log::error("FFmpeg Error: " . $e->getMessage());
            $video->update(['status' => 'Failed']);
            Log::info("FFmpeg: Video status updated to Failed for video ID: " . $video->id);
        }
    }


    /**
     * Compress JPEG image
     */
    private function compressImage($source, $destination, $quality = 75)
    {
        $image = imagecreatefromjpeg($source);
        if (!$image) {
            Log::error("Image compression failed: Unable to create image from source.");
            return false;
        }

        imagejpeg($image, $destination, $quality);
        imagedestroy($image);
        return true;
    }
}