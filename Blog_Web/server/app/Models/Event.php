<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Event extends Model
{
    use HasFactory;

    protected $table = 'events';

    protected $hidden = [
        'user',
        // 'attachNotes',
        'start_date',
        'end_date',
        'pivot',
    ];

    protected $appends = [
        // 'creator',
        // 'attach_items',
        'start',
        'end',
        'schedules',
    ];

    protected $cast = [
        'pinned' => 'boolean',
        // 'all_day' => 'boolean',
    ];

    protected $fillable = [
        'title',
        'priority',
        'background_color',
        'description',
        'start_date',
        'end_date',
        'pinned',
        // 'all_day',
        'user_id',
        // 'schedule_id',
    ];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        // $this->attributes['icon'] = \config('env.default_task_icon');
        // $this->attributes['all_day'] = false;
        $this->attributes['description'] = 'None';
        $this->attributes['pinned'] = false;
    }

    // Attributes
    public function schedules(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->eventSchedules()->get()->map(function ($event) {
                return $event->pivot->schedule_id;
            }),
        );
    }

    public function creator(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->user,
        );
    }

    public function start(): Attribute
    {
        return Attribute::make(
            get: fn () => Carbon::createFromFormat('Y-m-d H:i:s', $this->start_date, 'UTC')
                ->format('Y-m-d\TH:i:s.u\Z'),
        );
    }

    public function end(): Attribute
    {
        return Attribute::make(
            get: fn () => Carbon::createFromFormat('Y-m-d H:i:s', $this->end_date, 'UTC')
                ->format('Y-m-d\TH:i:s.u\Z'),
        );
    }

    // Relations
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function eventSchedules(): BelongsToMany
    {
        return $this->belongsToMany(Schedule::class);
    }

    // Morphism
    public function notes(): MorphToMany
    {
        return $this->morphedToMany(Note::class, 'notable');
    }

    public function decks(): MorphToMany
    {
        return $this->morphedToMany(FlashcardDeck::class, 'deckable');
    }
}
