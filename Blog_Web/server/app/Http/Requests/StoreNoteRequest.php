<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNoteRequest extends FormRequest
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
            'user_id' => 'exists:users,id|required',
            'directory_id' => 'exists:directories,id|required',
            'title' => 'string|required',
            'background_image' => 'string|nullable',
            'icon' => 'string|nullable',
            'description' => 'string|nullable',
            'content_html' => 'string|nullable',
            'content_json' => 'string|nullable',
            'starred' => 'boolean',
        ];
    }
}
