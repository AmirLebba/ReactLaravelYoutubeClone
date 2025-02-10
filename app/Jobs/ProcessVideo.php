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
        set_time_limit(900); // ⬅️ Ensure PHP allows longer execution time
        
        $video = Video::find($this->videoId);

        if (!$video) {
            Log::error("FFmpeg: Video not found in database for ID: " . $this->videoId);
            return;
        }

        $disk = Storage::disk('public');  // ✅ Public disk
        $originalPath = $video->url;
        $videoPath = storage_path("app/public/" . $originalPath);  // ✅ Correct path

        // ✅ Ensure video exists
        if (!file_exists($videoPath)) {
            Log::error("FFmpeg: Video file not found at path: " . $videoPath);
            return;
        }

        try {
            $ffmpeg = FFMpeg::create();
            $videoFile = $ffmpeg->open($videoPath);

            // ✅ Extract duration
            $streams = $videoFile->getStreams()->videos();
            if (count($streams) === 0) {
                Log::error("FFmpeg: No video streams found in file: " . $videoPath);
                return;
            }

            $durationInSeconds = $streams->first()->get('duration');
            $formattedDuration = gmdate("H:i:s", $durationInSeconds);

            // ✅ Process different resolutions
            $resolutions = [
                '1080p' => ['width' => 1920, 'height' => 1080, 'bitrate' => 2500],
                '720p'  => ['width' => 1280, 'height' => 720, 'bitrate' => 1500],
                '480p'  => ['width' => 854, 'height' => 480, 'bitrate' => 800],
            ];

            $videoUrls = [];

            foreach ($resolutions as $key => $res) {
                $convertedFilename = "videos/{$video->id}_{$key}.webm";
                $convertedPath = storage_path("app/public/{$convertedFilename}");

                $format = new WebM();
                $format->setKiloBitrate($res['bitrate']);

                $videoFile->filters()
                    ->resize(new Dimension($res['width'], $res['height']))
                    ->synchronize();

                $videoFile->save($format, $convertedPath);

                $videoUrls[$key] = $convertedFilename;
            }

            // ✅ Generate Thumbnail
            $thumbnailFilename = "thumbnails/{$video->id}.jpg";
            $thumbnailPath = storage_path("app/public/{$thumbnailFilename}");

            $videoFile->frame(TimeCode::fromSeconds(3))
                ->save($thumbnailPath);

            // ✅ Update Database
            $video->update([
                'url' => json_encode($videoUrls),
                'duration' => $formattedDuration,
                'thumbnail' => $thumbnailFilename,
            ]);

            // ✅ Move to Private Folder After Processing
            $privateDisk = Storage::disk('local');
            foreach ($videoUrls as $key => $convertedFile) {
                $publicDisk = Storage::disk('public');
                if ($publicDisk->exists($convertedFile)) {
                    $privateDisk->put($convertedFile, $publicDisk->get($convertedFile));
                    $publicDisk->delete($convertedFile);
                }
            }

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