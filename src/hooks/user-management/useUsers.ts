import { useState } from "react";
import { User } from "@/types/domain";
import { useQuery } from "@tanstack/react-query";
import ApiService from "@/services/api/base";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants";

// Response type from the backend API
interface UsersResponse {
  data: User[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}

// Parameters for filtering and pagination
interface UpdateQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  role?: string;
}

export function useUsers() {
  const [queryParams, setQueryParams] = useState<UpdateQueryParams>({
    page: DEFAULT_PAGE,
    per_page: DEFAULT_PAGE_SIZE,
  });

  // Function to fetch users from the API
  const fetchUsers = async (params: UpdateQueryParams) => {
    try {
      const response = await ApiService.get<UsersResponse>("/users", {
        params: {
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  // Use React Query to fetch and cache the data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () => fetchUsers(queryParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Update query parameters and trigger a refetch
  const updateQueryParams = (newParams: UpdateQueryParams) => {
    setQueryParams((prev) => ({ ...prev, ...newParams }));
  };

  return {
    users: data?.data || [],
    totalUsers: data?.total || 0,
    currentPage: data?.current_page || DEFAULT_PAGE,
    perPage: data?.per_page || DEFAULT_PAGE_SIZE,
    lastPage: data?.last_page || 1,
    isLoading,
    error,
    fetchUsers: refetch,
    updateQueryParams,
  };
}
