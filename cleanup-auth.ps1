# Cleanup script for removing duplicate auth files

# Files to remove
$filesToRemove = @(
    # Duplicate auth context
    "src/contexts/AuthContext.tsx",
    
    # Duplicate auth services
    "src/services/auth/authService.ts",
    "src/services/auth/tokenService.ts",
    "src/services/auth.ts",
    "src/modules/auth/services/sessionService.ts",
    
    # Duplicate protected route
    "src/components/auth/ProtectedRoute.tsx",
    
    # Duplicate login/signup forms
    "src/components/auth/LoginForm.tsx",
    "src/components/auth/SignupForm.tsx"
)

# Check each file and remove if it exists
foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Write-Host "Removing duplicate file: $file"
        Remove-Item $file
    } else {
        Write-Host "File not found: $file"
    }
}

Write-Host "Auth system cleanup complete!"
