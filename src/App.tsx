import { FileUpload } from './components/FileUpload';
import { LogoCard } from './components/LogoCard';
import { useLogoProcessor } from './hooks/useLogoProcessor';
import { HiArrowPath } from 'react-icons/hi2';

function App() {
  const {
    logos,
    isProcessing,
    addLogo,
    processLogo,
    removeLogo,
    clearAllLogos,
    downloadLogo
  } = useLogoProcessor();

  const handleFilesSelected = (files: File[]) => {
    files.forEach(file => addLogo(file));
  };

  const completedLogos = logos.filter(logo => logo.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Botón de reinicio fijo en esquina superior derecha */}
      <div className={`fixed top-6 right-6 z-50 transition-all duration-500 ${logos.length > 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <button
          onClick={clearAllLogos}
          className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-gray-600 hover:text-red-500 border border-gray-200"
          title="Limpiar todo"
        >
          <HiArrowPath className="w-6 h-6" />
        </button>
      </div>
      
      {/* Header */}
      <header className="pt-16 pb-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="mb-12">
            <h1 className="text-6xl font-bold text-gray-900 mb-6 tracking-tight">MonoLogo</h1>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Remueve automáticamente fondos blancos, suaviza bordes para un acabado profesional, 
              genera versiones en blanco y negro, y exporta en PNG con transparencia perfecta.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-16">
        {/* Upload Section */}
        <div className="mb-8">
          <FileUpload 
            onFilesSelected={handleFilesSelected} 
            isProcessing={isProcessing}
          />
        </div>

        {/* Statistics */}
        <div className={`transition-all duration-700 ease-out ${logos.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          {logos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="card-modern bg-white p-8 text-center animate-fade-in-up" style={{ boxShadow: 'var(--shadow-sm)', animationDelay: '0.1s' }}>
                <div className="text-4xl text-gray-900 mb-2">{logos.length}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Total</div>
              </div>
              <div className="card-modern bg-white p-8 text-center animate-fade-in-up" style={{ boxShadow: 'var(--shadow-sm)', animationDelay: '0.2s' }}>
                <div className="text-4xl mb-2" style={{ color: 'var(--warning)' }}>
                  {logos.filter(l => l.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Pendientes</div>
              </div>
              <div className="card-modern bg-white p-8 text-center animate-fade-in-up" style={{ boxShadow: 'var(--shadow-sm)', animationDelay: '0.3s' }}>
                <div className="text-4xl mb-2" style={{ color: 'var(--primary)' }}>
                  {logos.filter(l => l.status === 'processing').length}
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Procesando</div>
              </div>
              <div className="card-modern bg-white p-8 text-center animate-fade-in-up" style={{ boxShadow: 'var(--shadow-sm)', animationDelay: '0.4s' }}>
                <div className="text-4xl mb-2" style={{ color: 'var(--success)' }}>{completedLogos.length}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wide">Completados</div>
              </div>
            </div>
          )}
        </div>

        {/* Logos Grid */}
        <div className={`transition-all duration-700 ease-out ${logos.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          {logos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {logos.map((logo, index) => (
                <div 
                  key={logo.id} 
                  className={`${logo.isRemoving ? 'animate-fade-out' : 'animate-fade-in-up'}`}
                  style={{ animationDelay: logo.isRemoving ? '0s' : `${0.1 + (index * 0.1)}s` }}
                >
                  <LogoCard
                    logo={logo}
                    onProcess={processLogo}
                    onRemove={removeLogo}
                    onDownload={downloadLogo}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empty state */}
        <div className={`transition-all duration-700 ease-out ${logos.length === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          {logos.length === 0 && (
            <div className="text-center py-20 animate-fade-in-up">
              <div className="text-gray-300 mb-8">
                <svg className="w-32 h-32 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 tracking-tight">
                Comienza creando algo increíble
              </h3>
              <p className="text-lg text-gray-500 font-light">
                Sube tus logos y deja que la magia suceda
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-20" style={{ backgroundColor: 'var(--gray-light)' }}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center text-gray-500">
            <p className="text-lg">MonoLogo</p>
            <p className="mt-2">
              Diseñado con ❤️ siguiendo principios de diseño moderno
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
