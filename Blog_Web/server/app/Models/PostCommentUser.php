<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class PostCommentUser extends Pivot
{
    use HasFactory;

    /**
     * Indicates if the IDs are auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = true;

    protected $table = 'post_comment_user';

    // protected $attribute = [
    //     'like' => false,
    // ];

    protected $cast = [
        'like' => 'boolean',
    ];

    protected $fillable = [
        'user_id',
        'post_comment_id',
        'like',
    ];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->attributes['like'] = false;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function postComment(): BelongsTo
    {
        return $this->belongsTo(PostComment::class);
    }
}
