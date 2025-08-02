import { useState, useCallback } from 'react';
import type { LogoFile, ProcessingStatus } from '../types/logo';
import { LogoProcessor } from '../services/LogoProcessor';
import { ImageProcessor } from '../services/ImageProcessor';
import { FileManager } from '../services/FileManager';
import { FileValidator } from '../services/FileValidator';

export const useLogoProcessor = () => {
  const [logos, setLogos] = useState<LogoFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Inicializar servicios
  const logoProcessor = new LogoProcessor(
    new ImageProcessor(),
    new FileManager(),
    new FileValidator()
  );

  const addLogo = useCallback((file: File): string => {
    const id = crypto.randomUUID();
    const newLogo: LogoFile = {
      id,
      name: file.name,
      originalFile: file,
      originalUrl: URL.createObjectURL(file),
      status: 'pending',
      createdAt: new Date()
    };

    setLogos(prev => [...prev, newLogo]);
    return id;
  }, []);

  const processLogo = useCallback(async (id: string) => {
    const logo = logos.find(l => l.id === id);
    if (!logo) return;

    setLogos(prev => prev.map(l => 
      l.id === id ? { ...l, status: 'processing' as ProcessingStatus } : l
    ));

    try {
      const result = await logoProcessor.processLogo(logo.originalFile);
      
      setLogos(prev => prev.map(l => 
        l.id === id ? {
          ...l,
          status: 'completed' as ProcessingStatus,
          processedUrl: result.transparentUrl,
          whiteVersionUrl: result.whiteVersionUrl,
          blackVersionUrl: result.blackVersionUrl
        } : l
      ));
    } catch (error) {
      console.error('Error processing logo:', error);
      setLogos(prev => prev.map(l => 
        l.id === id ? { ...l, status: 'error' as ProcessingStatus } : l
      ));
    }
  }, [logos, logoProcessor]);

  const processAllLogos = useCallback(async () => {
    setIsProcessing(true);
    const pendingLogos = logos.filter(l => l.status === 'pending');
    
    for (const logo of pendingLogos) {
      await processLogo(logo.id);
    }
    
    setIsProcessing(false);
  }, [logos, processLogo]);

  const removeLogo = useCallback((id: string) => {
    // Marcar como en proceso de eliminación para activar la animación
    setLogos(prev => prev.map(l => 
      l.id === id ? { ...l, isRemoving: true } : l
    ));

    // Después de la animación, remover del estado
    setTimeout(() => {
      const logo = logos.find(l => l.id === id);
      if (logo) {
        // Limpiar URLs de memoria
        URL.revokeObjectURL(logo.originalUrl);
        if (logo.processedUrl) URL.revokeObjectURL(logo.processedUrl);
        if (logo.whiteVersionUrl) URL.revokeObjectURL(logo.whiteVersionUrl);
        if (logo.blackVersionUrl) URL.revokeObjectURL(logo.blackVersionUrl);
      }
      
      setLogos(prev => prev.filter(l => l.id !== id));
    }, 400); // Duración de la animación fadeOutDown
  }, [logos]);

  const clearAllLogos = useCallback(() => {
    // Limpiar todas las URLs de memoria
    logos.forEach(logo => {
      URL.revokeObjectURL(logo.originalUrl);
      if (logo.processedUrl) URL.revokeObjectURL(logo.processedUrl);
      if (logo.whiteVersionUrl) URL.revokeObjectURL(logo.whiteVersionUrl);
      if (logo.blackVersionUrl) URL.revokeObjectURL(logo.blackVersionUrl);
    });
    
    setLogos([]);
  }, [logos]);

  const downloadLogo = useCallback(async (id: string, version: 'transparent' | 'white' | 'black') => {
    const logo = logos.find(l => l.id === id);
    if (!logo || logo.status !== 'completed') return;

    const fileManager = new FileManager();
    const baseName = logo.name.replace(/\.[^/.]+$/, '');
    
    let url: string;
    let suffix: string;
    
    switch (version) {
      case 'transparent':
        url = logo.processedUrl!;
        suffix = '_transparent.png';
        break;
      case 'white':
        url = logo.whiteVersionUrl!;
        suffix = '_white.png';
        break;
      case 'black':
        url = logo.blackVersionUrl!;
        suffix = '_black.png';
        break;
    }
    
    await fileManager.downloadFile(url, `${baseName}${suffix}`);
  }, [logos]);

  return {
    logos,
    isProcessing,
    addLogo,
    processLogo,
    processAllLogos,
    removeLogo,
    clearAllLogos,
    downloadLogo
  };
};
