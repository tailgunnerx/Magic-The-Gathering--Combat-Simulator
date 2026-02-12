export type ProjectCategory = 'website' | 'documentation' | 'media' | 'archive' | 'ecommerce' | 'blog' | 'custom';

export type MirrorDepth = 'page-only' | 'shallow' | 'medium' | 'deep' | 'unlimited';

export interface ProjectBasicOptions {
  mirrorDepth: MirrorDepth;
  followExternal: boolean;
  getImages: boolean;
  getVideos: boolean;
  getAudio: boolean;
  getDocuments: boolean;
  respectRobotsTxt: boolean;
  maxFileSize: number;
  maxDownloadSize: number;
  connectionTimeout: number;
  retries: number;
}

export interface ProjectAdvancedOptions {
  userAgent: string;
  cookies: string;
  additionalHeaders: Record<string, string>;
  parseLinks: boolean;
  keepStructure: boolean;
  dosNames: boolean;
  iso9660Names: boolean;
  hidePasswords: boolean;
  hideQueryStrings: boolean;
  noPurge: boolean;
  testMode: boolean;
  logLevel: 'quiet' | 'normal' | 'verbose' | 'debug';
  updateExisting: boolean;
  continueInterrupted: boolean;
}

export interface ProjectFormData {
  name: string;
  category: ProjectCategory;
  description: string;
  urls: string[];
  outputPath: string;
  basicOptions: ProjectBasicOptions;
  advancedOptions: Partial<ProjectAdvancedOptions>;
}

export interface Project {
  id: string;
  name: string;
  category: ProjectCategory;
  description: string;
  urls: string[];
  outputPath: string;
  basicOptions: ProjectBasicOptions;
  advancedOptions: ProjectAdvancedOptions;
  createdAt: string;
  updatedAt: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  icon: string;
  basicOptions: Partial<ProjectBasicOptions>;
  advancedOptions: Partial<ProjectAdvancedOptions>;
}
