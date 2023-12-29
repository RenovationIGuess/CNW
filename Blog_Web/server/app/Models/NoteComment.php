<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NoteComment extends Model
{
    use HasFactory;

    protected $table = 'note_comments';

    protected $hidden = [
        'user',
    ];

    protected $fillable = [
        'note_id',
        'user_id',
        'note_comment_id',
        'reply_to',
        'content_json',
        'content_html',
        'selected_text',
        'pinned',
    ];

    protected $appends = [
        'commentor',
        'upvote_count',
        'downvote_count',
        'current_user_interact',
        'reply_to_info',
        'replies',
    ];

    // Custom attributes
    protected function currentUserInteract(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getCurrentUserInteract(),
        );
    }

    protected function upvoteCount(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->calculateUpvote(),
        );
    }

    protected function downvoteCount(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->calculateDownvote(),
        );
    }

    protected function commentor(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->user,
        );
    }

    protected function replies(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->noteCommentReplies,
        );
    }

    protected function replyToInfo(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->getReplyToInfo(),
        );
    }

    // Relations
    // Commentor - nguoi binh luan, khi dat ten phai dung convention k thi no k nhan
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function replyToComment(): BelongsTo
    {
        return $this->belongsTo(NoteComment::class, 'note_comment_id');
    }

    public function noteCommentReplies(): HasMany
    {
        return $this->hasMany(NoteComment::class, 'note_comment_id')->orderBy('created_at', 'desc');
    }

    public function note(): BelongsTo
    {
        return $this->belongsTo(Note::class);
    }

    // Lay ra cac up vote va down vote
    public function userInteractions(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->using(NoteCommentUser::class)->withTimestamps();
    }

    // Helpers - use to define custom attributes
    public function calculateUpvote()
    {
        return $this->userInteractions()->withPivot('upvote', 'downvote')->where('upvote', true)->count();
    }

    public function calculateDownvote()
    {
        return $this->userInteractions()->withPivot('upvote', 'downvote')->where('downvote', true)->count();
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
            if (!$this->userInteractions()->where('user_id', $user->id)->exists()) {
                $this->userInteractions()->attach($user->id);
            }
            return $this->userInteractions()
                ->withPivot('upvote', 'downvote')
                ->where('user_id', $user->id)
                ->first()->pivot;
        }
    }
}
