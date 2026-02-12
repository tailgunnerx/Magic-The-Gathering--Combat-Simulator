import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FolderOpen, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Projects() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 mt-1">Manage your website archiving projects</p>
        </div>
        <Button size="lg" onClick={() => navigate('/projects/new')}>
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>View and manage all your projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="w-16 h-16 text-slate-600 mb-4" />
            <p className="text-slate-400 text-center mb-4">No projects found</p>
            <Button onClick={() => navigate('/projects/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
