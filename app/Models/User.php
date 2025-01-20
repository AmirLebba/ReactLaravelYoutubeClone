<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens; // Import the trait
use Illuminate\Support\Facades\DB;

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
        'id', // Allow mass assignment for custom ID
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
     * Boot method to handle model events.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            // Generate a unique 6-digit ID
            do {
                $user->id = random_int(100000, 999999);
            } while (DB::table('users')->where('id', $user->id)->exists());
        });
    }

    /**
     * Get the videos uploaded by the user.
     */
    public function videos()
    {
        return $this->hasMany(Video::class);
    }

    /**
     * Relation to get the user (if applicable).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}