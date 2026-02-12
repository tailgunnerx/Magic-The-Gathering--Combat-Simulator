import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useThemeStore } from '../stores/theme';
import { useToastStore } from '../stores/toast';
import { Save } from 'lucide-react';

export function Settings() {
  const { theme, toggleTheme } = useThemeStore();
  const addToast = useToastStore((state) => state.addToast);

  const handleSave = () => {
    addToast({
      type: 'success',
      title: 'Settings saved',
      message: 'Your preferences have been updated successfully',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Configure your HTTrack preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how HTTrack looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Theme</label>
            <div className="flex gap-3">
              <Button
                variant={theme === 'dark' ? 'primary' : 'outline'}
                onClick={() => useThemeStore.getState().setTheme('dark')}
              >
                Dark
              </Button>
              <Button
                variant={theme === 'light' ? 'primary' : 'outline'}
                onClick={() => useThemeStore.getState().setTheme('light')}
              >
                Light
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default Download Settings</CardTitle>
          <CardDescription>Set default options for new projects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Default Save Path
            </label>
            <Input type="text" placeholder="/path/to/downloads" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Max Connection Speed (KB/s)
            </label>
            <Input type="number" placeholder="Unlimited" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Max Concurrent Connections
            </label>
            <Input type="number" defaultValue="4" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proxy Settings</CardTitle>
          <CardDescription>Configure proxy and Tor settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              SOCKS5 Proxy
            </label>
            <Input type="text" placeholder="127.0.0.1:9050 (Tor default)" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="enable-tor" className="w-4 h-4" />
            <label htmlFor="enable-tor" className="text-sm text-slate-300">
              Enable Tor for .onion sites
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleSave}>
          <Save className="w-5 h-5 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
