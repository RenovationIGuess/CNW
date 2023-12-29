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
        Schema::create('user_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique();

            $table->string('language')->default('en');
            $table->string('timezone')->default('UTC');

            $table->boolean('show_conf_cancel_edit_note')->default(false);
            $table->boolean('show_conf_delete_note')->default(false);

            $table->boolean('show_conf_delete_event')->default(false);
            $table->boolean('show_conf_cancel_create_event')->default(false);
            $table->boolean('show_conf_cancel_edit_event')->default(false);

            $table->boolean('show_conf_delete_schedule')->default(false);
            $table->boolean('show_conf_cancel_create_schedule')->default(false);
            $table->boolean('show_conf_cancel_edit_schedule')->default(false);

            $table->boolean('show_conf_delete_deck')->default(false);
            $table->boolean('show_conf_cancel_create_deck')->default(false);
            $table->boolean('show_conf_cancel_edit_deck')->default(false);

            // Card in flashcard
            $table->boolean('show_conf_delete_card')->default(false);
            $table->boolean('show_conf_cancel_create_card')->default(false);
            $table->boolean('show_conf_cancel_edit_card')->default(false);

            $table->foreign('user_id')
                ->references('id')
                ->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_settings');
    }
};
