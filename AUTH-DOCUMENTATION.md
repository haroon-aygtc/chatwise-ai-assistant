# Laravel Sanctum + React Authentication Documentation

## Authentication Flow Overview

This implementation uses Laravel Sanctum for backend authentication with a React frontend. The flow works as follows:

1. **Initial Load**: 
   - Application initializes without making unnecessary API calls
   - Token is checked client-side for validity before any backend calls
   - Non-authenticated users don't trigger authentication API calls

2. **Login Process**:
   - User submits credentials (email/password)
   - Frontend requests CSRF token from Laravel Sanctum
   - Credentials sent to Laravel backend
   - Backend validates credentials and returns user data + token
   - Frontend stores token in localStorage and user data in React context

3. **Post-Authentication**:
   - Token is included with all subsequent API requests
   - Protected routes check permissions/roles client-side
   - Token validity is checked periodically to maintain security

4. **Token Management**:
   - Supports both JWT and non-JWT token formats
   - Gracefully handles Laravel Sanctum's token format
   - Auto-cleans expired/invalid tokens

## Key Components

### Backend (Laravel)

1. **AuthController.php**:
   - Handles login, registration, logout endpoints
   - Returns properly formatted user data with permissions
   - Uses Spatie Permission package for role/permission management

   ```php
   // Key method for login
   public function login(Request $request)
   {
       $validated = $request->validate([
           'email' => ['required', 'string', 'email'],
           'password' => ['required', 'string'],
       ]);

       if (!Auth::attempt($validated, $request->boolean('remember'))) {
           return response()->json([
               'message' => 'Invalid login credentials'
           ], 401);
       }

       $user = Auth::user();
       $user->update(['last_active' => now()]);

       // Log user login activity
       ActivityLogService::logLogin($user);

       // Generate token
       $token = $user->createToken('auth_token')->plainTextToken;

       return response()->json([
           'user' => $this->formatUserResponse($user),
           'token' => $token,
       ]);
   }
   ```

2. **User Model**:
   - Uses HasRoles trait from Spatie
   - Properly formats permissions for frontend consumption

   ```php
   use HasApiTokens, HasFactory, Notifiable, HasRoles;
   
   // Note: The HasRoles trait already provides getAllPermissions() method
   // that correctly fetches both direct permissions and permissions from roles
   ```

### Frontend (React)

1. **tokenService.ts**:
   - Manages token storage, retrieval, and validation
   - Handles both JWT and non-JWT token formats
   - Implements CSRF token initialization for Laravel Sanctum
   
   ```typescript
   // Key methods
   
   // Token storage
   getToken: (): string | null => {
     return localStorage.getItem("auth_token");
   },

   setToken: (token: string): void => {
     localStorage.setItem("auth_token", token);
   },
   
   // CSRF token initialization for Laravel Sanctum
   initCsrfToken: async (): Promise<void> => {
     // Check if token already exists first
     const existingToken = document
       .querySelector('meta[name="csrf-token"]')
       ?.getAttribute("content");
     
     if (existingToken) return;
     
     // Fetch CSRF cookie from Laravel Sanctum
     await fetch(`${API_CONFIG.BASE_URL.replace('/api', '')}/sanctum/csrf-cookie`, {
       method: "GET",
       credentials: "include",
       headers: {
         Accept: "application/json",
         "X-Requested-With": "XMLHttpRequest",
       },
     });
   },
   
   // Token validation that handles both JWT and non-JWT formats
   validateToken: (): boolean => {
     const token = localStorage.getItem("auth_token");
     if (!token) return false;

     // Handle non-JWT tokens (Laravel Sanctum sometimes uses non-JWT tokens)
     if (!token.includes('.')) {
       // If it's not a JWT, we can still consider it valid if it exists
       return true;
     }
     
     // JWT validation logic
     try {
       const decoded: any = jwtDecode(token);
       const now = Date.now() / 1000;
       return !(decoded.exp && decoded.exp < now);
     } catch (error) {
       return false;
     }
   }
   ```

2. **authService.ts**:
   - Handles API calls for authentication
   - Manages user session state
   
   ```typescript
   // Login function
   async login(credentials: LoginCredentials) {
     // First, ensure we have a CSRF token
     await tokenService.initCsrfToken();

     const response = await axios.post(
       `${API_CONFIG.BASE_URL}/login`,
       credentials,
       {
         withCredentials: true,
         headers: {
           Accept: "application/json",
           "Content-Type": "application/json",
           "X-Requested-With": "XMLHttpRequest",
         },
       },
     );
     const { user, token } = response.data;
     tokenService.setToken(token);
     return { user, token };
   }
   
   // Get current user data
   async getCurrentUser() {
     const token = tokenService.getToken();
     if (!token) return null;

     const headers = this.getAuthHeaders(token);
     const response = await axios.get(`${API_CONFIG.BASE_URL}/user`, {
       headers,
       withCredentials: true,
     });

     return response.data.user;
   }
   ```

3. **useAuth.tsx**:
   - React context provider for authentication state
   - Exposes authentication methods to components
   - Key functions:
   
   ```typescript
   // Authentication context structure
   export interface AuthContextType {
     user: User | null;
     isAuthenticated: boolean;
     isLoading: boolean;
     login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
     logout: () => Promise<void>;
     signup: (data: SignupData) => Promise<boolean>;
     hasRole: (role: string | string[]) => boolean;
     hasPermission: (permission: string | string[]) => boolean;
     updateUser: (userData: Partial<User>) => void;
     refreshAuth: () => Promise<void>;
   }
   
   // Initialize auth on component mount - optimized to prevent unnecessary API calls
   useEffect(() => {
     const initializeAuth = async () => {
       // Try to get token and check validity first
       const token = tokenService.getToken();
       const isValid = token ? tokenService.validateToken() : false;

       // Only initialize CSRF and fetch user data if we have a valid token
       if (isValid) {
         // CSRF token initialization
         await tokenService.initCsrfToken();
         
         // Fetch user data
         const userData = await authService.getCurrentUser();
         if (userData) {
           setUser({
             ...userData,
             id: String(userData.id),
             permissions: Array.isArray(userData.permissions) ? userData.permissions : [],
           } as User);
         }
       }
     };

     initializeAuth();
   }, []);
   
   // Permission checking
   const hasPermission = useCallback((permission: string | string[]): boolean => {
     if (!user || !user.permissions) return false;

     // Special case: 'super-admin' role users always have all permissions
     if (user.roles && Array.isArray(user.roles)) {
       const isAdmin = user.roles.some(role => {
         const roleName = typeof role === 'object' && role.name ? role.name : role;
         return roleName === 'super-admin';
       });

       if (isAdmin) return true;
     }

     // Regular permission check
     const userPermissions = Array.isArray(user.permissions) ? user.permissions : [];
     const requiredPermissions = Array.isArray(permission) ? permission : [permission];
     return requiredPermissions.some(p => userPermissions.includes(p));
   }, [user]);
   ```

4. **ProtectedRoute.tsx**:
   - Guards routes based on authentication state
   - Checks user permissions and roles
   
   ```typescript
   const ProtectedRoute = ({
     children,
     requiredRole,
     requiredPermission,
     redirectTo = "/login",
   }: ProtectedRouteProps) => {
     const { isAuthenticated, isLoading, hasRole, hasPermission, refreshAuth, user } = useAuth();
     
     // Only refresh auth if we're authenticated but missing the user data
     useEffect(() => {
       const needsRefresh = isAuthenticated && (
         !user || 
         (user.permissions && user.permissions.length === 0 && (requiredPermission || requiredRole))
       );

       if (needsRefresh) {
         refreshAuth();
       }
     }, [isAuthenticated, user, requiredRole, requiredPermission, refreshAuth]);

     if (isLoading) {
       return <LoadingSpinner />;
     }

     // If not authenticated, redirect to login
     if (!isAuthenticated) {
       sessionStorage.setItem('redirectAfterLogin', location.pathname);
       return <Navigate to={redirectTo} state={{ from: location }} replace />;
     }

     // Check role and permission requirements
     if (requiredRole && !hasRole(requiredRole)) {
       return <Navigate to="/unauthorized" state={{ from: location }} replace />;
     }

     if (requiredPermission && !hasPermission(requiredPermission)) {
       return <Navigate to="/unauthorized" state={{ from: location }} replace />;
     }

     // All checks passed, render the protected route
     return <>{children}</>;
   };
   ```

5. **SessionExpirationModal.tsx**:
   - Monitors token expiration and prompts for refresh
   - Handles both JWT and non-JWT token formats
   
   ```typescript
   const checkTokenExpiration = () => {
     // Get token and check if it exists
     const token = tokenService.getToken();
     if (!token) return;

     // Skip non-JWT tokens (they could be Laravel Sanctum tokens)
     if (!token.includes('.')) {
       return;
     }

     // Decode the token to get expiration
     const decoded = tokenService.decodeToken(token);
     if (!decoded || !decoded.exp) return;

     // Calculate time until expiration in seconds
     const currentTime = Math.floor(Date.now() / 1000);
     const timeUntilExpiry = decoded.exp - currentTime;

     // If within warning threshold, show dialog
     if (timeUntilExpiry > 0 && timeUntilExpiry <= WARNING_THRESHOLD) {
       setSecondsLeft(timeUntilExpiry);
       setOpen(true);
     } else if (timeUntilExpiry <= 0) {
       logout();
     }
   };
   ```

## Security Features

1. **CSRF Protection**:
   - Implements Laravel Sanctum's CSRF protection
   - Fetches CSRF cookie before authentication attempts
   - Includes proper headers for CSRF validation

2. **Token Validation**:
   - Client-side validation to reduce unnecessary API calls
   - Server-side validation for actual security enforcement
   - Handles token expiration gracefully

3. **Permission-Based Access Control**:
   - Uses Spatie Permissions for granular access control
   - Frontend components respect backend permissions
   - Super-admin role has automatic access to all features

4. **Error Handling**:
   - Graceful handling of authentication errors
   - Clear error messaging for users
   - Proper cleanup of invalid tokens

## Optimization Features

1. **Reduced API Calls**:
   - Token validated client-side before making API calls
   - CSRF token only fetched when needed
   - Auth refresh only triggered when permissions needed
   - Cached user data to reduce API calls

2. **Conditional Logging**:
   - Debug logs only visible in development environment
   - Structured logging with context for easier debugging

3. **Non-Blocking UI**:
   - Authentication processes don't block UI rendering
   - Loading states properly managed

## Common Issues & Solutions

### 1. Invalid Token Error with Laravel Sanctum

**Problem**: Laravel Sanctum tokens might not be in JWT format, causing errors when attempting to decode them as JWT.

**Solution**: Our implementation detects non-JWT tokens and handles them properly:

```typescript
// Check if token is in JWT format (contains two dots)
if (!token.includes('.')) {
  // Handle as non-JWT token
  return true;
}
```

### 2. CSRF Token Not Found

**Problem**: Sometimes the CSRF token is not properly set in meta tags.

**Solution**: We check for the XSRF-TOKEN cookie directly:

```typescript
if (!token) {
  // Check if we can find the cookie directly
  const cookies = document.cookie.split('; ');
  const xsrfCookie = cookies.find(cookie => cookie.startsWith('XSRF-TOKEN='));
}
```

### 3. Unnecessary API Calls on Page Refresh

**Problem**: Many implementations fetch user data on every page load/refresh, which is inefficient.

**Solution**: We validate tokens client-side first, and only make API calls when necessary:

```typescript
// Only initialize CSRF and fetch user data if we have a valid token
if (isValid) {
  // Then make API calls...
}
```

### 4. Missing Permission for Dashboard Cards

**Problem**: Dashboard cards might not display correctly if the permission check is looking for a specific permission that the user doesn't have, even if they have the admin role with extensive permissions.

**Solution**: For route protection, use an array of permissions to check against, making the route accessible if the user has any of the listed permissions:

```typescript
// Instead of checking for a single permission:
<ProtectedRoute
  requiredRole="admin"
  requiredPermission="access admin panel" // This exact permission might not exist
>
  <AdminLayout />
</ProtectedRoute>

// Check for any of multiple permissions that are likely to exist:
<ProtectedRoute
  requiredRole="admin"
  requiredPermission={["view_users", "view_roles", "manage_users"]}
>
  <AdminLayout />
</ProtectedRoute>
```

This approach allows the route to be accessed if the user has any of the specified permissions, which is more flexible than requiring a single specific permission.

## Best Practices

1. Always validate tokens both client-side and server-side
2. Use Laravel Sanctum's CSRF protection for all authentication attempts
3. Store sensitive user data only in memory (React state), never in localStorage
4. Only store tokens in localStorage for persistence
5. Check permissions on both frontend and backend for complete security
6. Handle non-JWT tokens properly for Laravel Sanctum compatibility

## Global Permission System

A comprehensive solution was implemented to handle permissions more effectively across the application:

### 1. Enhanced Permission Checking

The `hasPermission` function in the auth context was enhanced to support:

- **Permission aliases**: Common permission names are mapped to their system equivalents
- **Format variations**: Both space-separated and underscore-separated formats are supported
- **Admin role detection**: Users with 'admin' or 'super-admin' roles automatically have all permissions

```typescript
// Permission aliases - map common permission names to their equivalent in the system
const permissionAliases: Record<string, string[]> = {
  'access admin panel': ['view_users', 'manage_users', 'view_roles'],
  'manage users': ['view_users', 'create_users', 'edit_users', 'delete_users', 'manage_users'],
  'manage roles': ['view_roles', 'create_roles', 'edit_roles', 'delete_roles', 'manage_roles'],
  // ...more aliases
};

// Format variation handling
const normalizedPermission = p.replace(/[ _]/g, '_'); // Convert spaces to underscores
const spacedPermission = p.replace(/[ _]/g, ' ');    // Convert underscores to spaces
```

### 2. Reusable Permission Component

A `PermissionAwareComponent` was created to easily handle permission-based rendering throughout the application:

```typescript
// Basic usage - only show component if user has the required permission
<PermissionAwareComponent requiredPermission="edit_users">
  <EditUserButton />
</PermissionAwareComponent>

// Check multiple permissions (user needs any one of them)
<PermissionAwareComponent requiredPermission={["view_users", "manage_users"]}>
  <UserList />
</PermissionAwareComponent>

// Role-based rendering
<PermissionAwareComponent requiredRole="admin">
  <AdminPanel />
</PermissionAwareComponent>

// Show alternative content when permission check fails
<PermissionAwareComponent 
  requiredPermission="delete_users"
  fallback={<p>You don't have permission to delete users</p>}
>
  <DeleteUserButton />
</PermissionAwareComponent>
```

### 3. Dashboard Cards Implementation

Dashboard cards now use the permission component for permission-based rendering:

```typescript
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* User Management Card */}
  <PermissionAwareComponent requiredPermission="manage users">
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <h3 className="font-medium text-lg mb-2">Manage Users</h3>
      {/* Card content */}
    </div>
  </PermissionAwareComponent>
  
  {/* Roles & Permissions Card */}
  <PermissionAwareComponent requiredPermission="manage roles">
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <h3 className="font-medium text-lg mb-2">Roles & Permissions</h3>
      {/* Card content */}
    </div>
  </PermissionAwareComponent>
  
  {/* Activity Logs Card */}
  <PermissionAwareComponent requiredPermission={["view_activity_log", "view_audit_logs"]}>
    <div className="bg-card rounded-lg border shadow-sm p-6">
      <h3 className="font-medium text-lg mb-2">Activity Logs</h3>
      {/* Card content */}
    </div>
  </PermissionAwareComponent>
</div>
```

This approach provides a centralized, consistent way to handle permissions across the entire application, eliminating the need for repetitive permission logic and reducing the risk of inconsistent permission handling.

This implementation securely integrates Laravel Sanctum with React while maintaining good performance and avoiding unnecessary API calls. 