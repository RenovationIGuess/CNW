<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostCommentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\SocialiteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// OAuth
Route::controller(SocialiteController::class)->group(function () {
    Route::prefix('auth')->group(function () {
        Route::get('/google/redirect', 'googleRedirect');
        Route::get('/google/callback', 'googleCallback');
        Route::get('/facebook/redirect', 'facebookRedirect');
        Route::get('/facebook/callback', 'facebookCallback');
        Route::get('/github/redirect', 'githubRedirect');
        Route::get('/github/callback', 'githubCallback');
    });
});

// Normal auth
Route::controller(AuthController::class)->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('signin', 'signin');
        Route::post('signout', 'signout');
        Route::post('signup', 'signup');
        Route::post('refresh', 'refresh');
        Route::get('me', 'me');
    });
});

// Handle post
Route::controller(PostController::class)->group(function () {
    Route::prefix('posts')->group(function () {
        Route::get('/', 'index');
        Route::get('/{postId}', 'show');
        Route::post('/', 'store');
        Route::patch('/{postId}', 'update');
        Route::patch('/{postId}/star', 'starPost');
        Route::patch('/{postId}/like', 'likePost');
        Route::delete('/{postId}', 'destroy');
    });
});

// Handle post comment
Route::controller(PostCommentController::class)->group(function () {
    Route::prefix('posts/{postId}/comments')->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::patch('/{commentId}', 'update');
        Route::patch('/{commentId}/like', 'likeComment');
        Route::delete('/{commentId}', 'destroy');
    });
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
