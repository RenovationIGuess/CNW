<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Flashcard extends Model
{
    use HasFactory;

    protected $table = "flashcards";

    protected $fillable = [
        'deck_id',
        'front_title',
        'front_content',
        'back_title',
        'back_content',
        'appear_type',
        'correct_times',
        'correct_rate',
        'wrong_times',
        'starred',
    ];

    protected static function booted()
    {
        static::creating(function ($flashcard) {
            $flashcard->appear_type = 'again';
            $flashcard->correct_times = 0;
            $flashcard->correct_rate = 0;
            $flashcard->wrong_times = 0;
            $flashcard->starred = false;
        });
    }

    // Relations
    public function deck(): BelongsTo
    {
        return $this->belongsTo(FlashcardDeck::class, 'deck_id');
    }

    public function notes(): MorphToMany
    {
        return $this->morphedToMany(Note::class, 'notable');
    }
}
