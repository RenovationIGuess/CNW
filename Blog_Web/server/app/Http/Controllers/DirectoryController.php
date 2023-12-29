<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDirectoryRequest;
use App\Http\Requests\UpdateDirectoryRequest;
use App\Models\Directory as ModelsDirectory;
use Exception;
use Illuminate\Http\Request;

class DirectoryController extends Controller
{
    /**
     * Display a listing of the folders / resources
     */
    public function index()
    {
        try {
            $user = auth()->user();

            $directories = ModelsDirectory::where([
                'user_id', $user->id,
                'archived', false,
            ])
                ->orderBy('updated_at', 'desc')
                ->get();

            if ($directories) {
                return response()->json([
                    'data' => $directories,
                    'success' => true,
                    'message' => 'Get directories successfully!',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'No directories found!',
            ], 404);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    /**
     * Display a specified item / resource
     */
    public function show($directoryId)
    {
        try {
            $directory = ModelsDirectory::find($directoryId);

            if ($directory) {
                return response()->json([
                    'data' => $directory,
                    'success' => true,
                    'message' => 'Get data successfully!',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'Directory not found!',
            ], 404);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 400);
        }
    }

    /**
     * Get all directory's children
     */
    public function getChildren($directoryId)
    {
        try {
            $directory = ModelsDirectory::find($directoryId);

            if ($directory) {
                $directory->append('child_items');

                return response()->json([
                    'data' => $directory,
                    'success' => true,
                    'message' => 'Get data successfully!',
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Directory not found!',
            ], 404);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 400);
        }
    }

    /**
     * Store a newly created item / resource to the database
     */
    public function store(StoreDirectoryRequest $request)
    {
        try {
            $data = $request->validated();
            $directory = ModelsDirectory::create($data);
            // $directory = $directory->refresh();

            if ($directory) {
                return response()->json([
                    'data' => $directory,
                    'success' => true,
                    'message' => 'Create directory successfully!',
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
    public function update(UpdateDirectoryRequest $request, $directoryId)
    {
        try {
            $data = $request->validated();
            $directory = ModelsDirectory::find($directoryId);
            $user = auth()->user();

            // If not the creator of the user
            if ($user->id != $directory->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unathorized!',
                ], 403);
            }

            $directory->update($data);

            return response()->json([
                'data' => $directory,
                'success' => true,
                'message' => 'Update directory successfully!',
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
            ], 400);
        }
    }

    /**
     * Delete an instance from the db
     */
    public function destroy($directoryId)
    {
        $user = auth()->user();
        $directory = ModelsDirectory::find($directoryId);

        if ($user->id != $directory->user_id) {
            return response()->json([
                'success' => false,
                'message' => "Unauthorized Action!",
            ], 403);
        }

        $directory->delete();

        return response()->json([
            'success' => true,
            'message' => 'Delete success!',
        ], 200);
    }
}
