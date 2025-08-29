<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Mail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'message' => 'required|string',
        ]);

        // Send email
        Mail::raw("New Contact Message:\n\nName: {$data['name']} \nEmail: {$data['email']}\nMessage: {$data['message']}", function ($message) {
            $message->to('miraftsegaye19@gmail.com')->subject('New Contact Message from Website');
        });

        return response()->json([
            'success' => true,
            'message' => 'Contact message sent successfully!',
        ]);
    }
}
