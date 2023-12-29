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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            // $table->unsignedBigInteger('schedule_id');
            $table->unsignedBigInteger('user_id');

            $table->string('title');
            $table->string('priority')->nullable();
            // $table->boolean('all_day');
            $table->string('background_color');
            $table->string('description')->nullable();
            $table->dateTimeTz('start_date');
            $table->dateTimeTz('end_date');
            $table->boolean('pinned');

            // $table->foreign('schedule_id')->references('id')->on('schedules')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
