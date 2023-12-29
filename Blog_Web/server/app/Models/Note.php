<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Note extends Model
{
    use HasFactory;

    protected $table = 'notes';

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'directory',
        'noteTags',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'starred' => 'boolean',
    ];

    protected $fillable = [
        'title',
        'icon',
        'description',
        'content_json',
        'content_html',
        'starred',
        'background_image',
        'user_id',
        'directory_id',
    ];

    protected $appends = [
        'path',
        'tags',
    ];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->attributes['data_type'] = 'note';
    }

    // Attributes
    protected function tags(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->noteTags,
        );
    }

    // A note is owned by one user
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // A note can has many change histories
    public function histories(): HasMany
    {
        return $this->hasMany(NoteHistory::class)->orderBy('created_at', 'DESC');
    }

    // A note can has many comments
    public function comments(): HasMany
    {
        return $this->hasMany(NoteComment::class)->orderBy('created_at', 'DESC');
    }

    public function directory(): BelongsTo
    {
        return $this->belongsTo(Directory::class);
    }

    public function noteTags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    public function notifications(): MorphMany
    {
        return $this->morphMany(Notification::class, 'notifiable');
    }

    public function trashedVersion(): MorphOne
    {
        return $this->morphOne(Trash::class, 'trashable');
    }

    // Morphism
    public function events(): MorphToMany
    {
        return $this->morphByMany(Event::class, 'notable');
    }

    public function flashcards(): MorphToMany
    {
        return $this->morphedByMany(Flashcard::class, 'notable');
    }

    public function childNotes(): MorphToMany
    {
        return $this->morphToMany(Note::class, 'notable');
    }

    public function parentNotes(): MorphToMany
    {
        return $this->morphedByMany(Note::class, 'notable');
    }

    // Get the path to the source directory (Either Public | Private)
    protected function path(): Attribute
    {
        try {
            $directory_id = $this->directory_id;
            $directory = Directory::find($directory_id);

            $path = array(
                (object) [
                    'icon' => $directory->icon,
                    'id' => $directory->id,
                    'title' => $directory->title,
                ]
            );

            $parent_dir_id = $directory->directory_id;

            // Add a check for `null`
            if ($parent_dir_id == null) {
                return Attribute::make(
                    get: fn () => $path,
                );
            }

            $parent_dir = Directory::find($parent_dir_id);

            while ($parent_dir->title != 'Private' && $parent_dir->title != 'Public') {
                array_unshift(
                    $path,
                    (object) [
                        'icon' => $parent_dir->icon,
                        'id' => $parent_dir->id,
                        'title' => $parent_dir->title,
                    ]
                );

                $parent_dir_id = $parent_dir->directory_id;

                // Add a check for `null`
                if ($parent_dir_id == null) {
                    return Attribute::make(
                        get: fn () => $path,
                    );
                }

                $parent_dir = Directory::find($parent_dir_id);
            }

            // Append the Public / Private dir
            array_unshift(
                $path,
                (object) [
                    'icon' => $parent_dir->icon,
                    'id' => $parent_dir->id,
                    'title' => $parent_dir->title,
                ]
            );

            return Attribute::make(
                get: fn () => $path,
            );
        } catch (Exception $e) {
            return Attribute::make(
                get: fn () => $e->getMessage(),
            );
        }
    }
}
