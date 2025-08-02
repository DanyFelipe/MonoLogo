import type { IFileValidator } from './interfaces';

export class FileValidator implements IFileValidator {
  private readonly supportedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB

  async validateFile(file: File): Promise<boolean> {
    return this.isValidFormat(file) && this.isValidSize(file);
  }

  getSupportedFormats(): string[] {
    return [...this.supportedFormats];
  }

  getMaxFileSize(): number {
    return this.maxFileSize;
  }

  private isValidFormat(file: File): boolean {
    return this.supportedFormats.includes(file.type);
  }

  private isValidSize(file: File): boolean {
    return file.size <= this.maxFileSize;
  }

  getErrorMessage(file: File): string {
    if (!this.isValidFormat(file)) {
      return `Formato no soportado. Use: ${this.supportedFormats.join(', ')}`;
    }
    if (!this.isValidSize(file)) {
      return `Archivo muy grande. Máximo ${this.maxFileSize / (1024 * 1024)}MB`;
    }
    return '';
  }
}
