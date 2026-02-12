import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Info, Github, Globe, Heart } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function About() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white">About HTTrack v2</h1>
        <p className="text-slate-400 mt-1">Modern website archiving tool</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Info className="w-8 h-8 text-blue-400" />
            <CardTitle>About This Software</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-300">
            HTTrack v2 is a modern reimagining of the classic HTTrack website copier, featuring a
            beautiful new interface, enhanced capabilities, and support for modern web technologies.
          </p>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <p className="text-sm text-slate-400">Version</p>
              <p className="text-white font-semibold">2.0.0</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Release Date</p>
              <p className="text-white font-semibold">2026</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">License</p>
              <p className="text-white font-semibold">GPL-3.0</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Built with</p>
              <p className="text-white font-semibold">React + Vite</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              Modern, beautiful user interface with dark/light theme
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              Real-time download progress monitoring
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              Tor and .onion support for deep web archiving
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              JavaScript rendering for modern web apps (coming soon)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              WARC format export support (coming soon)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">•</span>
              Advanced filtering and scheduling options
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Links</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button variant="outline">
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </Button>
          <Button variant="outline">
            <Globe className="w-4 h-4 mr-2" />
            Website
          </Button>
          <Button variant="outline">
            <Heart className="w-4 h-4 mr-2" />
            Donate
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
