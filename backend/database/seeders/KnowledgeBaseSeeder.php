<?php

namespace Database\Seeders;

use App\Models\DocumentCategory;
use App\Models\KnowledgeDocument;
use App\Models\KnowledgeBaseSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class KnowledgeBaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create initial settings
        KnowledgeBaseSetting::create([
            'is_enabled' => true,
            'priority' => 'medium',
            'include_citations' => true,
        ]);

        // Create document categories
        $productCategory = DocumentCategory::create([
            'name' => 'Product Information',
            'description' => 'Documents related to product features and capabilities',
        ]);

        $technicalCategory = DocumentCategory::create([
            'name' => 'Technical Documentation',
            'description' => 'Technical documents, API references, and developer guides',
        ]);

        $supportCategory = DocumentCategory::create([
            'name' => 'Support & Troubleshooting',
            'description' => 'Help documents and troubleshooting guides',
        ]);

        // Create sample documents
        KnowledgeDocument::create([
            'title' => 'Getting Started Guide',
            'description' => 'A comprehensive guide to help new users get started with the platform',
            'content' => "# Getting Started Guide\n\nThis guide will help you understand the basics of our platform and get you up and running quickly.\n\n## Introduction\n\nWelcome to our platform! This guide provides an overview of the key features and how to get started.\n\n## Basic Setup\n\n1. Create an account\n2. Set up your profile\n3. Configure your preferences\n\n## Advanced Features\n\nOnce you've mastered the basics, check out our advanced features to get the most out of the platform.",
            'category_id' => $productCategory->id,
            'file_type' => 'md',
            'file_size' => 1520,
            'tags' => ['getting-started', 'tutorial', 'beginners'],
            'status' => 'indexed',
            'last_indexed_at' => now(),
        ]);

        KnowledgeDocument::create([
            'title' => 'API Reference',
            'description' => 'Complete reference documentation for the REST API',
            'content' => "# API Reference\n\nThis document provides details on all available API endpoints and how to use them.\n\n## Authentication\n\nAll API requests require authentication using an API key or OAuth token.\n\n## Endpoints\n\n### GET /api/users\n\nReturns a list of all users.\n\n### POST /api/users\n\nCreates a new user.\n\n### DELETE /api/users/{id}\n\nDeletes a user by ID.",
            'category_id' => $technicalCategory->id,
            'file_type' => 'md',
            'file_size' => 2340,
            'tags' => ['api', 'reference', 'developer'],
            'status' => 'indexed',
            'last_indexed_at' => now(),
        ]);

        KnowledgeDocument::create([
            'title' => 'Troubleshooting Common Issues',
            'description' => 'Solutions to common problems users may encounter',
            'content' => "# Troubleshooting Common Issues\n\nThis guide addresses the most frequent issues reported by users and provides solutions.\n\n## Login Problems\n\nIf you're having trouble logging in, try the following:\n\n1. Clear your browser cache\n2. Reset your password\n3. Check your account status\n\n## Performance Issues\n\nIf the application is running slowly:\n\n1. Check your internet connection\n2. Close unnecessary browser tabs\n3. Clear browser cache and cookies",
            'category_id' => $supportCategory->id,
            'file_type' => 'md',
            'file_size' => 1840,
            'tags' => ['troubleshooting', 'help', 'issues'],
            'status' => 'indexed',
            'last_indexed_at' => now(),
        ]);
    }
}