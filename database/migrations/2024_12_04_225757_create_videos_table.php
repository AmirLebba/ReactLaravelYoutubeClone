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
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->string('publisher_name')->nullable();
            $table->integer('views')->default(0);
            $table->time('duration')->nullable();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Handles unsigned and foreign key constraint
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('url')->nullable()->change();
            $table->string('thumbnail')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};