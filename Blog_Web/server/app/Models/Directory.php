<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Directory extends Model
{
    use HasFactory;

    protected $table = 'directories';

    /**
     * The model's default values for attributes.
     *
     * @var array
     */
    protected $attributes = [
        'data_type' => 'directory',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'childDirs',
        'notes',
        'schedules',
    ];

    protected $cast = [
        'archived' => 'boolean',
        'published' => 'boolean',
    ];

    protected $fillable = [
        'title',
        'icon',
        'user_id',
        'directory_id',
        'archived',
        'published',
    ];

    protected $appends = [
        // 'child_items',
        'path',
    ];

    protected static function booted()
    {
        static::deleting(function ($dir) {
            // Delete all descendant directories
            // $dir->childDirs->each(function ($childDir) {
            //     $childDir->delete();
            // });

            // Delete all notes and schedules
            // $dir->notes->each->delete();
            // $dir->schedules->each->delete();
            // $dir->flashcardDecks->each->delete();
        });
    }

    // Attributes
    protected function path(): Attribute
    {
        try {
            $path = array(
                (object) [
                    'icon' => $this->icon,
                    'id' => $this->id,
                    'title' => $this->title,
                ]
            );

            // If a directory doesn't have a parent dir
            // Its either Public or Private directory
            $parent_dir_id = $this->directory_id;
            // $parent_dir = $this->parentDir;

            if ($parent_dir_id) {
                $parent_dir = Directory::findOrFail($parent_dir_id);

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

                    if ($parent_dir_id == null) {
                        return Attribute::make(
                            get: fn () => $path,
                        );
                    }

                    $parent_dir = Directory::findOrFail($parent_dir_id);
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
            }

            return Attribute::make(
                get: fn () => $path,
            );
        } catch (Exception $e) {
            return Attribute::make(
                get: fn () => $e->getMessage(),
            );
        }
    }

    // Use to get all the child elements of a dir
    protected function childItems(): Attribute
    {
        return Attribute::make(
            get: fn () => array_merge(
                $this->childDirs->all(),
                $this->notes->all(),
                $this->schedules->all(),
                $this->flashcardDecks->all(),
            ),
        );
    }

    // Relations
    // A specific folder belongs to a specific user
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // A folder can contain many notes
    public function notes(): HasMany
    {
        return $this->hasMany(Note::class)->orderBy('updated_at', 'desc');
    }

    // A folder can contain many schedules
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class)->orderBy('updated_at', 'desc');
    }

    // A directory can contains many flashcard decks
    public function flashcardDecks(): HasMany
    {
        return $this->hasMany(FlashcardDeck::class)->orderBy('updated_at', 'desc');
    }

    // A directory can belongs to a directory
    public function parentDir()
    {
        return $this->belongsTo(Directory::class, 'directory_id', 'id');
    }

    // And a directory can has many directory too
    public function childDirs(): HasMany
    {
        return $this->hasMany(Directory::class, 'directory_id', 'id')
            // ->with('childDirs')
            ->orderBy('updated_at', 'desc');
    }
}
