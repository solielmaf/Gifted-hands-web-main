<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        User::firstOrCreate([
            'email' => 'miraf@com',
        ], [
            'name' => 'Admin',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);
    }
}
