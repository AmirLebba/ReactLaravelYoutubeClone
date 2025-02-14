<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

use FFMpeg\FFProbe;


use FFMpeg\FFMpeg;

use FFMpeg\Coordinate\TimeCode;








use App\Models\Video;


use Illuminate\Support\Facades\Storage;

use FFMpeg\Coordinate\Dimension;

use Illuminate\Support\Facades\Log;
use FFMpeg\Format\Video\WebM;




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
            return;
        }

        // Construct the full path to the video file
        $videoPath = storage_path("app/public/" . $originalPath);

        // Ensure the video file exists
        if (!Storage::disk('public')->exists($originalPath)) {
            Log::error("FFmpeg: File not found at path - " . $videoPath);
            return;
        }

        Log::info("FFmpeg: Processing file at path - " . $videoPath);

        try {
            // Initialize FFmpeg
            $ffmpeg = FFMpeg::create(['ffmpeg.threads' => 3]); // Limit threads to 3
            $videoFile = $ffmpeg->open($videoPath);

            // Extract video duration
            $streams = $videoFile->getStreams()->videos();
            if (count($streams) === 0) {
                Log::error("FFmpeg: No video streams found in file: " . $videoPath);
                return;
            }

            $durationInSeconds = $streams->first()->get('duration');
            $formattedDuration = gmdate("H:i:s", $durationInSeconds);

            // Define resolutions to process
            $resolutions = [
                '1080p' => ['width' => 1920, 'height' => 1080, 'bitrate' => 1900],
                '720p'  => ['width' => 1280, 'height' => 720, 'bitrate' => 1400],
                '480p'  => ['width' => 854, 'height' => 480, 'bitrate' => 1000],
            ];

            $videoUrls = []; // Define the array to store processed video URLs

            // Process each resolution
            foreach ($resolutions as $key => $res) {
                $convertedFilename = "videos/{$video->unique_id}_{$key}.webm";
                $convertedPath = storage_path("app/public/{$convertedFilename}");

                $format = new WebM();
                $format->setKiloBitrate($res['bitrate']);

                $videoFile->filters()
                    ->resize(new Dimension($res['width'], $res['height']))
                    ->synchronize();

                $videoFile->save($format, $convertedPath);

                $videoUrls[$key] = $convertedFilename;
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
            ]);

            Log::info("FFmpeg: Video processing completed for video ID: " . $video->id);
        } catch (\Exception $e) {
            Log::error("FFmpeg Error: " . $e->getMessage());
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
