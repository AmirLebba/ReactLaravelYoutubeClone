<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!auth()->attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = auth()->user();

        // Generate a token for the authenticated user
        $token = $user->createToken('API Token')->accessToken;

        return response()->json(['token' => $token]);
    }

    public function register(Request $request)
    {
        // Validate the input data
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // Create a new user
        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'avatar' => 'https://reedbarger.nyc3.digitaloceanspaces.com/default-avatar.png',  // Default avatar
            'cover' => 'https://reedbarger.nyc3.digitaloceanspaces.com/default-cover-banner.png',  // Default cover image
            'about' => '',  // Default about text
            'social_links' => json_encode([]),  // Empty social links
        ]);

        // Return the created user
        return response()->json([
            'message' => 'User successfully registered!',
            'user' => $user
        ], 201);
    }
}