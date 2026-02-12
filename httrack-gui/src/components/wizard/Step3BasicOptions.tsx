import { UseFormRegister, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { ProjectFormData, MirrorDepth } from '../../types/project';
import { Label } from '../ui/Label';
import { Select } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { projectTemplates } from '../../lib/projectTemplates';
import { ArrowRight } from 'lucide-react';

interface Step3BasicOptionsProps {
  register: UseFormRegister<ProjectFormData>;
  watch: UseFormWatch<ProjectFormData>;
  setValue: UseFormSetValue<ProjectFormData>;
}

const depthOptions: { value: MirrorDepth; label: string; description: string }[] = [
  { value: 'page-only', label: 'Page Only', description: 'Download only the specified pages' },
  { value: 'shallow', label: 'Shallow (1 level)', description: 'Download linked pages (1 level deep)' },
  { value: 'medium', label: 'Medium (3 levels)', description: 'Download 3 levels deep' },
  { value: 'deep', label: 'Deep (5 levels)', description: 'Download 5 levels deep' },
  { value: 'unlimited', label: 'Unlimited', description: 'Download entire site (use with caution)' },
];

export function Step3BasicOptions({ register, watch, setValue }: Step3BasicOptionsProps) {
  const category = watch('category');
  const selectedTemplate = projectTemplates.find((t) => t.category === category);

  const applyTemplate = (templateId: string) => {
    const template = projectTemplates.find((t) => t.id === templateId);
    if (!template) return;

    if (template.basicOptions.mirrorDepth) {
      setValue('basicOptions.mirrorDepth', template.basicOptions.mirrorDepth);
    }
    if (template.basicOptions.followExternal !== undefined) {
      setValue('basicOptions.followExternal', template.basicOptions.followExternal);
    }
    if (template.basicOptions.getImages !== undefined) {
      setValue('basicOptions.getImages', template.basicOptions.getImages);
    }
    if (template.basicOptions.getVideos !== undefined) {
      setValue('basicOptions.getVideos', template.basicOptions.getVideos);
    }
    if (template.basicOptions.getAudio !== undefined) {
      setValue('basicOptions.getAudio', template.basicOptions.getAudio);
    }
    if (template.basicOptions.getDocuments !== undefined) {
      setValue('basicOptions.getDocuments', template.basicOptions.getDocuments);
    }
    if (template.basicOptions.respectRobotsTxt !== undefined) {
      setValue('basicOptions.respectRobotsTxt', template.basicOptions.respectRobotsTxt);
    }
  };

  return (
    <div className="space-y-6">
      {selectedTemplate && (
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-300 mb-1">
                  Recommended Template
                </h3>
                <p className="text-sm text-slate-300 mb-2">
                  {selectedTemplate.name} - {selectedTemplate.description}
                </p>
                <button
                  type="button"
                  onClick={() => applyTemplate(selectedTemplate.id)}
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                >
                  Apply template settings
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <Badge variant="primary">Suggested</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Download Depth</CardTitle>
          <CardDescription>
            How deep should HTTrack follow links from your starting URLs?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Label htmlFor="mirrorDepth" required>
              Mirror Depth
            </Label>
            <Select
              id="mirrorDepth"
              {...register('basicOptions.mirrorDepth', { required: true })}
            >
              {depthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label} - {option.description}
                </option>
              ))}
            </Select>
            <p className="text-xs text-slate-500">
              Higher depths will download more content but take longer
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Types</CardTitle>
          <CardDescription>
            Select which types of files to download
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              label="Images (PNG, JPG, GIF, SVG)"
              {...register('basicOptions.getImages')}
            />
            <Checkbox
              label="Videos (MP4, WEBM, AVI)"
              {...register('basicOptions.getVideos')}
            />
            <Checkbox
              label="Audio (MP3, WAV, OGG)"
              {...register('basicOptions.getAudio')}
            />
            <Checkbox
              label="Documents (PDF, DOC, ZIP)"
              {...register('basicOptions.getDocuments')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Download Limits</CardTitle>
          <CardDescription>
            Set limits to prevent excessive downloads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxFileSize">
                Max File Size (MB)
              </Label>
              <Input
                id="maxFileSize"
                type="number"
                min="1"
                placeholder="100"
                {...register('basicOptions.maxFileSize', {
                  valueAsNumber: true,
                  min: 1,
                })}
              />
              <p className="text-xs text-slate-500 mt-1">
                Skip files larger than this
              </p>
            </div>

            <div>
              <Label htmlFor="maxDownloadSize">
                Max Total Size (GB)
              </Label>
              <Input
                id="maxDownloadSize"
                type="number"
                min="1"
                placeholder="5"
                {...register('basicOptions.maxDownloadSize', {
                  valueAsNumber: true,
                  min: 1,
                })}
              />
              <p className="text-xs text-slate-500 mt-1">
                Stop when total reaches this
              </p>
            </div>

            <div>
              <Label htmlFor="connectionTimeout">
                Connection Timeout (seconds)
              </Label>
              <Input
                id="connectionTimeout"
                type="number"
                min="5"
                placeholder="30"
                {...register('basicOptions.connectionTimeout', {
                  valueAsNumber: true,
                  min: 5,
                })}
              />
            </div>

            <div>
              <Label htmlFor="retries">
                Retry Failed Downloads
              </Label>
              <Input
                id="retries"
                type="number"
                min="0"
                max="10"
                placeholder="3"
                {...register('basicOptions.retries', {
                  valueAsNumber: true,
                  min: 0,
                  max: 10,
                })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Behavior Options</CardTitle>
          <CardDescription>
            Configure how HTTrack behaves during download
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Checkbox
            label="Follow external links (download content from other domains)"
            {...register('basicOptions.followExternal')}
          />
          <Checkbox
            label="Respect robots.txt (recommended for ethical scraping)"
            {...register('basicOptions.respectRobotsTxt')}
          />
        </CardContent>
      </Card>
    </div>
  );
}
