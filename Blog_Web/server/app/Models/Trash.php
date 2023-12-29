<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trash extends Model
{
    use HasFactory;

    protected $table = 'trashes';

    /**
     * A trash can be a note | a calendar | a flashcard sets
     * => Polymorphic type
     * Get the parent trashable model (one of the listed above)
     */
    public function trashable()
    {
        return $this->morphTo();
    }
}
