<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NoteHistory extends Model
{
    use HasFactory;

    protected $table = 'note_histories';

    protected $fillable = [
        'note_id',
        'user_id',
        'change_fields',
        'change_from',
        'change_to',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function note()
    {
        return $this->belongsTo(Note::class, 'id', 'note_id');
    }
}
