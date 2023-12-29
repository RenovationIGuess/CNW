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
        Schema::create('flashcards', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('deck_id');

            $table->string('front_title');
            $table->text('front_content')->nullable();
            $table->string('back_title');
            $table->text('back_content')->nullable();
            // Use for anki learn type
            $table->string('appear_type');
            // Use for kotoba web learn type
            $table->integer('correct_times');
            $table->double('correct_rate');
            $table->integer('wrong_times');
            $table->boolean('starred')->default(false);

            $table->foreign('deck_id')
                ->references('id')
                ->on('flashcard_decks')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flashcards');
    }
};
