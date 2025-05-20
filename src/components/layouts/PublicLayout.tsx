import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth/useAuth";
import { ModeToggle } from "@/components/ModeToggle";

interface PublicLayoutProps {
    children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b py-4">
                <div className="container flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">CS</div>
                        <h1 className="font-bold text-xl">ChatSystem</h1>
                    </div>
                    <nav className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <Link to="/dashboard">
                                <Button variant="ghost">Dashboard</Button>
                            </Link>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost">Sign in</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button variant="default">Sign up</Button>
                                </Link>
                            </>
                        )}
                        <ModeToggle />
                    </nav>
                </div>
            </header>

            <main className="flex-1 container py-12">
                {children}
            </main>

            <footer className="border-t py-6">
                <div className="container text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} ChatSystem. All rights reserved.
                </div>
            </footer>
        </div>
    );
} 