import type { LogoFile } from '../types/logo';
import { HiTrash, HiArrowDownTray } from 'react-icons/hi2';

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
      case 'pending': return { bg: 'rgba(255, 149, 0, 0.1)', text: 'var(--warning)' };
      case 'processing': return { bg: 'rgba(0, 122, 255, 0.1)', text: 'var(--primary)' };
      case 'completed': return { bg: 'rgba(52, 199, 89, 0.1)', text: 'var(--success)' };
      case 'error': return { bg: 'rgba(255, 59, 48, 0.1)', text: 'var(--danger)' };
      default: return { bg: 'rgba(142, 142, 147, 0.1)', text: 'var(--gray)' };
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
    <div className="card-modern card-expand bg-white overflow-hidden" style={{ boxShadow: 'var(--shadow-sm)' }}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 truncate mr-4 tracking-tight">
            {logo.name}
          </h3>
          <div className="flex items-center gap-3">
            <span 
              className="px-3 py-2 rounded-full text-sm font-semibold"
              style={{ 
                backgroundColor: getStatusColor().bg,
                color: getStatusColor().text
              }}
            >
              {getStatusText()}
            </span>
            <button
              onClick={() => onRemove(logo.id)}
              className="p-2 text-gray-400 hover:text-blue-500 transition-all duration-200 transform hover:scale-110 flex items-center justify-center"
              style={{ minWidth: '2.5rem', minHeight: '2.5rem' }}
              title="Eliminar"
            >
              <HiTrash className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Imagen original */}
      <div className="p-6">
        <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-6">
          <img
            src={logo.originalUrl}
            alt={logo.name}
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Versiones procesadas */}
        {logo.status === 'completed' && logo.processedUrl && (
          <div className="content-slide-down space-y-6">
            <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Versiones generadas</h4>
            
            <div className="grid grid-cols-3 gap-4">
              {/* Versión transparente */}
              <div className="text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3 relative">
                  <div className="absolute inset-0 bg-checkered"></div>
                  <img
                    src={logo.processedUrl}
                    alt="Transparente"
                    className="w-full h-full object-contain relative z-10"
                  />
                </div>
                <p className="text-xs text-gray-600 mb-2 font-medium">Transparente</p>
                <button
                  onClick={() => onDownload(logo.id, 'transparent')}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-all duration-200 transform hover:scale-110 flex items-center justify-center mx-auto rounded-lg"
                  style={{ minWidth: '2.5rem', minHeight: '2.5rem' }}
                  title="Descargar versión transparente"
                >
                  <HiArrowDownTray className="w-5 h-5" />
                </button>
              </div>

              {/* Versión blanca */}
              <div className="text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
                  <img
                    src={logo.whiteVersionUrl}
                    alt="Blanco"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-gray-600 mb-2 font-medium">Blanco</p>
                <button
                  onClick={() => onDownload(logo.id, 'white')}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-all duration-200 transform hover:scale-110 flex items-center justify-center mx-auto rounded-lg"
                  style={{ minWidth: '2.5rem', minHeight: '2.5rem' }}
                  title="Descargar versión blanca"
                >
                  <HiArrowDownTray className="w-5 h-5" />
                </button>
              </div>

              {/* Versión negra */}
              <div className="text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-3">
                  <img
                    src={logo.blackVersionUrl}
                    alt="Negro"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs text-gray-600 mb-2 font-medium">Negro</p>
                <button
                  onClick={() => onDownload(logo.id, 'black')}
                  className="p-2 text-gray-400 hover:text-blue-500 transition-all duration-200 transform hover:scale-110 flex items-center justify-center mx-auto rounded-lg"
                  style={{ minWidth: '2.5rem', minHeight: '2.5rem' }}
                  title="Descargar versión negra"
                >
                  <HiArrowDownTray className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="p-6 border-t border-gray-100" style={{ backgroundColor: 'var(--gray-light)' }}>
        <div className="flex gap-3">
          {logo.status === 'pending' && (
            <button
              onClick={() => onProcess(logo.id)}
              className="btn-modern flex-1 px-4 py-3 text-white font-semibold"
              style={{ backgroundColor: 'var(--primary)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-dark)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
            >
              Procesar
            </button>
          )}
          
          {logo.status === 'processing' && (
            <div className="flex-1 px-4 py-3 bg-gray-300 text-gray-600 font-semibold rounded-xl text-center">
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
              className="btn-modern flex-1 px-4 py-3 text-white font-semibold"
              style={{ backgroundColor: 'var(--warning)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--warning)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--warning)'}
            >
              Reintentar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
