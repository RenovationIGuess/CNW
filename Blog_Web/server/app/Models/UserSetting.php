<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSetting extends Model
{
    use HasFactory;

    protected $table = 'user_settings';

    protected $fillable = [
        'language',
        'timezone',
        
        'show_conf_cancel_edit_note',
        'show_conf_delete_note',

        'show_conf_delete_event',
        'show_conf_cancel_create_event',
        'show_conf_cancel_edit_event',

        'show_conf_delete_schedule',
        'show_conf_cancel_create_schedule',
        'show_conf_cancel_edit_schedule',

        'show_conf_delete_deck',
        'show_conf_cancel_create_deck',
        'show_conf_cancel_edit_deck',

        'show_conf_delete_card',
        'show_conf_cancel_create_card',
        'show_conf_cancel_edit_card',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
