<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Exception;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function index()
    {
        try {
            $user = auth()->user();
            $tags = $user->tags;

            return response()->json([
                'data' => $tags,
                'message' => 'Tags retrieved successfully',
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
     * Add a new tag to the collection
     */
    public function store(Request $request)
    {
        try {
            $user = auth()->user();
            $data = $request->validate([
                'title' => 'required|string|unique:tags',
                'description' => 'nullable|string',
                'text_color' => 'string|required',
                'background_color' => 'string|required',
            ]);

            $tag = $user->tags()->create($data);

            return response()->json([
                'data' => $tag,
                'message' => 'Created',
                'success' => true,
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

    public function update(Request $request, $tagId)
    {
        try {
            $user = auth()->user();
            $data = $request->validate([
                'title' => 'required|string|unique:tags',
                'description' => 'nullable|string',
                'text_color' => 'string|required',
                'background_color' => 'string|required',
            ]);

            $tag = $user->tags()->findOrFail($tagId);
            $tag->update($data);

            return response()->json([
                'data' => $tag,
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

    public function updateColors(Request $request, $tagId)
    {
        try {
            $user = auth()->user();
            $data = $request->validate([
                'text_color' => 'string|required',
                'background_color' => 'string|required',
            ]);

            $tag = $user->tags()->findOrFail($tagId);
            $tag->update($data);

            return response()->json([
                'data' => $tag,
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

    /**
     * Delete one tag from the database
     */
    public function destroy($tagId)
    {
        try {
            $user = auth()->user();
            $tag = $user->tags()->findOrFail($tagId);

            $tag->delete();

            return response()->json([
                'message' => 'Deleted',
                'success' => true,
            ], 200);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }
}
