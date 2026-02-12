import { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-400" />
                <CardTitle>Something went wrong</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                An unexpected error occurred. Please try refreshing the page.
              </p>
              {this.state.error && (
                <pre className="bg-slate-900 p-4 rounded text-sm text-red-400 overflow-auto mb-4">
                  {this.state.error.message}
                </pre>
              )}
              <Button onClick={() => window.location.reload()}>Reload Page</Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
