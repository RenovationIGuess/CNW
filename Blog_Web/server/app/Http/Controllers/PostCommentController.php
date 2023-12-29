<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostCommentRequest;
use App\Models\Post;
use App\Models\PostComment;
use Exception;
use Illuminate\Http\Request;

class PostCommentController extends Controller
{
    public function index($postId)
    {
        try {
            $post = Post::findOrFail($postId);
            // Only get the top level comment, not the replies too
            $comments = $post->comments()->where('post_comment_id', null)->get();

            return response()->json([
                'data' => $comments,
                'success' => true,
                'message' => 'Get comments successfully!',
            ], 200);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    public function store(StorePostCommentRequest $request)
    {
        try {
            $comment = PostComment::create($request->validated());

            $message = 'Commented';
            // If the post_comment_id is set, its a reply
            if (isset($comment->post_comment_id)) {
                $message = 'Replied';
            }

            if ($comment) {
                return response()->json([
                    'data' => $comment,
                    'success' => true,
                    'message' => $message,
                ], 201);
            }

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

    public function likeComment(Request $request, $postId, $commentId)
    {
        try {
            $request->validate([
                'like' => 'boolean|required',
            ]);

            $user = auth()->user();
            $post = Post::findOrFail($postId);
            $comment = $post->comments()->findOrFail($commentId);

            $comment->userInteractions()->updateExistingPivot(
                $user->id,
                [
                    'like' => $request['like'],
                ]
            );

            return response()->json([
                'data' => $comment,
                'success' => true,
                'message' => 'Liked',
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

    public function destroy($postId, $commentId)
    {
        try {
            $user = auth()->user();
            $post = Post::findOrFail($postId);
            $comment = $post->comments()->findOrFail($commentId);

            if ($comment) {
                if ($comment->user_id === $user->id) {
                    $comment->delete();

                    return response()->json([
                        'success' => true,
                        'message' => 'Deleted',
                    ], 200);
                }

                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to delete this comment!',
                ], 403);
            }

            return response()->json([
                'success' => false,
                'message' => 'The comment to delete is not in this post!',
            ], 404);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }
}
