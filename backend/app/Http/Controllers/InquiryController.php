<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\Request;
use Mail;

class InquiryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'message' => 'required|string',
            'product_id' => 'required|integer|exists:products,id', // add product_id validation
        ]);

        // Save inquiry
        $inquiry = Inquiry::create($data);

        // Get product name
        $productName = \App\Models\Product::find($data['product_id'])->name ?? 'Unknown Product';

        // Send email
        Mail::raw(
            "New Inquiry for Product: {$productName}\n\nName: {$data['name']}\nEmail: {$data['email']}\nMessage: {$data['message']}",
            function ($message) use ($data, $productName) {
                $message->to('miraftsegaye19@gmail.com')
                    ->subject("New Inquiry for {$productName}");
            }
        );

        return response()->json([
            'success' => true,
            'message' => 'Inquiry submitted successfully!',
            'data' => $inquiry
        ]);
    }


    /**
     * Display the specified resource.
     */
    public function show(Inquiry $inquiry)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Inquiry $inquiry)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Inquiry $inquiry)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Inquiry $inquiry)
    {
        //
    }
}
