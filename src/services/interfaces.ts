import type { ProcessingResult } from '../types/logo';

// Interface para el servicio de procesamiento de imágenes (Dependency Inversion Principle)
export interface IImageProcessor {
  removeBackground(file: File): Promise<Blob>;
  createWhiteVersion(imageBlob: Blob): Promise<Blob>;
  createBlackVersion(imageBlob: Blob): Promise<Blob>;
  smoothEdges(imageBlob: Blob): Promise<Blob>;
}

// Interface para el servicio de gestión de archivos
export interface IFileManager {
  uploadFile(file: File): Promise<string>;
  downloadFile(url: string, filename: string): Promise<void>;
  createObjectUrl(blob: Blob): string;
  revokeObjectUrl(url: string): void;
}

// Interface para el servicio de procesamiento completo
export interface ILogoProcessor {
  processLogo(file: File): Promise<ProcessingResult>;
  processMultipleLogos(files: File[]): Promise<ProcessingResult[]>;
}

// Interface para validación de archivos
export interface IFileValidator {
  validateFile(file: File): Promise<boolean>;
  getSupportedFormats(): string[];
  getMaxFileSize(): number;
}
