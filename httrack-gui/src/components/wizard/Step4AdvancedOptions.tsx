import { UseFormRegister } from 'react-hook-form';
import { ProjectFormData } from '../../types/project';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import { Textarea } from '../ui/Textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Accordion, AccordionItem } from '../ui/Accordion';
import { AlertCircle } from 'lucide-react';

interface Step4AdvancedOptionsProps {
  register: UseFormRegister<ProjectFormData>;
}

export function Step4AdvancedOptions({ register }: Step4AdvancedOptionsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Configuration</CardTitle>
          <CardDescription>
            Fine-tune your download settings. These are optional - default values work for most cases.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-300 font-medium">Optional Settings</p>
              <p className="text-xs text-yellow-200/80 mt-1">
                You can skip this step if you're not sure. The basic options are sufficient for most websites.
              </p>
            </div>
          </div>

          <Accordion>
            <AccordionItem title="Browser Identity">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="userAgent">User Agent</Label>
                  <Input
                    id="userAgent"
                    placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
                    {...register('advancedOptions.userAgent')}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    How HTTrack identifies itself to websites
                  </p>
                </div>

                <div>
                  <Label htmlFor="cookies">Cookies</Label>
                  <Textarea
                    id="cookies"
                    placeholder="sessionid=abc123; preferences=dark"
                    rows={2}
                    {...register('advancedOptions.cookies')}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Cookie values for authenticated sessions
                  </p>
                </div>
              </div>
            </AccordionItem>

            <AccordionItem title="Link Processing">
              <div className="space-y-4">
                <Checkbox
                  label="Parse and follow links in JavaScript and CSS"
                  {...register('advancedOptions.parseLinks')}
                />
                <Checkbox
                  label="Keep original site structure"
                  {...register('advancedOptions.keepStructure')}
                />
                <Checkbox
                  label="Use DOS 8.3 file names (legacy compatibility)"
                  {...register('advancedOptions.dosNames')}
                />
                <Checkbox
                  label="Use ISO9660 file names (CD-ROM compatibility)"
                  {...register('advancedOptions.iso9660Names')}
                />
              </div>
            </AccordionItem>

            <AccordionItem title="URL Handling">
              <div className="space-y-4">
                <Checkbox
                  label="Hide passwords in URLs"
                  {...register('advancedOptions.hidePasswords')}
                />
                <Checkbox
                  label="Hide query strings in URLs"
                  {...register('advancedOptions.hideQueryStrings')}
                />
              </div>
            </AccordionItem>

            <AccordionItem title="Update & Resume">
              <div className="space-y-4">
                <Checkbox
                  label="Update existing files"
                  {...register('advancedOptions.updateExisting')}
                />
                <Checkbox
                  label="Continue interrupted downloads"
                  {...register('advancedOptions.continueInterrupted')}
                />
                <Checkbox
                  label="Don't purge old files (no purge mode)"
                  {...register('advancedOptions.noPurge')}
                />
              </div>
            </AccordionItem>

            <AccordionItem title="Logging & Debugging">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="logLevel">Log Level</Label>
                  <Select
                    id="logLevel"
                    {...register('advancedOptions.logLevel')}
                  >
                    <option value="quiet">Quiet - Minimal output</option>
                    <option value="normal">Normal - Standard logging</option>
                    <option value="verbose">Verbose - Detailed information</option>
                    <option value="debug">Debug - Full debugging output</option>
                  </Select>
                  <p className="text-xs text-slate-500 mt-1">
                    Controls how much information is logged
                  </p>
                </div>

                <Checkbox
                  label="Test mode (don't actually download, just simulate)"
                  {...register('advancedOptions.testMode')}
                />
              </div>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-300 mb-2">Pro Tip</h3>
        <p className="text-xs text-blue-200">
          For most websites, you don't need to change these advanced settings. The recommended 
          template and basic options are optimized for common use cases. Only modify these if 
          you have specific requirements or are experiencing issues with the default settings.
        </p>
      </div>
    </div>
  );
}
