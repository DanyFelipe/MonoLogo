import type { LogoFile } from '../types/logo';
import { HiTrash, HiArrowDownTray, HiArrowPath } from 'react-icons/hi2';

interface LogoCardProps {
  logo: LogoFile;
  onProcess: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string, version: 'transparent' | 'white' | 'black') => void;
}

export const LogoCard: React.FC<LogoCardProps> = ({ 
  logo, 
  onProcess, 
  onDelete, 
  onDownload 
}) => {
  const getStatusColor = () => {
    switch (logo.status) {
      case 'pending': return { bg: 'rgba(251, 191, 36, 0.15)', text: 'var(--color-pending)' };
      case 'processing': return { bg: 'rgba(59, 130, 246, 0.15)', text: 'var(--color-processing)' };
      case 'completed': return { bg: 'rgba(16, 185, 129, 0.15)', text: 'var(--color-completed)' };
      case 'error': return { bg: 'rgba(239, 68, 68, 0.15)', text: 'var(--color-error)' };
      default: return { bg: 'var(--color-border)', text: 'var(--color-text)' };
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
    <div className="card-modern card-expand overflow-hidden" style={{ boxShadow: 'var(--shadow-sm)' }}>
      {/* Header */}
      <div className="p-6" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold truncate mr-4 tracking-tight" style={{ color: 'var(--color-white)' }}>
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
              onClick={() => onDelete(logo.id)}
              className="p-2 transition-all duration-200 transform hover:scale-110 flex items-center justify-center"
              style={{ minWidth: '2.5rem', minHeight: '2.5rem', color: 'var(--color-white)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-white)'}
              title="Eliminar"
            >
              <HiTrash className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Imagen original */}
      <div className="p-6">
        <div className="aspect-square rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
          <img
            src={logo.originalUrl}
            alt={logo.name}
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Versiones procesadas */}
        {logo.status === 'completed' && logo.processedUrl && (
          <div className="content-slide-down space-y-6">
            <h4 className="text-sm font-semibold tracking-wide" style={{ color: 'var(--color-white)' }}>Versiones generadas</h4>
            
            <div className="grid grid-cols-3 gap-4">
              {/* Versión transparente */}
              <div className="text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="aspect-square rounded-xl overflow-hidden mb-3 relative" style={{ backgroundColor: 'var(--color-border)' }}>
                  <div className="absolute inset-0 bg-checkered"></div>
                  <img
                    src={logo.processedUrl}
                    alt="Transparente"
                    className="w-full h-full object-contain relative z-10"
                  />
                </div>
                <p className="text-xs mb-2 font-medium" style={{ color: 'var(--color-white)' }}>Transparente</p>
                <button
                  onClick={() => onDownload(logo.id, 'transparent')}
                  className="p-2 transition-all duration-200 transform hover:scale-110 flex items-center justify-center mx-auto rounded-lg"
                  style={{ minWidth: '2.5rem', minHeight: '2.5rem', color: 'var(--color-white)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-white)'}
                  title="Descargar versión transparente"
                >
                  <HiArrowDownTray className="w-5 h-5" />
                </button>
              </div>

              {/* Versión blanca */}
              <div className="text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="aspect-square rounded-xl overflow-hidden mb-3" style={{ backgroundColor: 'var(--color-border)' }}>
                  <img
                    src={logo.whiteVersionUrl}
                    alt="Blanco"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs mb-2 font-medium" style={{ color: 'var(--color-white)' }}>Blanco</p>
                <button
                  onClick={() => onDownload(logo.id, 'white')}
                  className="p-2 transition-all duration-200 transform hover:scale-110 flex items-center justify-center mx-auto rounded-lg"
                  style={{ minWidth: '2.5rem', minHeight: '2.5rem', color: 'var(--color-white)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-white)'}
                  title="Descargar versión blanca"
                >
                  <HiArrowDownTray className="w-5 h-5" />
                </button>
              </div>

              {/* Versión negra */}
              <div className="text-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="aspect-square rounded-xl overflow-hidden mb-3" style={{ backgroundColor: 'var(--color-border)' }}>
                  <img
                    src={logo.blackVersionUrl}
                    alt="Negro"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs mb-2 font-medium" style={{ color: 'var(--color-white)' }}>Negro</p>
                <button
                  onClick={() => onDownload(logo.id, 'black')}
                  className="p-2 transition-all duration-200 transform hover:scale-110 flex items-center justify-center mx-auto rounded-lg"
                  style={{ minWidth: '2.5rem', minHeight: '2.5rem', color: 'var(--color-white)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-white)'}
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
      <div className="p-6 pt-0">
        <div className="flex gap-3">
          {logo.status === 'pending' && (
            <button
              onClick={() => onProcess(logo.id)}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{ 
                backgroundColor: 'var(--color-bg)',
                color: 'var(--color-white)',
                border: '1px solid var(--color-border)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-border)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-bg)';
              }}
            >
              Procesar
            </button>
          )}
          
          {logo.status === 'processing' && (
            <div className="flex-1 px-6 py-3 rounded-xl text-center font-semibold text-sm" style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-bg)' }}>
              <div className="flex items-center justify-center">
                <HiArrowPath className="w-5 h-5 animate-spin mr-2" />
                Procesando...
              </div>
            </div>
          )}
          
          {logo.status === 'error' && (
            <button
              onClick={() => onProcess(logo.id)}
              className="flex-1 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{ 
                backgroundColor: 'var(--color-border)',
                color: 'var(--color-bg)',
                border: '1px solid var(--color-border)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-text)';
                e.currentTarget.style.color = 'var(--color-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-border)';
                e.currentTarget.style.color = 'var(--color-bg)';
              }}
            >
              Reintentar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
