<?php

use App\Models\Product;
use App\Models\Service;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
Route::get('/add-categories', function () {
    $categories = [
        'Medical Imaging Solutions',
        'Laboratory Equipment (IVD Solutions)',
        'Patient Monitoring & Life Support (PMLS)',
        'Hospital & Surgical Equipment',
        'Consumables & Accessories'
    ];


    foreach ($categories as $name) {
        \App\Models\Category::firstOrCreate(['name' => $name]);
    }

    return "Categories added successfully!";
});
Route::get('/add-products', function () {
    $products = [
        [
            'name' => 'Lab Microscope',
            'description' => 'High-quality X-Ray machine for hospitals',
            'price' => 1500,
            'category_id' => 2,
            'images' => json_encode(['/labMicroscope.jpg']),
        ],



    ];
    foreach ($products as $p) {
        Product::create($p);
    }

    return "✅ Sample products added successfully!";
});

Route::get('/add-service', function () {
    $services = [
        [
            'name' => 'Installation & Training',
            'description' => 'Professional installation and staff training for your equipment.',
            'price' => 1000, // set your default price
        ],
        [
            'name' => 'Maintenance & After Sales Support',
            'description' => 'Regular maintenance and ongoing support for your systems.',
            'price' => 500, // set your default price
        ],
        [
            'name' => 'Consultation and Custom Solution',
            'description' => 'Expert consultation and custom solutions for your specific needs.',
            'price' => 1500, // set your default price
        ],
    ];

    foreach ($services as $service) {
        Service::firstOrCreate(['name' => $service['name']], [
            'description' => $service['description'],
            'price' => $service['price']
        ]);
    }

    return "Services added successfully!";
});