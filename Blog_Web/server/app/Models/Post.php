<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Post extends Model
{
    use HasFactory;

    protected $table = 'posts';

    protected $hidden = [
        'user',
    ];

    protected $appends = [
        'poster',
        'likes_count',
        'stars_count',
        'current_user_interact',
    ];

    protected $fillable = [
        'post_type',
        'title',
        'banner',
        'content_json',
        'content_html',
    ];

    // Attribute
    // User who posted this post
    protected function poster(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->user,
        );
    }

    protected function likesCount(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->calculateLikes(),
        );
    }

    protected function starsCount(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->calculateStars(),
        );
    }

    protected function currentUserInteract(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getCurrentUserInteract(),
        );
    }

    // Relation
    // It will be created by 1 user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // A post can attach many notes
    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    // A post can have many comments
    public function comments()
    {
        return $this->hasMany(PostComment::class);
    }

    public function notifications(): MorphMany
    {
        return $this->morphMany(Notification::class, 'notifiable');
    }

    public function userInteractions(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->using(PostUser::class);
    }

    // Helpers
    public function calculateLikes()
    {
        return $this->userInteractions()
            ->withPivot('like')
            ->where('like', true)
            ->count();
    }

    public function calculateStars()
    {
        return $this->userInteractions()
            ->withPivot('star')
            ->where('star', true)
            ->count();
    }

    public function getCurrentUserInteract()
    {
        $user = auth()->user();
        if ($user) {
            if (!$this->userInteractions()
                ->where('user_id', $user->id)
                ->exists()) {
                $this->userInteractions()->attach($user->id);
            }
            return $this->userInteractions()
                ->withPivot('like', 'star')
                ->where('user_id', $user->id)
                ->first()->pivot;
        }
    }
}
