import type { LogoFile } from '../types/logo';

interface LogoCardProps {
  logo: LogoFile;
  onProcess: (id: string) => void;
  onRemove: (id: string) => void;
  onDownload: (id: string, version: 'transparent' | 'white' | 'black') => void;
}

export const LogoCard: React.FC<LogoCardProps> = ({ 
  logo, 
  onProcess, 
  onRemove, 
  onDownload 
}) => {
  const getStatusColor = () => {
    switch (logo.status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (logo.status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando...';
      case 'completed': return 'Completado';
      case 'error': return 'Error';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 truncate mr-4">
            {logo.name}
          </h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Imagen original */}
      <div className="p-4">
        <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
          <img
            src={logo.originalUrl}
            alt={logo.name}
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Versiones procesadas */}
        {logo.status === 'completed' && logo.processedUrl && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-700">Versiones generadas:</h4>
            
            <div className="grid grid-cols-3 gap-2">
              {/* Versión transparente */}
              <div className="text-center">
                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2 relative">
                  <div className="absolute inset-0 bg-checkered"></div>
                  <img
                    src={logo.processedUrl}
                    alt="Transparente"
                    className="w-full h-full object-contain relative z-10"
                  />
                </div>
                <p className="text-xs text-gray-600 mb-1">Transparente</p>
                <button
                  onClick={() => onDownload(logo.id, 'transparent')}
                  className="w-full px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors duration-200"
                >
                  Descargar
                </button>
              </div>

              {/* Versión blanca */}
              <div className="text-center">
                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2">
                  <img
                    src={logo.whiteVersionUrl}
                    alt="Blanco"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-gray-600 mb-1">Blanco</p>
                <button
                  onClick={() => onDownload(logo.id, 'white')}
                  className="w-full px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors duration-200"
                >
                  Descargar
                </button>
              </div>

              {/* Versión negra */}
              <div className="text-center">
                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2">
                  <img
                    src={logo.blackVersionUrl}
                    alt="Negro"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-gray-600 mb-1">Negro</p>
                <button
                  onClick={() => onDownload(logo.id, 'black')}
                  className="w-full px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors duration-200"
                >
                  Descargar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex gap-2">
          {logo.status === 'pending' && (
            <button
              onClick={() => onProcess(logo.id)}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Procesar
            </button>
          )}
          
          {logo.status === 'processing' && (
            <div className="flex-1 px-4 py-2 bg-gray-300 text-gray-600 font-medium rounded-lg text-center">
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </div>
            </div>
          )}
          
          {logo.status === 'error' && (
            <button
              onClick={() => onProcess(logo.id)}
              className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Reintentar
            </button>
          )}
          
          <button
            onClick={() => onRemove(logo.id)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
            title="Eliminar"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
