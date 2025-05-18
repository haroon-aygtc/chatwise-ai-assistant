<?php

/**
 * Script to remove empty lines at the top of PHP files
 */

// Define directories to check
$directories = [
    __DIR__ . '/app/Http/Controllers',
    __DIR__ . '/app/Http/Controllers/API',
    __DIR__ . '/app/Http/Requests',
    __DIR__ . '/app/Models',
    __DIR__ . '/app/Services',
    __DIR__ . '/app/Providers',
    __DIR__ . '/database/migrations',
];

$fileCount = 0;
$fixedCount = 0;

// Function to fix a file
function fixFile($filePath) {
    global $fixedCount;

    $content = file_get_contents($filePath);

    // Check if file starts with an empty line
    if (preg_match('/^\s*\n/', $content)) {
        // Remove empty lines at the beginning
        $newContent = preg_replace('/^\s*\n+/', '', $content);

        // Write back to file
        file_put_contents($filePath, $newContent);

        echo "Fixed: $filePath\n";
        $fixedCount++;
        return true;
    }

    return false;
}

// Process each directory
foreach ($directories as $directory) {
    if (!is_dir($directory)) {
        echo "Directory not found: $directory\n";
        continue;
    }

    echo "Checking directory: $directory\n";

    // Get all PHP files in the directory
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($directory)
    );

    foreach ($iterator as $file) {
        if ($file->isFile() && $file->getExtension() === 'php') {
            $fileCount++;
            fixFile($file->getPathname());
        }
    }
}

echo "\nSummary:\n";
echo "Total PHP files checked: $fileCount\n";
echo "Files fixed: $fixedCount\n";
