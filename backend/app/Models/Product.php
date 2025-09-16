<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'category_id',
        'images'
    ];

    protected $casts = [
        'images' => 'array', // This will auto-convert JSON string to array
    ];

    // Add accessor to get full image URLs
    public function getImageUrlsAttribute()
    {
        if (empty($this->images)) {
            return [asset('storage/placeholder.png')];
        }

        return array_map(function ($image) {
            // Remove any quotes or brackets if they exist
            $cleanImage = trim($image, '"[]');
            return asset('storage/' . $cleanImage);
        }, (array) $this->images);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}