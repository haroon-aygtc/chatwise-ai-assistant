
import { useState, useMemo } from 'react';
import { Permission } from '@/types/user';

export function usePermissionFilter(permissions: Permission[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPermissions = useMemo(() => {
    if (!searchQuery.trim()) {
      return permissions;
    }

    const query = searchQuery.toLowerCase();
    return permissions.filter(
      (permission) =>
        permission.name.toLowerCase().includes(query) ||
        permission.category.toLowerCase().includes(query) ||
        permission.description.toLowerCase().includes(query)
    );
  }, [permissions, searchQuery]);

  // Group filtered permissions by category
  const permissionsByCategory = useMemo(() => {
    return filteredPermissions.reduce<Record<string, Permission[]>>(
      (acc, permission) => {
        if (!acc[permission.category]) {
          acc[permission.category] = [];
        }
        acc[permission.category].push(permission);
        return acc;
      },
      {}
    );
  }, [filteredPermissions]);

  return {
    searchQuery,
    setSearchQuery,
    filteredPermissions,
    permissionsByCategory,
  };
}
