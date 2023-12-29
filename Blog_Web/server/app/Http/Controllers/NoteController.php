<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNoteRequest;
use App\Http\Requests\UpdateNoteRequest;
use App\Models\Note;
use App\Models\NoteHistory;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NoteController extends Controller
{
    /**
     * Display a listing of the notes / resources
     */
    public function index()
    {
        try {
            $user = auth()->user();

            $notes = Note::with(['user', 'directory'])
                ->where('user_id', $user->id)
                ->orderBy('updated_at', 'desc')
                ->paginate(10);

            if ($notes) {
                return response()->json([
                    'data' => $notes,
                    'success' => true,
                    'message' => 'Get notes successfully!',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'No notes were found!',
            ], 404);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    /**
     * Display a listing of the notes / resources - no pagination
     */
    public function indexNoPaginate()
    {
        try {
            $user = auth()->user();

            $notes = Note::with(['user', 'directory'])
                ->where('user_id', $user->id)
                ->orderBy('updated_at', 'desc')
                ->get();

            if ($notes) {
                return response()->json([
                    'data' => $notes,
                    'success' => true,
                    'message' => 'Get notes successfully!',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'No notes were found!',
            ], 404);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    /**
     * Display list of starred notes
     */
    public function starred()
    {
        try {
            $user = auth()->user();

            $notes = Note::with(['user', 'directory'])
                ->where('user_id', $user->id)
                ->where('starred', true)
                ->orderBy('updated_at', 'desc')
                ->paginate(10);

            if ($notes) {
                return response()->json([
                    'data' => $notes,
                    'success' => true,
                    'message' => 'Get notes successfully!',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'No notes were found!',
            ], 404);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    /**
     * Display list of starred notes - no pagination
     */
    public function starredNoPaginate()
    {
        try {
            $user = auth()->user();

            $notes = Note::with(['user', 'directory'])
                ->where('user_id', $user->id)
                ->where('starred', true)
                ->orderBy('updated_at', 'desc')
                ->get();

            if ($notes) {
                return response()->json([
                    'data' => $notes,
                    'success' => true,
                    'message' => 'Get notes successfully!',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'No notes were found!',
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
    public function store(StoreNoteRequest $request)
    {
        try {
            $data = $request->validated();

            if (!$data['description']) {
                $data['description'] = 'Chưa có';
            }

            $note = Note::create($data);

            if ($note) {
                return response()->json([
                    'data' => $note,
                    'success' => true,
                    'message' => 'Create note successfully!',
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
     * Display a specified item / resource
     */
    public function show($noteId)
    {
        try {
            $note = Note::with(['directory'])
                ->find($noteId);

            if ($note) {
                return response()->json([
                    'data' => $note,
                    'success' => true,
                    'message' => 'Get data successfully!',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'No note were found!',
            ], 404);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 400);
        }
    }

    /**
     * Update the specified item / resource in database
     */
    public function update(UpdateNoteRequest $request, $noteId)
    {
        try {
            $data = $request->validated();

            if (!$data['description']) {
                $data['description'] = 'Chưa có';
            }

            $note = Note::with('directory')->findOrFail($noteId);
            $user = auth()->user();

            // If current user is not authorized to edit the note
            if ($user->id != $note->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to do this!',
                ], 403);
            }

            $new_history = null;

            DB::transaction(function () use (&$note, &$new_history, $data, $user) {
                // Track if there is new data
                $old_data = [
                    'directory_id' => $note->directory_id,
                    'icon' => $note->icon,
                    'background_image' => $note->background_image,
                    'title' => $note->title,
                    'description' => $note->description,
                    'starred' => $note->starred,
                    'content_json' => $note->content_json,
                    'content_html' => $note->content_html,
                ];

                $changes = array_diff($data, $old_data);


                if ($changes) {
                    // Thay doi tu
                    $change_from = '';
                    // Thay doi thanh
                    $change_to = '';
                    // Cac truong thong tin thay doi
                    $change_fields = '';

                    foreach ($changes as $key => $value) {
                        if ($key != 'starred' && $key != 'content_html' && $key != 'content_json') {
                            $change_fields = $change_fields . $key . ';';
                            $change_from = $change_from . $old_data[$key] . ';';
                            $change_to = $change_to . $value . ';';
                        }
                    }

                    if ($change_fields != "") {
                        // The user who made the change will be the one who create history
                        $new_history = NoteHistory::create([
                            'note_id' => $note->id,
                            'user_id' => $user->id,
                            'change_fields' => substr_replace($change_fields, "", -1),
                            'change_from' => substr_replace($change_from, "", -1),
                            'change_to' => substr_replace($change_to, "", -1),
                        ]);
                    }
                }

                // Update the new data
                $note->update($data);
            });

            if ($new_history) {
                $new_history->load(['user']);
            }

            return response()->json([
                'data' => $note,
                'history' => $new_history,
                'success' => true,
                'message' => 'Update note successfully!',
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
     * Attach / detach tags
     */
    public function updateTags(Request $request, $noteId)
    {
        try {
            $data = $request->validate([
                'tag_ids' => 'array|exists:tags,id'
            ]);
            $note = Note::find($noteId);

            if ($note) {
                $note->noteTags()->sync($data['tag_ids']);

                return response()->json([
                    'data' => $note,
                    'success' => true,
                    'message' => 'Add tags successfully!',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'No note were found!',
            ], 404);
        } catch (\Illuminate\Validation\ValidationException $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->errors(),
            ], 422);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage()
            ], 400);
        }
    }

    /**
     * Delete an instance from the db
     */
    public function destroy($noteId)
    {
        $user = auth()->user();
        $note = Note::find($noteId);

        if ($user->id != $note->user_id) {
            return response()->json([
                'success' => false,
                'message' => "Unauthorized Action!",
            ], 403);
        }

        $note->delete();

        return response()->json([
            'success' => true,
            'message' => 'Delete success!',
        ], 200);
    }

    public function saveNoteContent($noteId, Request $request)
    {
        try {
            $data = $request->validate([
                'content_html' => 'string|nullable',
                'content_json' => 'string|nullable',
            ]);

            $user = auth()->user();
            $note = Note::find($noteId);

            if ($user->id != $note->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => "Unauthorized Action!",
                ], 403);
            }

            $note->update([
                'content_html' => $data['content_html'],
                'content_json' => $data['content_json']
            ]);

            return response()->json([
                'data' => $note,
                'success' => true,
                'message' => 'Updated',
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
}
