<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'userProfile',
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $appends = [
        'profile',
        'private_dir',
        'public_dir',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    // Get called when we boot up the model?
    protected static function boot()
    {
        parent::boot();

        // Fires an event everytime a new user is created
        // Eloquent model event
        static::created(function ($user) {
            // Create the default profile for the user
            $user->userProfile()->create([
                'avatar' => \config('env.default_user_ava'),
                'background_image' => \config('env.default_user_bg'),
                'sign' => '',
            ]);

            // Create an instance of the user setting
            $user->userSetting()->create();

            // Create 2 default directory for the user, public and private
            // Create the private directory
            $user->directories()->create([
                'title' => 'Private',
                'icon' => \config('env.default_dir_icon'),
                'user_id' => $user->id,
                'directory_id' => null,
            ]);

            // Create the public directory
            $user->directories()->create([
                'title' => 'Public',
                'icon' => \config('env.default_dir_icon'),
                'user_id' => $user->id,
                'directory_id' => null,
            ]);
        });
    }

    // Profile related relations
    // A user can have many linked social accounts
    public function socialAccounts(): HasMany
    {
        return $this->hasMany(SocialAccount::class);
    }

    // Each user has 1 profile
    public function userProfile()
    {
        return $this->hasOne(UserProfile::class);
    }

    // Each account has 1 setting
    public function userSetting()
    {
        return $this->hasOne(UserSetting::class);
    }

    protected function profile(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->userProfile,
        );
    }

    // Directories related relations
    // One user can have many directories
    public function directories()
    {
        return $this->hasMany(Directory::class);
    }

    protected function privateDir(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->directories()
                ->where('title', 'Private')
                ->where('directory_id', null)
                ->first()->append('child_items'),
        );
    }

    protected function publicDir(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->directories()
                ->where('title', 'Public')
                ->where('directory_id', null)
                ->first()->append('child_items'),
        );
    }

    // Notes related relations
    // One user can have many notes
    public function notes(): HasMany
    {
        return $this->hasMany(Note::class)->orderBy('created_at', 'DESC');
    }

    // One user can have many note comments
    public function noteComments(): HasMany
    {
        return $this->hasMany(NoteComment::class)->orderBy('created_at', 'DESC');
    }

    // One user can be the creator of many note's histories
    public function noteHistories(): HasMany
    {
        return $this->hasMany(NoteHistory::class)->orderBy('created_at', 'DESC');
    }

    // Lay ra trang thai upvote, downvote doi voi 1 note?
    public function noteCommentInteractions(): BelongsToMany
    {
        return $this->belongsToMany(NoteComment::class)->using(NoteCommentUser::class)->withTimestamps();
    }

    // Calendars related relations
    // A user can have many calendars
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class);
    }

    // Post related relations
    // A user can up many posts
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    // A user can up many comments to a post
    public function postComments(): HasMany
    {
        return $this->hasMany(PostComment::class);
    }

    // A user can have interact (like | star) with each post
    public function postInteractions(): BelongsToMany
    {
        return $this->belongsToMany(Post::class)
            ->using(PostUser::class);
    }

    // A user can have interact (like) with each post's comments
    public function postCommentInteractions(): BelongsToMany
    {
        return $this->belongsToMany(PostComment::class)
            ->using(PostCommentUser::class);
    }

    // A user can create many tags for their notes, etc
    public function tags(): HasMany
    {
        return $this->hasMany(Tag::class);
    }

    // A user can receive many notifications
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    // A user can have many flashcard decks
    public function flashcardDecks(): HasMany
    {
        return $this->hasMany(FlashcardDeck::class);
    }

    public function scopeWithUserProfile($query)
    {
        return $query->select('id')
            ->with(['userProfile' => function ($query) {
                $query->select('user_id', 'name', 'avatar');
            }]);
    }
}
