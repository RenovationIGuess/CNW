<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class PostUser extends Pivot
{
    use HasFactory;

    public $incrementing = true;

    protected $table = 'post_user';

    protected $attribute = [
        'like' => false,
        'star' => false,
    ];

    protected $cast = [
        'like' => 'boolean',
        'star' => 'boolean',
    ];

    protected $fillable = [
        'user_id',
        'post_id',
        'like',
        'star',
    ];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        $this->attributes['like'] = false;
        $this->attributes['star'] = false;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
