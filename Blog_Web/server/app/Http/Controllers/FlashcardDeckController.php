<?php

namespace App\Http\Controllers;

use App\Models\FlashcardDeck;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FlashcardDeckController extends Controller
{
    public function index()
    {
        try {
            $user = auth()->user();

            $flashcardDecks = $user->flashcardDecks()
                ->with(['flashcards', 'user' => function ($query) {
                    $query->withUserProfile();
                }])
                ->get();

            // Hide 'private_dir' and 'public_dir' attributes
            $flashcardDecks->each(function ($flashcardDeck) {
                if ($flashcardDeck->user) {
                    $flashcardDeck->user->makeHidden(['private_dir', 'public_dir']);
                }
            });

            return response()->json([
                'success' => true,
                'data' => $flashcardDecks,
            ], 200);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    public function show($deckId)
    {
        try {
            $user = auth()->user();

            $flashcardDeck = $user->flashcardDecks()
                ->with(['flashcards', 'user' => function ($query) {
                    $query->withUserProfile();
                }])
                ->findOrFail($deckId);

            $flashcardDeck->user->makeHidden(['private_dir', 'public_dir']);

            return response()->json([
                'success' => true,
                'data' => $flashcardDeck,
            ], 200);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $user = auth()->user();

            $data = $request->validate([
                'icon' => 'string|required',
                'title' => 'required|string',
                'description' => 'nullable|string',
                // 'user_id' => 'exists:users,id|required',
                'directory_id' => 'exists:directories,id|required',
                'flashcards' => 'array|nullable',
                'tag_ids' => 'array|exists:tags,id|nullable',
            ]);

            $flashcardDeck = null;

            DB::transaction(function () use (&$flashcardDeck, $user, $data) {
                if ($data['description'] == "") {
                    $data['description'] = 'None';
                }

                // $user->flashcardDecks()->create($data);
                $flashcardDeck = $user->flashcardDecks()->create($data);
                $flashcardDeck->flashcardDeckTags()->sync($data['tag_ids']);

                if (!empty($data['flashcards'])) {
                    foreach ($data['flashcards'] as $flashcardData) {
                        $flashcardDeck->flashcards()->create($flashcardData);
                    }
                }

                $flashcardDeck->load(['flashcards', 'user' => function ($query) {
                    $query->withUserProfile();
                }]);
                $flashcardDeck->user->makeHidden(['private_dir', 'public_dir']);
            });

            return response()->json([
                'success' => true,
                'data' => $flashcardDeck,
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

    public function update(Request $request, $deckId)
    {
        try {
            $user = auth()->user();

            $flashcardDeck = FlashcardDeck::findOrFail($deckId);

            if ($flashcardDeck->user_id != $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 401);
            }

            $data = $request->validate([
                'icon' => 'string|required',
                'title' => 'string|required',
                'starred' => 'boolean',
                'description' => 'string',
                'directory_id' => 'exists:directories,id',
                'tag_ids' => 'array|exists:tags,id|nullable',
            ]);

            DB::transaction(function () use (&$flashcardDeck, $data) {
                if ($data['description'] == "") {
                    $data['description'] = 'None';
                }

                $flashcardDeck->update($data);
                $flashcardDeck->flashcardDeckTags()->sync($data['tag_ids']);
                $flashcardDeck->load(['flashcards', 'user' => function ($query) {
                    $query->withUserProfile();
                }]);
                $flashcardDeck->user->makeHidden(['private_dir', 'public_dir']);
            });

            return response()->json([
                'success' => true,
                'data' => $flashcardDeck,
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

    public function addFlashcards(Request $request, $deckId)
    {
        try {
            $user = auth()->user();

            $flashcardDeck = FlashcardDeck::findOrFail($deckId);

            if ($flashcardDeck->user_id != $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 401);
            }

            $data = $request->validate([
                'flashcards' => 'array|required',
            ]);

            $newFlashcards = [];
            DB::transaction(function () use (&$flashcardDeck, &$newFlashcards, $data) {
                foreach ($data['flashcards'] as $flashcardData) {
                    $newFlashcard = $flashcardDeck->flashcards()->create($flashcardData);
                    $newFlashcards[] = $newFlashcard;
                }
            });

            return response()->json([
                'success' => true,
                'data' => $newFlashcards,
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

    public function updateLocation($deckId)
    {
        try {
            $user = auth()->user();

            $flashcardDeck = FlashcardDeck::findOrFail($deckId);

            if ($flashcardDeck->user_id != $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 401);
            }

            $data = request()->validate([
                'directory_id' => 'exists:directories,id|required',
            ]);

            $flashcardDeck->update($data);
            $flashcardDeck->load(['flashcards', 'user' => function ($query) {
                $query->withUserProfile();
            }]);
            $flashcardDeck->user->makeHidden(['private_dir', 'public_dir']);

            return response()->json([
                'success' => true,
                'data' => $flashcardDeck,
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

    public function updateIcon(Request $request, $deckId)
    {
        try {
            $user = auth()->user();

            $flashcardDeck = FlashcardDeck::findOrFail($deckId);

            if ($flashcardDeck->user_id != $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 401);
            }

            $data = $request->validate([
                'icon' => 'string|required',
            ]);

            $flashcardDeck->update($data);
            $flashcardDeck->load(['flashcards', 'user' => function ($query) {
                $query->withUserProfile();
            }]);
            $flashcardDeck->user->makeHidden(['private_dir', 'public_dir']);

            return response()->json([
                'success' => true,
                'data' => $flashcardDeck,
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

    public function star($deckId)
    {
        try {
            $user = auth()->user();

            $flashcardDeck = FlashcardDeck::findOrFail($deckId);

            if ($flashcardDeck->user_id != $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 401);
            }

            $flashcardDeck->update([
                'starred' => !$flashcardDeck->starred,
            ]);
            $flashcardDeck->load(['flashcards', 'user' => function ($query) {
                $query->withUserProfile();
            }]);
            $flashcardDeck->user->makeHidden(['private_dir', 'public_dir']);

            return response()->json([
                'success' => true,
                'data' => $flashcardDeck,
            ], 200);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    } // End of public function star($deckId)

    public function destroy($deckId)
    {
        try {
            $user = auth()->user();

            $flashcardDeck = FlashcardDeck::findOrFail($deckId);

            if ($flashcardDeck->user_id != $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 401);
            }

            $flashcardDeck->delete();

            return response()->json([
                'success' => true,
                'message' => 'Deleted',
            ], 200);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }
}
