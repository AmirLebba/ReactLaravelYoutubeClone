<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;
   
    protected $collection = 'videos';

    // Define the table if it's not the default 'videos'
    protected $table = 'videos';

    // Define the fillable fields
    protected $fillable = [
        'title',
        'description',
        'url',
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