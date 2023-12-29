<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class NoteCommentUser extends Pivot
{
    use HasFactory;

    public $incrementing = true;

    protected $table = 'note_comment_user';

    protected $cast = [
        'upvote' => 'boolean',
        'downvote' => 'boolean',
    ];

    protected $fillable = [
        'user_id',
        'note_comment_id',
        'upvote',
        'downvote',
    ];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->attributes['upvote'] = false;
        $this->attributes['downvote'] = false;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comment(): BelongsTo
    {
        return $this->belongsTo(NoteComment::class);
    }
}
