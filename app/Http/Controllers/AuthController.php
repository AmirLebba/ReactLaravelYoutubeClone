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

        // Validate request inputs
        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Attempt authentication
        if (!auth()->attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = auth()->user();

        try {
            // Generate token
            $token = $user->createToken('API Token')->accessToken;


            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'user' => $user
            ]);
        } catch (\Exception $e) {
            // Log error and return response
            // Log::error('Token generation failed: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred. Please try again.'], 500);
        }
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
            'avatar' => 'https://reedbarger.nyc3.digitaloceanspaces.com/default-avatar.png',
            'cover' => 'https://reedbarger.nyc3.digitaloceanspaces.com/default-cover-banner.png',
            'about' => '',
            'social_links' => json_encode([]),
        ]);

        // Return the created user
        return response()->json([
            'message' => 'User successfully registered!',
            'user' => $user
        ], 201);
    }
}