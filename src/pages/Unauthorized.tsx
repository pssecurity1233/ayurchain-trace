import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="max-w-md w-full shadow-large">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access this page. Please contact your administrator 
              if you believe this is an error.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={() => navigate(-1)} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Return Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;