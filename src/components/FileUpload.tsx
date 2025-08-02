import { useCallback } from 'react';
import { FileValidator } from '../services/FileValidator';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, isProcessing }) => {
  const fileValidator = new FileValidator();

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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
          ${isProcessing 
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
            : 'border-blue-300 bg-blue-50 hover:border-blue-400 hover:bg-blue-100 cursor-pointer'
          }
        `}
        onDrop={handleDrop}
        onDragOver={preventDefaults}
        onDragEnter={preventDefaults}
        onDragLeave={preventDefaults}
      >
        <input
          type="file"
          multiple
          accept={fileValidator.getSupportedFormats().join(',')}
          onChange={handleFileInput}
          disabled={isProcessing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg 
              className={`w-16 h-16 ${isProcessing ? 'text-gray-400' : 'text-blue-500'}`}
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
          
          <div>
            <h3 className={`text-2xl font-semibold mb-2 ${isProcessing ? 'text-gray-500' : 'text-gray-900'}`}>
              {isProcessing ? 'Procesando...' : 'Sube tus logos'}
            </h3>
            <p className={`text-lg ${isProcessing ? 'text-gray-400' : 'text-gray-600'}`}>
              {isProcessing 
                ? 'Por favor espera mientras procesamos tus imágenes'
                : 'Arrastra y suelta tus archivos aquí o haz clic para seleccionar'
              }
            </p>
          </div>
          
          <div className="text-sm text-gray-500 space-y-1">
            <p>Formatos soportados: PNG, JPG, JPEG, WEBP</p>
            <p>Tamaño máximo: {fileValidator.getMaxFileSize() / (1024 * 1024)}MB por archivo</p>
          </div>
          
          {!isProcessing && (
            <button
              type="button"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Seleccionar archivos
            </button>
          )}
        </div>
      </div>
      
      {/* Información adicional */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">¿Qué hace esta aplicación?</h4>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span>Remueve automáticamente el fondo blanco de tus logos</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span>Suaviza los bordes para evitar el efecto de dientes de sierra</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span>Genera automáticamente versiones en blanco y negro</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <span>Exporta en formato PNG con transparencia</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
