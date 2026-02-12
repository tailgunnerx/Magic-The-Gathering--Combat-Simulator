export type LogLevel = 'debug' | 'info' | 'warning' | 'error';

export type DownloadStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed';

export interface LogEntry {
  id: string;
  timestamp: number;
  level: LogLevel;
  message: string;
  details?: string;
}

export interface DownloadStats {
  filesDownloaded: number;
  totalFiles: number;
  bytesDownloaded: number;
  totalBytes: number;
  bytesPerSecond: number;
  linksScanned: number;
  timeElapsed: number;
  timeRemaining: number;
  currentUrl: string;
  errorCount: number;
}

export interface DownloadProgress {
  projectId: string;
  projectName: string;
  status: DownloadStatus;
  stats: DownloadStats;
  startedAt: number;
  completedAt?: number;
  error?: string;
}

export interface DownloadQueue {
  active: DownloadProgress[];
  completed: DownloadProgress[];
}
