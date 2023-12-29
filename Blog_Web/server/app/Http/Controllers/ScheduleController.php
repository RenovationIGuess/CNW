<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Schedule;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ScheduleController extends Controller
{
    //
    public function index()
    {
        try {
            $schedules = Schedule::all();
            $events = Event::all();

            return response()->json([
                'success' => true,
                'data' => [
                    'schedules' => $schedules,
                    'events' => $events,
                ],
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
            $data = $request->validate([
                'title' => 'string|required',
                'icon' => 'string|nullable',
                'background_image' => 'nullable|string',
                'description' => 'nullable|string',
                'directory_id' => 'exists:directories,id|required',
                'user_id' => 'exists:users,id|required',
                'tag_ids' => 'array|exists:tags,id|nullable',
            ]);

            if ($data['description'] == "") {
                $data['description'] = 'None';
            }

            $schedule = null;

            DB::transaction(function () use (&$schedule, $data) {
                $schedule = Schedule::create($data);
                $schedule->scheduleTags()->sync($data['tag_ids']);
            });

            return response()->json([
                'success' => true,
                'data' => $schedule,
                'message' => 'Created',
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

    public function update(Request $request, $scheduleId)
    {
        try {
            $user = auth()->user();

            $data = $request->validate([
                'title' => 'string|required',
                'icon' => 'string|nullable',
                'background_image' => 'nullable|string',
                'description' => 'string|nullable',
                'directory_id' => 'exists:directories,id|required',
                'starred' => 'boolean|required',
                // 'user_id' => 'exists:users,id',
                // 'tag_ids' => 'array|exists:tags,id|nullable',
            ]);

            if ($data['description'] == "") {
                $data['description'] = 'None';
            }

            $schedule = Schedule::find($scheduleId);

            if ($schedule->user_id != $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to update this schedule.',
                ], 403);
            }

            $schedule->update($data);

            return response()->json([
                'success' => true,
                'data' => $schedule,
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
            ], 500);
        }
    }

    public function attachTags(Request $request, $scheduleId)
    {
        try {
            $data = $request->validate([
                'tag_ids' => 'array|exists:tags,id|nullable',
            ]);

            $schedule = Schedule::find($scheduleId);
            $schedule->scheduleTags()->sync($data['tag_ids']);

            return response()->json([
                'success' => true,
                'data' => $schedule,
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
            ], 500);
        }
    }

    public function starAction(Request $request, $scheduleId)
    {
        try {
            $data = $request->validate([
                'starred' => 'boolean|required',
            ]);
            $schedule = Schedule::find($scheduleId);
            $schedule->update($data);

            return response()->json([
                'success' => true,
                'data' => $schedule,
                'message' => 'Starred',
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

    public function show($scheduleId)
    {
        try {
            $schedule = Schedule::find($scheduleId);

            return response()->json([
                'success' => true,
                'data' => [
                    'schedule' => $schedule,
                    'events' => $schedule->scheduleEvents,
                ],
            ], 200);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    public function destroy($scheduleId)
    {
        try {
            $user = auth()->user();
            $schedule = Schedule::find($scheduleId);

            if ($user->id != $schedule->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to delete this schedule.',
                ], 403);
            }

            $schedule->delete();

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
