<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class ApiAuth
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        
        $accessToken = PersonalAccessToken::findToken($token);
        
        if (!$accessToken) {
            return response()->json(['message' => 'Invalid token'], 401);
        }
        
        $user = $accessToken->tokenable;
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 401);
        }
        
        auth()->setUser($user);
        
        return $next($request);
    }
}

