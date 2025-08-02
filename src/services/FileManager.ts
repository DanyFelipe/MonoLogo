import type { IFileManager } from './interfaces';

export class FileManager implements IFileManager {
  async uploadFile(file: File): Promise<string> {
    // En una implementación real, esto subiría el archivo a un servidor
    // Por ahora, creamos una URL temporal
    return this.createObjectUrl(file);
  }

  async downloadFile(url: string, filename: string): Promise<void> {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      
      const downloadUrl = this.createObjectUrl(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.revokeObjectUrl(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new Error('Error al descargar el archivo');
    }
  }

  createObjectUrl(blob: Blob | File): string {
    return URL.createObjectURL(blob);
  }

  revokeObjectUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  async downloadAllVersions(
    transparentBlob: Blob,
    whiteBlob: Blob,
    blackBlob: Blob,
    baseName: string
  ): Promise<void> {
    const downloads = [
      { blob: transparentBlob, suffix: '_transparent.png' },
      { blob: whiteBlob, suffix: '_white.png' },
      { blob: blackBlob, suffix: '_black.png' }
    ];

    for (const { blob, suffix } of downloads) {
      const url = this.createObjectUrl(blob);
      await this.downloadFile(url, `${baseName}${suffix}`);
      this.revokeObjectUrl(url);
    }
  }
}
