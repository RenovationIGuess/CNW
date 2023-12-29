<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\NoteHistory;
use Exception;
use Illuminate\Http\Request;

class NoteHistoryController extends Controller
{
    /**
     * Display a listing of a note's histories
     */
    public function index($noteId)
    {
        try {
            // $user = auth()->user();
            $note = Note::find($noteId);

            $histories = NoteHistory::with('user')
                ->where('note_id', $note->id)
                ->orderBy('created_at', 'desc')
                ->get();

            if ($histories) {
                return response()->json([
                    'data' => $histories,
                    'success' => true,
                    'message' => 'Get notes successfully!',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'No histories were found!',
            ], 404);
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
    public function destroy($noteId, $historyId)
    {
        try {
            $user = auth()->user();
            $note = Note::findOrFail($noteId);
            $history = $note->histories()->findOrFail($historyId);

            if ($history) {
                if ($history->user_id === $user->id) {
                    // Xoa cai history la xong
                    $history->delete();

                    return response()->json([
                        'success' => true,
                        'message' => 'Delete success!',
                    ], 200);
                }

                return response()->json([
                    'success' => false,
                    'message' => "Unauthorized Action!",
                ], 403);
            }

            return response()->json([
                'success' => false,
                'message' => "History not found!",
            ], 404);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }
}
