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
use FFMpeg\Coordinate\Dimension;
use FFMpeg\Coordinate\TimeCode;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProcessVideo implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 1800; // Increase timeout to 30 minutes
    protected $videoId;

    public function __construct($videoId)
    {
        $this->videoId = $videoId;
    }

    public function handle()
    {
        set_time_limit(3600); // Ensure no timeouts

        $video = Video::find($this->videoId);
        if (!$video) {
            Log::error("FFmpeg: Video not found for ID: {$this->videoId}");
            return;
        }

        $originalPath = $video->url;
        if (!$originalPath || !Storage::disk('public')->exists($originalPath)) {
            Log::error("FFmpeg: File not found - {$originalPath}");
            $video->update(['status' => 'Failed']);
            return;
        }

        $video->update(['status' => 'Processing']);
        Log::info("FFmpeg: Processing video ID: {$video->id}");

        $videoPath = storage_path("app/public/{$originalPath}");
        try {
            // Initialize FFmpeg
            $ffmpeg = FFMpeg::create(['ffmpeg.threads' => 5]);
            $videoFile = $ffmpeg->open($videoPath);

            // Extract video metadata
            $stream = $videoFile->getStreams()->videos()->first();
            if (!$stream) {
                throw new \Exception("No video stream found");
            }

            $duration = gmdate("H:i:s", $stream->get('duration'));
            $width = $stream->get('width');
            $height = $stream->get('height');

            $resolutions = [];
            if ($width >= 1920 && $height >= 1080) {
                $resolutions['1080p'] = ['w' => 1920, 'h' => 1080, 'bitrate' => 1700];
            }
            if ($width >= 1280 && $height >= 720) {
                $resolutions['720p'] = ['w' => 1280, 'h' => 720, 'bitrate' => 1000];
            }
            $resolutions['480p'] = ['w' => 854, 'h' => 480, 'bitrate' => 600];

            $videoUrls = [];

            foreach ($resolutions as $resKey => $res) {
                $compressedFilename = "videos/{$video->unique_id}_{$resKey}.mp4";
                $compressedPath = storage_path("app/public/{$compressedFilename}");
                $passLogFile = storage_path("app/temp/ffmpeg2pass-{$video->unique_id}");

                // Ensure temp directory exists
                Storage::makeDirectory('temp');

                // Resize and encode with two-pass encoding
                $ffmpegCommand = sprintf(
                    'ffmpeg -y -i %s -vf scale=%d:%d -c:v libx264 -b:v %dk -pass 1 -passlogfile %s -an -f mp4 NUL && ' .
                        'ffmpeg -y -i %s -vf scale=%d:%d -c:v libx264 -b:v %dk -pass 2 -passlogfile %s -c:a aac -b:a 128k %s',
                    escapeshellarg($videoPath),
                    $res['w'],
                    $res['h'],
                    $res['bitrate'],
                    escapeshellarg($passLogFile),
                    escapeshellarg($videoPath),
                    $res['w'],
                    $res['h'],
                    $res['bitrate'],
                    escapeshellarg($passLogFile),
                    escapeshellarg($compressedPath)
                );

                exec($ffmpegCommand, $output, $returnCode);

                if ($returnCode !== 0) {
                    throw new \Exception("FFmpeg failed for {$resKey}");
                }

                // Clean up FFmpeg pass logs
                foreach (["{$passLogFile}-0.log", "{$passLogFile}-0.log.mbtree"] as $logFile) {
                    if (file_exists($logFile)) {
                        unlink($logFile);
                    }
                }

                // Store the file URL
                $videoUrls[$resKey] = $compressedFilename;
                Log::info("FFmpeg: Successfully processed {$resKey}");
            }

            // Generate and optimize thumbnail
            $thumbnailFilename = "thumbnails/{$video->unique_id}.jpg";
            $thumbnailPath = storage_path("app/public/{$thumbnailFilename}");
            $videoFile->frame(TimeCode::fromSeconds(3))->save($thumbnailPath);
            $this->compressImage($thumbnailPath, $thumbnailPath);

            // Move processed files to private storage
            foreach ($videoUrls as $resKey => $filePath) {
                $privatePath = "private/{$filePath}";
                Storage::disk('private')->put($privatePath, Storage::disk('public')->get($filePath));
                Storage::disk('public')->delete($filePath);
            }

            // Delete original video
            Storage::disk('public')->delete($originalPath);

            // Update database
            $video->update([
                'url' => json_encode([
                    '1080p' => route('watch.video', ['uniqueId' => $video->unique_id, 'resolution' => '1080p']),
                    '720p'  => route('watch.video', ['uniqueId' => $video->unique_id, 'resolution' => '720p']),
                    '480p'  => route('watch.video', ['uniqueId' => $video->unique_id, 'resolution' => '480p']),
                ]),
                'duration' => $duration,
                'thumbnail' => Storage::url($thumbnailFilename),
                'status' => 'Completed',
            ]);

            Log::info("FFmpeg: Processing complete for video ID: {$video->id}");
        } catch (\Exception $e) {
            Log::error("FFmpeg Error: " . $e->getMessage());
            $video->update(['status' => 'Failed']);
        }
    }

    /**
     * Compress JPEG image
     */
    private function compressImage($source, $destination, $quality = 75)
    {
        try {
            $image = imagecreatefromjpeg($source);
            if (!$image) throw new \Exception("Invalid image file");
            imagejpeg($image, $destination, $quality);
            imagedestroy($image);
        } catch (\Exception $e) {
            Log::error("Thumbnail compression failed: " . $e->getMessage());
        }
    }
}
