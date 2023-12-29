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
        Schema::create('note_comments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('note_id')->index();
            $table->unsignedBigInteger('user_id')->index();
            // If note comment id is not null, then this it is a reply
            $table->unsignedBigInteger('note_comment_id')->index()->nullable();
            $table->unsignedBigInteger('reply_to')->index()->nullable();

            $table->text('content_json');
            $table->text('content_html');
            $table->text('selected_text')->nullable();
            $table->boolean('pinned')->default(false);

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('note_id')->references('id')->on('notes')->onDelete('cascade');
            $table->foreign('note_comment_id')->references('id')->on('note_comments')->onDelete('cascade');
            $table->foreign('reply_to')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('note_comments');
    }
};
