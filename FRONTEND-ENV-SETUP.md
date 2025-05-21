# Frontend Environment Setup

This document explains how to configure the frontend environment variables for the Chatwise AI Assistant.

## API Configuration

The frontend needs to know where to find the backend API. You can configure this in your `.env` file.

### Basic Setup

For the simplest setup with the API on the same domain (typical for production):

```
# API Configuration - Same domain
VITE_API_URL=/api
```

### Separate Backend

If your backend is running on a different host/port (common in development):

```
# API Configuration - Separate backend
VITE_API_URL=http://localhost:8000/api

# Or you can specify components individually
# VITE_BACKEND_PROTOCOL=http
# VITE_BACKEND_HOST=localhost
# VITE_BACKEND_PORT=8000
# VITE_BACKEND_PATH=api
```

### Debug Mode

Enable debug mode to see API calls in the browser console:

```
# Debug mode
VITE_DEBUG_MODE=true
```

## Authentication Configuration

Authentication issues are common when the API is not properly configured. Here are settings to help:

```
# Authentication
VITE_PUBLIC_API_MODE=false    # Set to 'true' only for completely public APIs with no auth
```

### Troubleshooting Authentication Issues

If you're seeing "Unauthenticated" errors, try these fixes:

1. **Ensure CSRF Protection is working**
   - Laravel requires CSRF tokens for API requests
   - Make sure your backend has CORS properly configured if using a separate domain
   - Check that cookies are being properly set by your backend

2. **API Request Overload**
   - Too many concurrent requests can cause authentication failures
   - The system now includes rate limiting to prevent this
   - If still having issues, try increasing `RATE_LIMIT_DELAY` in `src/services/api/api.ts`

3. **Check Browser Console**
   - Enable debug mode to see detailed API logs: `VITE_DEBUG_MODE=true`
   - Look for CORS errors or cookie issues

4. **Clear Local Storage**
   - Sometimes corrupted tokens can cause authentication issues
   - Open developer tools → Application → Storage → Local Storage → Clear

## Application Settings

```
# App Information
VITE_APP_VERSION=1.0.0
VITE_APP_NAME="Chatwise AI Assistant"
VITE_APP_DESCRIPTION="AI-powered chat assistant platform"

# Authentication
VITE_PUBLIC_API_MODE=false

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_KNOWLEDGE_BASE=true
VITE_ENABLE_AI_CONFIG=true

# Appearance
VITE_DEFAULT_THEME=system
```

## How Environment Variables Work

1. Create a `.env` file in the project root
2. Add the variables you want to configure
3. Restart the development server if it's running
4. Access variables in code via `import.meta.env.VARIABLE_NAME`

## Environment File Precedence

Vite uses these files in order of precedence:
- `.env.local` (highest priority, ignored by git)
- `.env.development` (for development mode)
- `.env.production` (for production mode)
- `.env` (base variables, lowest priority)

## Example Settings for Different Environments

### Local Development (Same-Origin API)

```
VITE_API_URL=/api
VITE_DEBUG_MODE=true
```

### Local Development (Separate Backend)

```
VITE_API_URL=http://localhost:8000/api
VITE_DEBUG_MODE=true
```

### Production

```
VITE_API_URL=/api
VITE_DEBUG_MODE=false
VITE_APP_VERSION=1.0.0
```

## Advanced: Creating Custom AI Provider

When creating a custom AI provider in the system, ensure you have:

1. Proper API authentication credentials
2. Correct base URL (if different from the default)
3. Proper model IDs for the chosen provider

## Common Issues

### "Unauthenticated" Errors
This usually means either:
- Your token has expired
- CSRF protection is failing
- Too many concurrent requests (fixed with our rate limiting)

### "Invalid HTML response" Errors
This means the backend returned HTML instead of JSON, typically due to:
- Server errors (500 responses)
- Incorrect API URL configuration
- CORS issues 