<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNoteCommentRequest;
use App\Models\Note;
use App\Models\NoteComment;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NoteCommentController extends Controller
{
    /**
     * Display a listing of a note's comments
     */
    public function index($noteId)
    {
        try {
            $note = Note::findOrFail($noteId);
            $comments = $note->comments()->where('note_comment_id', null)->get();

            if ($comments) {
                return response()->json([
                    'data' => $comments,
                    'success' => true,
                    'message' => 'Get comments successfully!',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'No comments were found!',
            ], 404);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created item / resource to the database
     */
    public function store(StoreNoteCommentRequest $request)
    {
        try {
            $data = $request->validated();
            $comment = NoteComment::create($data);

            $message = 'Commented';
            // If the relation is set
            if (isset($comment->note_comment_id)) {
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

    /**
     * Update the specified item / resource in database
     */
    public function update()
    {
    }

    /**
     * Vote the comment - either comment / reply
     */
    public function voteComment(Request $request, $noteId, $commentId)
    {
        try {
            $request->validate([
                'upvote' => 'required|boolean',
                'downvote' => 'required|boolean',
            ]);

            $user = auth()->user();
            $comment = null;

            DB::transaction(function () use (
                &$comment,
                $noteId,
                $commentId,
                $user,
                $request
            ) {
                // Though it just need 1 query from NoteComment model but
                $note = Note::findOrFail($noteId);
                $comment = $note->comments()->findOrFail($commentId);

                if ($comment) {
                    $comment->userInteractions()->updateExistingPivot(
                        $user->id,
                        [
                            'upvote' => $request['upvote'],
                            'downvote' => $request['downvote'],
                        ]
                    );
                }
            });

            return response()->json([
                'data' => $comment,
                'success' => true,
                'message' => 'Voted',
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

    /**
     * Delete an instance from the db
     */
    public function destroy($noteId, $commentId)
    {
        try {
            $user = auth()->user();
            $note = Note::findOrFail($noteId);
            $comment = $note->comments()->findOrFail($commentId);

            if ($comment) {
                if ($comment->user_id == $user->id) {
                    $comment->delete();

                    return response()->json([
                        'success' => true,
                        'message' => 'Deleted',
                    ], 200);
                }

                return response()->json([
                    'success' => false,
                    'message' => "You are not authorized to delete this comment!",
                ], 403);
            }

            return response()->json([
                'success' => false,
                'message' => "The comment to delete is not in this note!",
            ], 404);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }
}
