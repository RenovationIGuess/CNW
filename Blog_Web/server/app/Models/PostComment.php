<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PostComment extends Model
{
    use HasFactory;

    protected $table = 'post_comments';

    protected $attributes = [
        'pinned' => false,
    ];

    protected $hidden = [
        'user',
        'postCommentReplies',
    ];

    protected $appends = [
        'commentor',
        'likes_count',
        'current_user_interact',
        'reply_to_info',
        'replies',
        'liked_by_poster',
    ];

    protected $fillable = [
        'post_id',
        'user_id',
        'post_comment_id',
        'reply_to',
        'content_json',
        'content_html',
        'pinned',
    ];

    // Attributes
    protected function commentor(): Attribute
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

    protected function currentUserInteract(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getCurrentUserInteract(),
        );
    }

    protected function replies(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->postCommentReplies,
        );
    }

    protected function replyToInfo(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getReplyToInfo(),
        );
    }

    protected function likedByPoster(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->checkPosterLiked(),
        );
    }

    // Relation
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function replyToComment(): BelongsTo
    {
        return $this->belongsTo(PostComment::class, 'post_comment_id');
    }

    public function postCommentReplies(): HasMany
    {
        return $this->hasMany(PostComment::class, 'post_comment_id')->orderBy('created_at', 'desc');
    }

    // Use to control interactions like: liking a post
    public function userInteractions(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->using(PostCommentUser::class)
            ->withTimestamps();;
    }

    // Helpers
    public function calculateLikes()
    {
        return $this->userInteractions()
            ->withPivot('like')
            ->where('like', true)
            ->count();
    }

    // Check if the user who posted the post liked this comment
    public function checkPosterLiked()
    {
        // Post::find($this->post_id)
        $post = $this->post;
        if ($post) {
            if ($this->userInteractions()
                ->where('user_id', $post->user_id)
                ->where('like', true)
                ->exists()
            ) {
                return true;
            }
        }
        return false;
    }

    public function getReplyToInfo()
    {
        $reply_to_id = $this->reply_to;
        if (isset($reply_to_id)) {
            return User::find($reply_to_id);
        }
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
                ->withPivot('like')
                ->where('user_id', $user->id)
                ->first()->pivot->like;
        }
    }
}
