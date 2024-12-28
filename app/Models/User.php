<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens; // Import the trait

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens; // Use the trait

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $connection = 'mysql'; // Use MySQL
    protected $table = 'users';
    protected $fillable = [
        'username',
        'email',
        'password',
        'avatar',
        'cover',
        'about',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the videos uploaded by the user.
     */
    public function videos()
    {
        return $this->hasMany(Video::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
