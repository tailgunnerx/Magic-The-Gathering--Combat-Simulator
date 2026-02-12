import { useState } from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { ProjectFormData } from '../../types/project';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Plus, X, Globe, AlertCircle, CheckCircle } from 'lucide-react';

interface Step2URLsProps {
  register: UseFormRegister<ProjectFormData>;
  setValue: UseFormSetValue<ProjectFormData>;
  watch: UseFormWatch<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
}

function isValidURL(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

function getURLSuggestions(url: string): string[] {
  const trimmed = url.trim();
  if (!trimmed) return [];
  
  const suggestions: string[] = [];
  
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    suggestions.push(`https://${trimmed}`);
    suggestions.push(`http://${trimmed}`);
  }
  
  if (trimmed.endsWith('/')) {
    suggestions.push(trimmed.slice(0, -1));
  } else {
    suggestions.push(`${trimmed}/`);
  }
  
  return suggestions.filter((s) => isValidURL(s)).slice(0, 3);
}

export function Step2URLs({ setValue, watch }: Step2URLsProps) {
  const urls = watch('urls') || [];
  const [currentURL, setCurrentURL] = useState('');
  const [urlError, setUrlError] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleURLChange = (value: string) => {
    setCurrentURL(value);
    setUrlError('');
    
    if (value.trim()) {
      const urlSuggestions = getURLSuggestions(value);
      setSuggestions(urlSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const addURL = (url: string) => {
    const trimmed = url.trim();
    
    if (!trimmed) {
      setUrlError('Please enter a URL');
      return;
    }
    
    if (!isValidURL(trimmed)) {
      setUrlError('Please enter a valid URL (must start with http:// or https://)');
      return;
    }
    
    if (urls.includes(trimmed)) {
      setUrlError('This URL has already been added');
      return;
    }
    
    setValue('urls', [...urls, trimmed]);
    setCurrentURL('');
    setSuggestions([]);
    setUrlError('');
  };

  const removeURL = (index: number) => {
    setValue(
      'urls',
      urls.filter((_, i) => i !== index)
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addURL(currentURL);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Website URLs</CardTitle>
        <CardDescription>
          Add one or more URLs to download. You can add multiple starting points for your archive.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="url-input" required>
            Enter URL
          </Label>
          <div className="flex gap-2">
            <Input
              id="url-input"
              type="text"
              placeholder="https://example.com"
              value={currentURL}
              onChange={(e) => handleURLChange(e.target.value)}
              onKeyPress={handleKeyPress}
              error={!!urlError}
            />
            <Button
              type="button"
              onClick={() => addURL(currentURL)}
              disabled={!currentURL.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {urlError && (
            <div className="flex items-center gap-2 text-red-400 text-xs mt-1">
              <AlertCircle className="w-3 h-3" />
              {urlError}
            </div>
          )}
          {!urlError && currentURL && isValidURL(currentURL) && (
            <div className="flex items-center gap-2 text-green-400 text-xs mt-1">
              <CheckCircle className="w-3 h-3" />
              Valid URL
            </div>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-slate-400">Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setCurrentURL(suggestion);
                    setSuggestions([]);
                  }}
                  className="text-xs px-3 py-1 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-md transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {urls.length > 0 && (
          <div className="space-y-2">
            <Label>Added URLs ({urls.length})</Label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {urls.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-slate-200 truncate">{url}</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeURL(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {urls.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No URLs added yet</p>
            <p className="text-xs mt-1">Enter a URL above to get started</p>
          </div>
        )}

        {urls.length > 0 && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-300">
              <strong>Tip:</strong> You can add multiple URLs to download different websites in a single project.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
