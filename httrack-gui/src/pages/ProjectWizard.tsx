import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ProjectFormData } from '../types/project';
import { projectsAPI } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Step1ProjectInfo } from '../components/wizard/Step1ProjectInfo';
import { Step2URLs } from '../components/wizard/Step2URLs';
import { Step3BasicOptions } from '../components/wizard/Step3BasicOptions';
import { Step4AdvancedOptions } from '../components/wizard/Step4AdvancedOptions';
import { ArrowLeft, ArrowRight, Check, Loader2, Rocket } from 'lucide-react';
import { cn } from '../lib/utils';
import { useToastStore } from '../stores/toast';

const steps = [
  { id: 1, name: 'Project Info', description: 'Basic project details' },
  { id: 2, name: 'URLs', description: 'Add websites to download' },
  { id: 3, name: 'Basic Options', description: 'Configure download settings' },
  { id: 4, name: 'Advanced', description: 'Fine-tune configuration' },
];

const defaultValues: Partial<ProjectFormData> = {
  name: '',
  category: 'website',
  description: '',
  urls: [],
  outputPath: '',
  basicOptions: {
    mirrorDepth: 'medium',
    followExternal: false,
    getImages: true,
    getVideos: true,
    getAudio: true,
    getDocuments: true,
    respectRobotsTxt: true,
    maxFileSize: 100,
    maxDownloadSize: 5,
    connectionTimeout: 30,
    retries: 3,
  },
  advancedOptions: {
    logLevel: 'normal',
    parseLinks: true,
    keepStructure: true,
  },
};

export function ProjectWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<ProjectFormData>({
    defaultValues,
    mode: 'onChange',
  });

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof ProjectFormData)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ['name', 'category', 'outputPath'];
        break;
      case 2:
        if (watch('urls')?.length === 0) {
          addToast('Please add at least one URL', 'error');
          return false;
        }
        return true;
      case 3:
        fieldsToValidate = ['basicOptions'];
        break;
      case 4:
        return true;
      default:
        return true;
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);
    try {
      await projectsAPI.create(data);
      
      addToast(`Project "${data.name}" created successfully!`, 'success');
      
      setTimeout(() => {
        navigate('/projects');
      }, 1500);
    } catch (error) {
      console.error('Error creating project:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
      addToast(errorMessage, 'error');
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Create New Project</h1>
          <p className="text-slate-400 mt-1">
            Follow the wizard to configure your website archiving project
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/projects')}>
          Cancel
        </Button>
      </div>

      <Card className="bg-slate-900/50 backdrop-blur border-slate-700">
        <CardContent className="pt-6">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between">
              {steps.map((step, index) => (
                <li
                  key={step.id}
                  className={cn(
                    'relative flex-1',
                    index !== steps.length - 1 && 'pr-8'
                  )}
                >
                  {index !== steps.length - 1 && (
                    <div
                      className={cn(
                        'absolute top-4 right-0 h-0.5 w-full',
                        step.id < currentStep
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                          : 'bg-slate-700'
                      )}
                    />
                  )}

                  <div className="relative flex flex-col items-center group">
                    <div
                      className={cn(
                        'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all',
                        step.id < currentStep
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-transparent'
                          : step.id === currentStep
                          ? 'border-purple-500 bg-slate-800'
                          : 'border-slate-600 bg-slate-900'
                      )}
                    >
                      {step.id < currentStep ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <span
                          className={cn(
                            'text-sm font-semibold',
                            step.id === currentStep ? 'text-purple-400' : 'text-slate-500'
                          )}
                        >
                          {step.id}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p
                        className={cn(
                          'text-sm font-medium',
                          step.id === currentStep ? 'text-white' : 'text-slate-400'
                        )}
                      >
                        {step.name}
                      </p>
                      <p className="text-xs text-slate-500 hidden md:block">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </CardContent>
      </Card>

      <form onSubmit={(e) => e.preventDefault()}>
        {currentStep === 1 && (
          <Step1ProjectInfo register={register} errors={errors} />
        )}
        {currentStep === 2 && (
          <Step2URLs
            register={register}
            setValue={setValue}
            watch={watch}
            errors={errors}
          />
        )}
        {currentStep === 3 && (
          <Step3BasicOptions
            register={register}
            watch={watch}
            setValue={setValue}
          />
        )}
        {currentStep === 4 && (
          <Step4AdvancedOptions register={register} />
        )}

        <div className="flex items-center justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-3">
            {currentStep < steps.length ? (
              <Button type="button" onClick={handleNext} disabled={isSubmitting}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleFormSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
