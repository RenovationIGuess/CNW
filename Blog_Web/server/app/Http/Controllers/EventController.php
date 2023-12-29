<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EventController extends Controller
{
    public function index()
    {
        try {
            $events = Event::all();

            return response()->json([
                'success' => true,
                'data' => [
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

    public function show($eventId)
    {
        try {
            $event = Event::findOrFail($eventId);

            return response()->json([
                'success' => true,
                'data' => $event,
            ], 200);
        } catch (Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
            ], 404);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'title' => 'required|string',
                'priority' => 'nullable|string',
                'background_color' => 'required|string',
                'description' => 'nullable|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date',
                'pinned' => 'required|boolean',
                'user_id' => 'exists:users,id|required',
                'schedule_ids' => 'exists:schedules,id|array|required',
            ]);

            $event = null;

            DB::transaction(function () use (&$event, $data) {
                $data['start_date'] = Carbon::parse($data['start_date']);
                $data['end_date'] = Carbon::parse($data['end_date']);

                if ($data['description'] == "") {
                    $data['description'] = 'None';
                }

                $event = Event::create($data);

                // Create the many to many relation
                $event->eventSchedules()->sync($data['schedule_ids']);
            });

            return response()->json([
                'success' => true,
                'message' => 'Created',
                'data' => $event,
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

    public function update(Request $request, $eventId)
    {
        try {
            // $user = auth()->user();

            $data = $request->validate([
                'title' => 'string|required',
                'priority' => 'string|nullable',
                'background_color' => 'string|required',
                'description' => 'string|nullable',
                'start_date' => 'date|required',
                'end_date' => 'date|required',
                'pinned' => 'boolean',
                'schedule_ids' => 'exists:schedules,id|array|required',
            ]);

            $event = null;

            DB::transaction(function () use (&$event, $data, $eventId) {
                $data['start_date'] = Carbon::parse($data['start_date']);
                $data['end_date'] = Carbon::parse($data['end_date']);

                if ($data['description'] == "") {
                    $data['description'] = 'None';
                }

                // $event = $user->events()->findOrFail($eventId);
                $event = Event::findOrFail($eventId);
                $event->update($data);
                $event->eventSchedules()->sync($data['schedule_ids']);
            });

            return response()->json([
                'success' => true,
                'message' => 'Updated',
                'data' => $event,
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

    public function destroy($eventId)
    {
        try {
            $user = auth()->user();
            $event = Event::find($eventId);

            if ($user->id != $event->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to delete this event.',
                ], 403);
            }

            $event->delete();

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
