<?php

namespace App\Http\Controllers;

use App\Models\Flashcard;
use Exception;
use Illuminate\Http\Request;

class FlashcardController extends Controller
{
    public function star($cardId)
    {
        try {
            $flashcard = Flashcard::findOrFail($cardId);
            $flashcard->starred = !$flashcard->starred;
            $flashcard->save();
            return response()->json($flashcard);
        } catch (Exception $e) {
            return response()->json($e->getMessage(), 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'deck_id' => 'exists:flashcard_decks,id|required',
                'front_title' => 'required|string',
                'front_content' => 'nullable|string',
                'back_title' => 'required|string',
                'back_content' => 'nullable|string',
            ]);

            $flashcard = Flashcard::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Created',
                'data' => $flashcard,
            ], 201);
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

    public function update(Request $request, $cardId)
    {
        try {
            $flashcard = Flashcard::findOrFail($cardId);

            $data = $request->validate([
                'front_title' => 'required|string',
                'front_content' => 'nullable|string',
                'back_title' => 'required|string',
                'back_content' => 'nullable|string',
            ]);

            $flashcard->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Updated',
                'data' => $flashcard,
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

    public function destroy($cardId)
    {
        try {
            $flashcard = Flashcard::findOrFail($cardId);
            $flashcard->delete();
            return response()->json([
                'success' => true,
                'message' => 'Deleted',
            ], 200);
        } catch (Exception $e) {
            return response()->json($e->getMessage(), 500);
        }
    }
}
