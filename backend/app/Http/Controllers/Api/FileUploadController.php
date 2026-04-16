<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class FileUploadController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'max:5120', 'mimes:pdf,png,jpg,jpeg,webp'],
            'purpose' => ['required', Rule::in(['company_logo', 'company_pdf', 'jd_pdf', 'attachment'])],
        ]);

        $path = $validated['file']->store(
            'portal-uploads/'.$request->user()->user_id.'/'.$validated['purpose'],
            'public'
        );

        return response()->json([
            'data' => [
                'path' => $path,
                'url' => Storage::disk('public')->url($path),
                'purpose' => $validated['purpose'],
                'original_name' => $validated['file']->getClientOriginalName(),
                'mime_type' => $validated['file']->getClientMimeType(),
                'size' => $validated['file']->getSize(),
            ],
        ], 201);
    }
}
