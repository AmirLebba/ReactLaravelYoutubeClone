<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'unique_id',
        'title',
        'description',
        'url',
        'thumbnail',
        'user_id',
        'publisher_name',
        'views',
        'duration',
    ];

    /**
     * Decode the 'url' field (stored as JSON) into an array.
     *
     * @return array
     */
    public function getVideoUrlsAttribute()
    {
        return json_decode($this->attributes['url'], true);
    }
}