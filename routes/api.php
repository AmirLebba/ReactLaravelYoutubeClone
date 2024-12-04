<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/auth/login', 'AuthController@login');
Route::post('/auth/register', 'AuthController@register');

Route::group(['middleware' => 'auth:api'], function () {
    // Routes that require authentication
    Route::post('/videos', 'VideoController@store');
    Route::get('/users', 'UserController@index');
    Route::get('/users/{id}', 'UserController@show');
});

Route::get('/videos', 'VideoController@index');
Route::get('/videos/{id}', 'VideoController@show');
