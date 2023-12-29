<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Schedule extends Model
{
    use HasFactory;

    protected $table = 'schedules';

    protected $hidden = [
        'user',
        'scheduleTags',
        'scheduleEvents'
    ];

    protected $appends = [
        // 'creator',
        'tags',
        // 'events',
        'path',
    ];

    protected $cast = [
        'starred' => 'boolean',
    ];

    protected $fillable = [
        'title',
        'description',
        'icon',
        'background_image',
        'starred',
        'user_id',
        'directory_id',
    ];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->attributes['description'] = 'None';
        $this->attributes['data_type'] = 'schedule';
        $this->attributes['starred'] = false;
    }

    protected static function booted()
    {
        // When we delete a schedule, all events that only belongs to it will also get deleted
        static::deleting(function ($schedule) {
            // After a schedule is deleted, check each associated event
            foreach ($schedule->scheduleEvents as $event) {
                // If the event has no more schedules, delete it
                if ($event->schedules->count() === 1) {
                    $event->delete();
                }
            }
        });
    }


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
            get: fn () => $this->scheduleTags,
        );
    }

    protected function events(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->scheduleEvents,
        );
    }

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function directory(): BelongsTo
    {
        return $this->belongsTo(Directory::class);
    }

    public function scheduleTags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    public function scheduleEvents(): BelongsToMany
    {
        return $this->belongsToMany(Event::class);
    }

    public function notifications(): MorphMany
    {
        return $this->morphMany(Notification::class, 'notifiable');
    }

    public function trashedVersion()
    {
        return $this->morphOne(Trash::class, 'trashable');
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
