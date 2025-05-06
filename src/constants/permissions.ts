/**
 * Permission Constants
 *
 * This file centralizes all permission-related constants to eliminate
 * hardcoded strings across the application.
 */

// Permission Categories
export const PERMISSION_CATEGORIES = [
  "User Management",
  "AI Configuration",
  "Widget Builder",
  "Knowledge Base",
  "System Settings",
];

// Permission Keys by Category
export const PERMISSIONS = {
  "User Management": [
    "view_users",
    "create_users",
    "edit_users",
    "delete_users",
    "assign_roles",
  ],
  "AI Configuration": [
    "manage_models",
    "edit_prompts",
    "test_ai",
    "view_ai_logs",
  ],
  "Widget Builder": [
    "create_widgets",
    "edit_widgets",
    "publish_widgets",
    "delete_widgets",
  ],
  "Knowledge Base": [
    "create_kb_articles",
    "edit_kb_articles",
    "delete_kb_articles",
    "manage_kb_categories",
  ],
  "System Settings": [
    "manage_api_keys",
    "billing_subscription",
    "system_backup",
    "view_audit_logs",
  ],
};

// Helper function to check if a role has any permission in a category
export const hasPermissionInCategory = (
  permissions: string[] | undefined,
  category: string
): boolean => {
  if (!permissions) return false;

  const categoryPermissions =
    PERMISSIONS[category as keyof typeof PERMISSIONS] || [];
  return permissions.some((p) => categoryPermissions.includes(p));
};
