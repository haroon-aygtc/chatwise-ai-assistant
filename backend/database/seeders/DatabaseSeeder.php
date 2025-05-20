<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            AdminPermissionsSeeder::class, // Add our new seeder to ensure admin has all permissions
            UserSeeder::class,
            ModelProviderSeeder::class,    // Add Model Provider seeder
            PromptTemplateSeeder::class,
            KnowledgeBaseSeeder::class,
            ResponseFormatSeeder::class,
            FollowUpSeeder::class,
            ActivityLogSeeder::class,
        ]);
    }
}
