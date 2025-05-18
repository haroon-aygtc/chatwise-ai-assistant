<?php

/**
 * Script to fix empty lines at the top of request files
 */

$directory = __DIR__ . '/app/Http/Requests';
$fileCount = 0;
$fixedCount = 0;

// Function to fix a file
function fixFile($filePath) {
    global $fixedCount;

    $content = file_get_contents($filePath);

    // Remove any empty lines at the beginning of the file
    $newContent = preg_replace('/^\s+/', '', $content);

    // Ensure the file starts with <?php
    if (!preg_match('/^<\?php/', $newContent)) {
        $newContent = "<?php\n" . $newContent;
    }

    // Only update if changes were made
    if ($newContent !== $content) {
        file_put_contents($filePath, $newContent);
        echo "Fixed: " . basename($filePath) . "\n";
        $fixedCount++;
        return true;
    }

    return false;
}

// Process the directory
if (!is_dir($directory)) {
    echo "Directory not found: $directory\n";
    exit(1);
}

echo "Checking directory: " . basename($directory) . "\n";

// Get all PHP files in the directory
$files = glob($directory . '/*.php');

foreach ($files as $file) {
    $fileCount++;
    fixFile($file);
}

echo "\nSummary:\n";
echo "Total PHP files checked: $fileCount\n";
echo "Files fixed: $fixedCount\n";
