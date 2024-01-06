<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Models\Post;
use Exception;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        try {
            $posts = Post::all();

            return response()->json([
                'data' => $posts,
                'message' => 'Posts retrieved successfully',
                'success' => true,
            ], 200);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    /**
     * 
     */
    public function show($id)
    {
        try {
            $post = Post::find($id);

            return response()->json([
                'data' => $post,
                'message' => 'Post retrieved successfully',
                'success' => true,
            ], 200);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    public function likePost(Request $request, $postId)
    {
        try {
            $user = auth()->user();
            $request->validate([
                'like' => 'required|boolean',
            ]);

            $post = Post::findOrFail($postId);

            $post->userInteractions()->updateExistingPivot($user->id, [
                'like' => $request['like'],
            ]);

            return response()->json([
                'data' => $post,
                'message' => 'Post liked successfully',
                'success' => true,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->errors(),
            ], 422);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    public function starPost(Request $request, $postId)
    {
        try {
            $user = auth()->user();
            $request->validate([
                'star' => 'required|boolean',
            ]);

            $post = Post::findOrFail($postId);

            $post->userInteractions()->updateExistingPivot($user->id, [
                'star' => $request['star'],
            ]);

            return response()->json([
                'data' => $post,
                'message' => 'Post starred successfully',
                'success' => true,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->errors(),
            ], 422);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    public function store(StorePostRequest $request)
    {
        try {
            $user = auth()->user();
            $data = $request->validated();

            // Create the post
            $post = $user->posts()->create($data);

            // Return
            if ($post) {
                return response()->json([
                    'data' => $post,
                    'message' => 'Post created successfully',
                    'success' => true,
                ], 201);
            }

            // Exception
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong!',
            ], 400);
        } catch (\Illuminate\Validation\ValidationException $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->errors(),
            ], 422);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $postId)
    {
        try {
            $user = auth()->user();
            $post = Post::find($postId);

            if ($user->id != $post->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unathorized!',
                ], 403);
            }

            $data = $request->validate([
                'post_type' => 'string|nullable',
                'title' => 'string|required',
                'banner' => 'string|nullable',
                'content_json' => 'string|required',
                'content_html' => 'string|required',
            ]);

            $post->update($data);

            return response()->json([
                'data' => $post,
                'message' => 'Updated',
                'success' => true,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->errors(),
            ], 422);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    public function destroy($postId)
    {
        try {
            $user = auth()->user();
            $post = Post::find($postId);

            if ($user->id != $post->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unathorized!',
                ], 403);
            }

            // Once a post is delete, all of its comment and
            // replies will be deleted as well as all the pivot instances
            $post->delete();

            return response()->json([
                'success' => true,
                'message' => 'Post deleted successfully!',
            ], 200);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }
}
