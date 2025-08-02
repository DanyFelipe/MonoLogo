export interface LogoFile {
  id: string;
  name: string;
  originalFile: File;
  originalUrl: string;
  processedUrl?: string;
  whiteVersionUrl?: string;
  blackVersionUrl?: string;
  status: ProcessingStatus;
  isRemoving?: boolean;
  createdAt: Date;
}

export const ProcessingStatus = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  ERROR: 'error'
} as const;

export type ProcessingStatus = typeof ProcessingStatus[keyof typeof ProcessingStatus];

export interface ProcessingResult {
  originalUrl: string;
  transparentUrl: string;
  whiteVersionUrl: string;
  blackVersionUrl: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}
