<?php

namespace Database\Seeders;

use App\Models\PromptTemplate;
use Illuminate\Database\Seeder;

class PromptTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Welcome Message',
                'description' => 'Initial greeting for new users',
                'template' => 'Hello {user_name}, welcome to {company_name}! I\'m your AI assistant and I\'m here to help you with any questions about our products and services.',
                'variables' => [
                    [
                        'name' => 'user_name',
                        'description' => 'User\'s name',
                        'required' => true,
                        'defaultValue' => ''
                    ],
                    [
                        'name' => 'company_name',
                        'description' => 'Company name',
                        'required' => true,
                        'defaultValue' => ''
                    ]
                ],
                'category' => 'general',
                'is_active' => true,
                'is_default' => true,
            ],
            [
                'name' => 'Product Information',
                'description' => 'Details about products and services',
                'template' => 'Our {product_name} offers the following features: {features}. The pricing starts at {price}. Would you like more specific information about any of these features?',
                'variables' => [
                    [
                        'name' => 'product_name',
                        'description' => 'Product name',
                        'required' => true,
                        'defaultValue' => ''
                    ],
                    [
                        'name' => 'features',
                        'description' => 'Product features',
                        'required' => true,
                        'defaultValue' => ''
                    ],
                    [
                        'name' => 'price',
                        'description' => 'Product price',
                        'required' => true,
                        'defaultValue' => ''
                    ]
                ],
                'category' => 'products',
                'is_active' => true,
                'is_default' => false,
            ],
            [
                'name' => 'Technical Support',
                'description' => 'Handling technical questions',
                'template' => 'I understand you\'re having an issue with {issue_description}. Let me help you troubleshoot this. First, could you tell me if you\'ve tried {troubleshooting_step}?',
                'variables' => [
                    [
                        'name' => 'issue_description',
                        'description' => 'Description of the issue',
                        'required' => true,
                        'defaultValue' => ''
                    ],
                    [
                        'name' => 'troubleshooting_step',
                        'description' => 'Initial troubleshooting step',
                        'required' => true,
                        'defaultValue' => ''
                    ]
                ],
                'category' => 'support',
                'is_active' => true,
                'is_default' => false,
            ],
        ];

        foreach ($templates as $template) {
            PromptTemplate::create($template);
        }
    }
}