<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TestimonialController extends Controller
{
    /**
     * Display a listing of testimonials.
     */
    public function index()
    {
        $testimonials = Testimonial::all();

        return $testimonials->map(function ($t) {
            $avatars = [];
            if (is_array($t->avatar))
                $avatars = $t->avatar;
            elseif (is_string($t->avatar)) {
                $decoded = json_decode($t->avatar, true);
                $avatars = is_array($decoded) ? $decoded : [$t->avatar];
            }
            $avatars = array_filter($avatars);
            return [
                'id' => $t->id,
                'name' => $t->name,
                'email' => $t->email,
                'designation' => $t->designation,
                'message' => $t->message,
                'avatar' => $avatars
            ];
        });
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'message' => 'required|string',
            'email' => 'nullable|email',
            'designation' => 'nullable|string|max:255',
            'avatar.*' => 'nullable|image|max:2048',
        ]);

        $avatars = [];
        if ($request->hasFile('avatar')) {
            foreach ($request->file('avatar') as $file) {
                $avatars[] = $file->store('testimonials', 'public');
            }
        }

        $testimonial = Testimonial::create([
            'name' => $request->name,
            'email' => $request->email,
            'designation' => $request->designation,
            'message' => $request->message,
            'avatar' => !empty($avatars) ? json_encode($avatars) : json_encode([]),
        ]);

        return response()->json($testimonial);
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'message' => 'required|string',
            'email' => 'nullable|email',
            'designation' => 'nullable|string|max:255',
            'avatar.*' => 'nullable|image|max:2048',
        ]);

        $data = $request->only('name', 'email', 'designation', 'message');

        if ($request->hasFile('avatar')) {
            $avatars = [];
            foreach ($request->file('avatar') as $file) {
                $avatars[] = $file->store('testimonials', 'public');
            }
            $data['avatar'] = json_encode($avatars);
        }

        $testimonial->update($data);
        return response()->json($testimonial);
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

}