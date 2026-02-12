import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProjectFormData, ProjectCategory } from '../../types/project';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

interface Step1ProjectInfoProps {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
}

const categories: { value: ProjectCategory; label: string; description: string }[] = [
  { value: 'website', label: 'Website', description: 'General website archiving' },
  { value: 'documentation', label: 'Documentation', description: 'Technical documentation sites' },
  { value: 'media', label: 'Media Gallery', description: 'Image, video, and media collections' },
  { value: 'archive', label: 'Archive', description: 'Long-term web preservation' },
  { value: 'ecommerce', label: 'E-commerce', description: 'Product catalogs and stores' },
  { value: 'blog', label: 'Blog', description: 'Blog posts and articles' },
  { value: 'custom', label: 'Custom', description: 'Custom configuration' },
];

export function Step1ProjectInfo({ register, errors }: Step1ProjectInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Information</CardTitle>
        <CardDescription>
          Give your project a name and select a category to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name" required>
            Project Name
          </Label>
          <Input
            id="name"
            placeholder="My Website Archive"
            error={!!errors.name}
            {...register('name', {
              required: 'Project name is required',
              minLength: {
                value: 3,
                message: 'Project name must be at least 3 characters',
              },
              maxLength: {
                value: 50,
                message: 'Project name must be less than 50 characters',
              },
            })}
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category" required>
            Category
          </Label>
          <Select
            id="category"
            error={!!errors.category}
            {...register('category', { required: 'Please select a category' })}
          >
            <option value="">Select a category...</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label} - {cat.description}
              </option>
            ))}
          </Select>
          {errors.category && (
            <p className="text-red-400 text-xs mt-1">{errors.category.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">
            Description (Optional)
          </Label>
          <Textarea
            id="description"
            placeholder="Describe what this project is for..."
            rows={3}
            {...register('description')}
          />
          <p className="text-slate-500 text-xs mt-1">
            Add notes or details about this archiving project
          </p>
        </div>

        <div>
          <Label htmlFor="outputPath" required>
            Output Directory
          </Label>
          <Input
            id="outputPath"
            placeholder="C:\httrack\projects\my-archive"
            error={!!errors.outputPath}
            {...register('outputPath', {
              required: 'Output directory is required',
            })}
          />
          {errors.outputPath && (
            <p className="text-red-400 text-xs mt-1">{errors.outputPath.message}</p>
          )}
          <p className="text-slate-500 text-xs mt-1">
            Where the downloaded files will be saved
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
