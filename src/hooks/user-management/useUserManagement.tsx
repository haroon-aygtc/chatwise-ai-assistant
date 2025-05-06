
import { useState } from "react";
import { User, EditedUser, NewUser } from "@/types/domain";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/services/user";
import { useToast } from "@/components/ui/use-toast";

export function useUserManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (userData: NewUser) => UserService.createUser(userData),
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: response.message || "User created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create user",
        variant: "destructive",
      });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Partial<EditedUser> }) =>
      UserService.updateUser(id, userData),
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: response.message || "User updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => UserService.deleteUser(id),
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: response.message || "User deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  // Update user status mutation
  const updateUserStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "inactive" | "pending" | "suspended" }) =>
      UserService.updateUserStatus(id, status),
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: response.message || "User status updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update user status",
        variant: "destructive",
      });
    },
  });

  // Assign roles mutation
  const assignRolesMutation = useMutation({
    mutationFn: ({ id, roles }: { id: string; roles: string[] }) =>
      UserService.assignRoles(id, roles),
    onSuccess: (response) => {
      toast({
        title: "Success",
        description: response.message || "User roles updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to assign roles",
        variant: "destructive",
      });
    },
  });

  return {
    isLoading,
    createUser: (userData: NewUser) => createUserMutation.mutate(userData),
    updateUser: (id: string, userData: Partial<EditedUser>) => 
      updateUserMutation.mutate({ id, userData }),
    deleteUser: (id: string) => deleteUserMutation.mutate(id),
    updateUserStatus: (id: string, status: "active" | "inactive" | "pending" | "suspended") => 
      updateUserStatusMutation.mutate({ id, status }),
    assignRoles: (id: string, roles: string[]) => 
      assignRolesMutation.mutate({ id, roles }),
    mutations: {
      createUserMutation,
      updateUserMutation,
      deleteUserMutation,
      updateUserStatusMutation,
      assignRolesMutation,
    }
  };
}
