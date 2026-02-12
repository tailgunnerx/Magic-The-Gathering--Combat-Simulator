import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Download } from 'lucide-react';

export function Downloads() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Downloads</h1>
        <p className="text-slate-400 mt-1">Monitor active and completed downloads</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Downloads</CardTitle>
          <CardDescription>Currently downloading projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <Download className="w-16 h-16 text-slate-600 mb-4" />
            <p className="text-slate-400 text-center">No active downloads</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completed Downloads</CardTitle>
          <CardDescription>Recently finished downloads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <Download className="w-16 h-16 text-slate-600 mb-4" />
            <p className="text-slate-400 text-center">No completed downloads</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
