<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        // Debug Auth
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Unauthorized: No authenticated user found.',
            ], 401);
        }

        $user = Auth::user(); // Get the authenticated user

        return response()->json([
            'username' => $user->username, // Fetch the correct field name
            'role' => $user->role ?? 'User', // Ensure the role exists
            'content_watched' => 2, // Replace with actual logic
            'member_since' => $user->created_at->diffForHumans(),
            'content_liked' => 2, // Replace with actual logic
        ]);
    }
}