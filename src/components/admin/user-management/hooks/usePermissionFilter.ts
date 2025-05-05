
import { useState, useEffect, useMemo } from 'react';
import { PermissionCategory, Permission } from '@/types';

export function usePermissionFilter(categories: PermissionCategory[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  const permissionsByCategory = useMemo(() => {
    const result: Record<string, Permission[]> = {};
    
    // Filter permissions based on search query
    const filterPermissions = (permissions: Permission[]) => {
      if (!searchQuery) return permissions;
      return permissions.filter(p => 
        p.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    };
    
    // Process each category
    categories.forEach(category => {
      const filteredPermissions = filterPermissions(category.permissions);
      if (filteredPermissions.length > 0) {
        result[category.name] = filteredPermissions;
      }
    });
    
    return result;
  }, [categories, searchQuery]);
  
  // Reset active category if it no longer exists after filtering
  useEffect(() => {
    if (activeCategory !== 'all' && !Object.keys(permissionsByCategory).includes(activeCategory)) {
      setActiveCategory('all');
    }
  }, [permissionsByCategory, activeCategory]);
  
  return {
    searchQuery,
    setSearchQuery,
    permissionsByCategory,
    activeCategory,
    setActiveCategory
  };
}
