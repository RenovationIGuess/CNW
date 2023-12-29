<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostCommentRequest extends FormRequest
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
            'post_id' => 'exists:posts,id|required',
            'user_id' => 'exists:users,id|required',
            'post_comment_id' => 'exists:post_comments,id|nullable',
            'reply_to' => 'exists:users,id|nullable',
            'content_json' => 'string|required',
            'content_html'=> 'string|required',
            'pinned' => 'boolean',
        ];
    }
}
