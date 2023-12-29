<?php

namespace App\Models;

use App\Traits\HasPath;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class FlashcardDeck extends Model
{
    use HasFactory;
    use HasPath;

    protected $table = 'flashcard_decks';

    protected $hidden = [
        'flashcardDeckTags',
    ];

    protected $fillable = [
        'user_id',
        'directory_id',
        'data_type',
        'title',
        'icon',
        'description',
        'starred',
    ];

    protected $appends = [
        'tags',
        'path',
        // 'creator',
    ];

    protected $casts = [
        'starred' => 'boolean',
    ];

    // Attributes
    protected function creator(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->user,
        );
    }

    protected function tags(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->flashcardDeckTags,
        );
    }

    // Construct
    public function __construct($attributes = [])
    {
        parent::__construct($attributes);

        $this->attributes['description'] = 'None';
        $this->attributes['data_type'] = 'deck';
        $this->attributes['starred'] = false;
    }

    // Boot

    // Attributes

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function directory(): BelongsTo
    {
        return $this->belongsTo(Directory::class);
    }

    public function flashcards(): HasMany
    {
        return $this->hasMany(Flashcard::class, 'deck_id');
    }

    public function flashcardDeckTags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    public function notifications(): MorphMany
    {
        return $this->morphMany(Notification::class, 'notifiable');
    }

    // Morphism
    // Attach to an existing event
    public function events(): MorphToMany
    {
        return $this->morphedByMany(Event::class, 'deckable');
    }
}
