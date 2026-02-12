import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, FolderOpen, Download, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Projects', value: '0', icon: FolderOpen, color: 'text-blue-400' },
    { label: 'Active Downloads', value: '0', icon: Download, color: 'text-green-400' },
    { label: 'Completed', value: '0', icon: Clock, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage your website archiving projects</p>
        </div>
        <Button size="lg" onClick={() => navigate('/projects/new')}>
          <Plus className="w-5 h-5 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                </div>
                <stat.icon className={`w-12 h-12 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>Your recently accessed projects will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="w-16 h-16 text-slate-600 mb-4" />
            <p className="text-slate-400 text-center mb-4">No projects yet</p>
            <Button onClick={() => navigate('/projects/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
