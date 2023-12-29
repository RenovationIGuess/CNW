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
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->unsignedBigInteger('directory_id')->index();

            $table->string('icon')->nullable();
            $table->string('background_image')->nullable();
            $table->string('title')->default('New Note');
            // $table->string('path')->default('');
            $table->string('data_type');
            $table->string('description')->nullable();
            $table->boolean('starred')->default(false);
            $table->text('content_json')->nullable();
            $table->text('content_html')->nullable();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('directory_id')->references('id')->on('directories')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
