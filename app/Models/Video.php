<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;
    protected $connection = 'mongodb'; // Use MongoDB
    protected $collection = 'videos';

    protected $fillable = [
        'title',
        'thumbnail',
        'duration',
        'video_id',
        'video_owner',
        'likes',
        'comments',
        'storage_link'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function videos()
    {
        return $this->hasMany(Video::class);
    }
}
