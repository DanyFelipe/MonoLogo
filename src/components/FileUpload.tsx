import { useCallback, useRef } from 'react';
import { FileValidator } from '../services/FileValidator';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, isProcessing }) => {
  const fileValidator = new FileValidator();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFiles: File[] = [];
    
    files.forEach(file => {
      fileValidator.validateFile(file).then(isValid => {
        if (isValid) validFiles.push(file);
      });
    });
    
    // Pequeña demora para permitir que todas las validaciones se completen
    setTimeout(() => onFilesSelected(validFiles), 100);
  }, [onFilesSelected, fileValidator]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles: File[] = [];
      
      files.forEach(file => {
        fileValidator.validateFile(file).then(isValid => {
          if (isValid) validFiles.push(file);
        });
      });
      
      // Pequeña demora para permitir que todas las validaciones se completen
      setTimeout(() => onFilesSelected(validFiles), 100);
    }
  }, [onFilesSelected, fileValidator]);

  const preventDefaults = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current && !isProcessing) {
      fileInputRef.current.click();
    }
  }, [isProcessing]);

  return (
    <div className="w-full">
      <div
        className={`
          upload-container relative border-2 border-dashed p-16 text-center transition-all duration-300 rounded-2xl
          ${isProcessing 
            ? 'cursor-not-allowed' 
            : 'cursor-pointer'
          }
        `}
        style={{ 
          backgroundColor: 'var(--color-bg)',
          borderColor: isProcessing ? 'var(--color-border)' : 'var(--color-text)',
          borderStyle: 'dashed',
          borderWidth: '2px'
        }}
        onDrop={handleDrop}
        onDragOver={preventDefaults}
        onDragEnter={preventDefaults}
        onDragLeave={preventDefaults}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={fileValidator.getSupportedFormats().join(',')}
          onChange={handleFileInput}
          disabled={isProcessing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="space-y-6">
          <div className="flex justify-center">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: isProcessing ? 'var(--color-border)' : 'rgba(255, 255, 255, 0.1)' }}
            >
              <svg 
                className="w-10 h-10"
                style={{ color: isProcessing ? 'var(--color-bg)' : 'var(--color-white)' }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
            </div>
          </div>
          
          <div>
            <h3 className="text-3xl font-semibold mb-3 tracking-tight" style={{ color: isProcessing ? 'var(--color-border)' : 'var(--color-white)' }}>
              {isProcessing ? 'Procesando...' : 'Arrastra tus logos aquí'}
            </h3>
            <p className="text-xl" style={{ color: 'var(--color-text)' }}>
              {isProcessing 
                ? 'Por favor espera mientras procesamos tus imágenes'
                : 'o haz clic para seleccionar archivos desde tu ordenador'
              }
            </p>
          </div>
          
          <div className="text-sm space-y-2" style={{ color: 'var(--color-text)' }}>
            <p>Formatos soportados: PNG, JPG, JPEG, WEBP</p>
            <p>Tamaño máximo: {fileValidator.getMaxFileSize() / (1024 * 1024)}MB por archivo</p>
          </div>
          
          {!isProcessing && (
            <button
              type="button"
              onClick={handleButtonClick}
              className="inline-flex items-center px-8 py-4 font-semibold text-lg rounded-xl transition-all duration-200 upload-button"
              style={{ 
                backgroundColor: 'var(--color-white)', 
                color: 'var(--color-bg)',
                border: 'none'
              }}
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Elegir archivos
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
