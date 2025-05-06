
import { useAuth } from "@/hooks/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">CS</div>
            <h1 className="font-bold text-xl">ChatSystem</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleLogout}>
              Sign out
            </Button>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 container py-12">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.name || 'User'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h3 className="font-medium text-lg mb-2">Manage Users</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Add, edit, and remove users from your organization.
              </p>
              <Link to="/admin/users">
                <Button variant="outline" className="w-full">
                  User Management
                </Button>
              </Link>
            </div>
            
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h3 className="font-medium text-lg mb-2">Roles & Permissions</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Manage roles and assign permissions to users.
              </p>
              <Link to="/admin/users">
                <Button variant="outline" className="w-full">
                  Manage Roles
                </Button>
              </Link>
            </div>
            
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <h3 className="font-medium text-lg mb-2">Activity Logs</h3>
              <p className="text-muted-foreground text-sm mb-4">
                View system activity and audit logs.
              </p>
              <Link to="/admin/users">
                <Button variant="outline" className="w-full">
                  View Logs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ChatSystem. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
