import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface RedirectComponentProps {
    componentName: string;
}

/**
 * RedirectComponent - A utility component that redirects to the main AI Configuration page
 * when a specific component is requested but doesn't exist or isn't fully implemented yet.
 */
export const RedirectComponent = ({ componentName }: RedirectComponentProps) => {
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        // Show toast notification
        toast({
            title: `${componentName} Not Available`,
            description: `The ${componentName} component is being redirected to the main AI Configuration page where you can access all settings.`,
            duration: 5000,
        });

        // Redirect to the main AI Configuration page
        navigate('/admin/ai-configuration');
    }, [componentName, navigate, toast]);

    // Render a loading state while redirecting
    return (
        <div className="flex items-center justify-center h-[50vh]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Redirecting to AI Configuration...</p>
            </div>
        </div>
    );
};

export default RedirectComponent; 