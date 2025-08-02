import type { ILogoProcessor, IImageProcessor, IFileManager, IFileValidator } from './interfaces';
import type { ProcessingResult } from '../types/logo';

export class LogoProcessor implements ILogoProcessor {
  private imageProcessor: IImageProcessor;
  private fileManager: IFileManager;
  private fileValidator: IFileValidator;

  constructor(
    imageProcessor: IImageProcessor,
    fileManager: IFileManager,
    fileValidator: IFileValidator
  ) {
    this.imageProcessor = imageProcessor;
    this.fileManager = fileManager;
    this.fileValidator = fileValidator;
  }

  async processLogo(file: File): Promise<ProcessingResult> {
    // Validar archivo
    const isValid = await this.fileValidator.validateFile(file);
    if (!isValid) {
      throw new Error('Archivo no válido');
    }

    try {
      // 1. Remover fondo blanco
      const transparentBlob = await this.imageProcessor.removeBackground(file);
      
      // 2. Suavizar bordes
      const smoothedBlob = await this.imageProcessor.smoothEdges(transparentBlob);
      
      // 3. Crear versión blanca
      const whiteBlob = await this.imageProcessor.createWhiteVersion(smoothedBlob);
      
      // 4. Crear versión negra
      const blackBlob = await this.imageProcessor.createBlackVersion(smoothedBlob);
      
      // 5. Crear URLs para mostrar las imágenes
      const originalUrl = this.fileManager.createObjectUrl(file);
      const transparentUrl = this.fileManager.createObjectUrl(smoothedBlob);
      const whiteVersionUrl = this.fileManager.createObjectUrl(whiteBlob);
      const blackVersionUrl = this.fileManager.createObjectUrl(blackBlob);

      return {
        originalUrl,
        transparentUrl,
        whiteVersionUrl,
        blackVersionUrl
      };
    } catch (error) {
      console.error('Error processing logo:', error);
      throw new Error('Error al procesar el logo');
    }
  }

  async processMultipleLogos(files: File[]): Promise<ProcessingResult[]> {
    const results: ProcessingResult[] = [];
    
    for (const file of files) {
      try {
        const result = await this.processLogo(file);
        results.push(result);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        // Continuar con el siguiente archivo
      }
    }
    
    return results;
  }
}
