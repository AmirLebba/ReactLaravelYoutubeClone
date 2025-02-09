<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use FFMpeg\FFMpeg;
use FFMpeg\Format\Video\WebM;
use FFMpeg\Coordinate\Dimension;
use FFMpeg\Coordinate\TimeCode;
use App\Models\Video;

class ProcessVideo implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $video;

    public function __construct(Video $video)
    {
        $this->video = $video;
    }

    public function handle()
    {
        $disk = Storage::disk('local'); // Private Storage
        $originalPath = "videos/{$this->video->url}";
        $videoPath = storage_path("app/{$originalPath}");

        // Initialize FFmpeg
        $ffmpeg = FFMpeg::create();
        $videoFile = $ffmpeg->open($videoPath);

        // ✅ Extract Video Duration
        $durationInSeconds = $videoFile->getStreams()->videos()->first()->get('duration');
        $formattedDuration = gmdate("H:i:s", $durationInSeconds);

        // ✅ Define Resolutions
        $resolutions = [
            '1080p' => ['width' => 1920, 'height' => 1080, 'bitrate' => 2500],
            '720p'  => ['width' => 1280, 'height' => 720, 'bitrate' => 1500],
            '480p'  => ['width' => 854, 'height' => 480, 'bitrate' => 800],
        ];

        $videoUrls = [];

        foreach ($resolutions as $key => $res) {
            $convertedFilename = "videos/{$this->video->id}_{$key}.webm";
            $convertedPath = storage_path("app/{$convertedFilename}");

            $format = new WebM();
            $format->setKiloBitrate($res['bitrate']); // Set bitrate for compression

            // Convert to specific resolution
            $videoFile->filters()
                ->resize(new Dimension($res['width'], $res['height']))
                ->synchronize();

            $videoFile->save($format, $convertedPath);

            $videoUrls[$key] = $convertedFilename;
        }

        // ✅ Generate Thumbnail
        $thumbnailFilename = "thumbnails/{$this->video->id}.jpg";
        $thumbnailPath = storage_path("app/{$thumbnailFilename}");

        $videoFile->frame(TimeCode::fromSeconds(3))
            ->save($thumbnailPath);

        // ✅ Compress Thumbnail using GD Library
        $this->compressImage($thumbnailPath, $thumbnailPath, 75);

        // ✅ Update Database
        $this->video->update([
            'url' => json_encode($videoUrls), // Store multiple resolutions
            'duration' => $formattedDuration,
            'thumbnail' => $thumbnailFilename,
        ]);

        // ✅ Delete Original Video to Save Space
        $disk->delete($originalPath);
    }

    /**
     * Compress JPEG image
     */
    private function compressImage($source, $destination, $quality = 75)
    {
        $image = imagecreatefromjpeg($source);

        if (!$image) {
            return false; // Handle error
        }

        imagejpeg($image, $destination, $quality);
        imagedestroy($image);

        return true;
    }
}
