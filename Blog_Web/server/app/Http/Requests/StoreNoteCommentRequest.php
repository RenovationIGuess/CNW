<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNoteCommentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'note_id' => 'required|exists:notes,id',
            'user_id' => 'required|exists:users,id',
            'note_comment_id' => 'nullable|exists:note_comments,id',
            'reply_to' => 'nullable|exists:users,id',
            'content_html' => 'string|required',
            'content_json' => 'string|required',
            'selected_text' => 'string|nullable',
            'pinned' => 'boolean',
        ];
    }
}
