<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->unique(); // Custom unique identifier
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('avatar')->default('https://reedbarger.nyc3.digitaloceanspaces.com/default-avatar.png');
            $table->string('cover')->default('https://reedbarger.nyc3.digitaloceanspaces.com/default-cover-banner.png');
            $table->text('about')->default('');
            $table->json('social_links')->nullable();
            $table->timestamps();

            $table->primary('id'); // Set the custom id as the primary key
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};