<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'url' => 'array', // Auto-decode JSON when fetching
        'thumbnail',
        'user_id',
        'publisher_name',
        'views',
        'duration',
    ];

}