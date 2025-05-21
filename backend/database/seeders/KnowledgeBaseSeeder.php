<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class KnowledgeBaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Skip if tables don't exist
        if (!Schema::hasTable('resource_collections') || !Schema::hasTable('knowledge_resources')) {
            $this->command->info('Tables not found, skipping Knowledge Base seeder');
            return;
        }

        try {
            // Create default collection
            $defaultCollectionId = (string) Str::uuid();
            $supportCollectionId = (string) Str::uuid();

            DB::table('resource_collections')->insert([
                'id' => $defaultCollectionId,
                'name' => 'General Documentation',
                'description' => 'General documentation and knowledge resources',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('resource_collections')->insert([
                'id' => $supportCollectionId,
                'name' => 'Support Articles',
                'description' => 'Support guides and troubleshooting information',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create sample resources (articles)
            DB::table('knowledge_resources')->insert([
                'id' => (string) Str::uuid(),
                'title' => 'Getting Started Guide',
                'description' => 'A comprehensive guide to help new users get started with the platform',
                'collection_id' => $defaultCollectionId,
                'resource_type' => 'ARTICLE',
                'tags' => json_encode(['getting-started', 'tutorial', 'beginners']),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('knowledge_resources')->insert([
                'id' => (string) Str::uuid(),
                'title' => 'API Reference',
                'description' => 'Complete reference documentation for the REST API',
                'collection_id' => $defaultCollectionId,
                'resource_type' => 'ARTICLE',
                'tags' => json_encode(['api', 'reference', 'developer']),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('knowledge_resources')->insert([
                'id' => (string) Str::uuid(),
                'title' => 'Troubleshooting Common Issues',
                'description' => 'Solutions to common problems users may encounter',
                'collection_id' => $supportCollectionId,
                'resource_type' => 'ARTICLE',
                'tags' => json_encode(['troubleshooting', 'help', 'issues']),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create a context scope
            if (Schema::hasTable('context_scopes')) {
                DB::table('context_scopes')->insert([
                    'id' => (string) Str::uuid(),
                    'name' => 'Default Scope',
                    'description' => 'Default context scope for general queries',
                    'scope_type' => 'GLOBAL',
                    'conditions' => json_encode(['global' => true]),
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

        } catch (\Exception $e) {
            $this->command->error('Error seeding knowledge base: ' . $e->getMessage());
        }
    }
}
