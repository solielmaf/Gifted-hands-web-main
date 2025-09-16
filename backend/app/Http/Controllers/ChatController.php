<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

class ChatController extends Controller
{
    // Send a message
    public function sendMessage(Request $request)
    {
        try {
            $validated = $request->validate([
                'message' => 'required|string',
                'user_id' => 'sometimes|exists:users,id',
            ]);

            $authUser = Auth::user();
            if (!$authUser) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }

            $admin = User::where('role', 'admin')->first();
            if (!$admin) {
                return response()->json(['error' => 'No admin available'], 404);
            }

            $userId = $authUser->role === 'admin' ? $request->user_id : $authUser->id;
            if (!$userId) {
                return response()->json(['error' => 'user_id is required when admin sends message'], 422);
            }

            $adminId = $authUser->role === 'admin' ? $authUser->id : $admin->id;

            $chat = Chat::create([
                'user_id' => $userId,
                'admin_id' => $adminId,
                'message' => $request->message,
                'is_admin' => $authUser->role === 'admin',
            ]);

            return response()->json(['success' => true, 'chat' => $chat], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            \Log::error('Chat send failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => 'Failed to send message',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function updateMessage(Request $request, $id)
    {
        $request->validate(['message' => 'required|string']);

        $authUser = Auth::user();
        if (!$authUser)
            return response()->json(['error' => 'Unauthenticated'], 401);

        $msg = Chat::find($id);
        if (!$msg)
            return response()->json(['error' => 'Message not found'], 404);

        // Only sender or admin can edit
        if ($authUser->role !== 'admin' && $msg->user_id !== $authUser->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $msg->message = $request->message;
        $msg->save();

        return response()->json($msg);
    }

    // Get messages between user and admin
    public function getMessages($user_id)
    {
        $authUser = Auth::user();
        if (!$authUser)
            return response()->json(['error' => 'Unauthenticated'], 401);

        $admin = User::where('role', 'admin')->first();
        if (!$admin)
            return response()->json(['error' => 'No admin available'], 404);

        // Determine user and admin IDs
        $userId = $authUser->role === 'admin' ? $user_id : $authUser->id;
        $adminId = $admin->id;

        $messages = Chat::where(function ($q) use ($userId, $adminId) {
            $q->where('user_id', $userId)->where('admin_id', $adminId);
        })->orWhere(function ($q) use ($userId, $adminId) {
            $q->where('user_id', $adminId)->where('admin_id', $userId);
        })->orderBy('created_at', 'asc')->get();

        return response()->json($messages);
    }

    // Admin conversation list
    public function getConversations()
    {
        $authUser = Auth::user();

        if (!$authUser || $authUser->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Get all user IDs that have chatted with the admin
        $userIds = Chat::where('admin_id', $authUser->id)
            ->orWhere('user_id', $authUser->id)
            ->pluck('user_id')
            ->merge(Chat::where('admin_id', $authUser->id)->pluck('user_id'))
            ->unique()
            ->filter(fn($id) => $id != $authUser->id); // skip admin itself

        $conversations = [];

        foreach ($userIds as $uid) {
            $lastMessage = Chat::where(function ($q) use ($uid, $authUser) {
                $q->where('user_id', $uid)->where('admin_id', $authUser->id);
            })
                ->orWhere(function ($q) use ($uid, $authUser) {
                    $q->where('user_id', $authUser->id)->where('admin_id', $uid);
                })
                ->orderBy('created_at', 'desc')
                ->first();

            $user = User::find($uid);

            if ($user && $lastMessage) {
                $conversations[] = [
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                    'last_message' => $lastMessage->message,
                    'last_message_time' => $lastMessage->created_at,
                    'last_message_is_admin' => (bool) $lastMessage->is_admin,
                ];
            }
        }

        return response()->json(['conversations' => $conversations]);
    }

    public function deleteMessage($id)
    {
        $authUser = Auth::user();
        if (!$authUser) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $message = Chat::find($id);

        if (!$message) {
            return response()->json(['error' => 'Message not found'], 404);
        }

        // Only allow the sender (or admin) to delete
        if ($authUser->role !== 'admin' && $message->user_id !== $authUser->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $message->delete();

        return response()->json(['success' => true, 'message' => 'Message deleted']);
    }
}