import { FileUpload } from './components/FileUpload';
import { LogoCard } from './components/LogoCard';
import { useLogoProcessor } from './hooks/useLogoProcessor';

function App() {
  const {
    logos,
    isProcessing,
    addLogo,
    processLogo,
    processAllLogos,
    removeLogo,
    clearAllLogos,
    downloadLogo
  } = useLogoProcessor();

  const handleFilesSelected = (files: File[]) => {
    files.forEach(file => addLogo(file));
  };

  const pendingLogos = logos.filter(logo => logo.status === 'pending');
  const completedLogos = logos.filter(logo => logo.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">MonoLogo</h1>
              <p className="text-lg text-gray-600 mt-1">
                Remueve fondos y genera versiones en blanco y negro de tus logos
              </p>
            </div>
            
            {logos.length > 0 && (
              <div className="flex gap-3">
                {pendingLogos.length > 0 && (
                  <button
                    onClick={processAllLogos}
                    disabled={isProcessing}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-colors duration-200"
                  >
                    {isProcessing ? 'Procesando...' : `Procesar todos (${pendingLogos.length})`}
                  </button>
                )}
                <button
                  onClick={clearAllLogos}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
                >
                  Limpiar todo
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        {logos.length === 0 && (
          <div className="mb-12">
            <FileUpload 
              onFilesSelected={handleFilesSelected} 
              isProcessing={isProcessing}
            />
          </div>
        )}

        {/* Quick Upload cuando ya hay logos */}
        {logos.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Agregar más logos</h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <FileUpload 
                  onFilesSelected={handleFilesSelected} 
                  isProcessing={isProcessing}
                />
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        {logos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-2xl font-bold text-gray-900">{logos.length}</div>
              <div className="text-sm text-gray-600">Total de logos</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-2xl font-bold text-yellow-600">{pendingLogos.length}</div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-2xl font-bold text-blue-600">
                {logos.filter(l => l.status === 'processing').length}
              </div>
              <div className="text-sm text-gray-600">Procesando</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-2xl font-bold text-green-600">{completedLogos.length}</div>
              <div className="text-sm text-gray-600">Completados</div>
            </div>
          </div>
        )}

        {/* Logos Grid */}
        {logos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {logos.map(logo => (
              <LogoCard
                key={logo.id}
                logo={logo}
                onProcess={processLogo}
                onRemove={removeLogo}
                onDownload={downloadLogo}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {logos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay logos cargados
            </h3>
            <p className="text-gray-600">
              Sube tus primeros logos para comenzar a procesarlos
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>MonoLogo - Procesador de logos con arquitectura SOLID y Tailwind CSS</p>
            <p className="mt-2 text-sm">
              Desarrollado con React, TypeScript y principios de Clean Code
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
