import type { IImageProcessor } from './interfaces';

export class ImageProcessor implements IImageProcessor {
  async removeBackground(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto del canvas'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        
        // Obtener datos de la imagen
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Remover fondo blanco/gris claro con tolerancia
        this.removeWhiteBackground(data);
        
        // Aplicar anti-aliasing para suavizar bordes
        this.applyAntiAliasing(data, canvas.width, canvas.height);
        
        ctx.putImageData(imageData, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Error al crear el blob'));
          }
        }, 'image/png');
      };

      img.onerror = () => reject(new Error('Error al cargar la imagen'));
      img.src = URL.createObjectURL(file);
    });
  }

  async createWhiteVersion(imageBlob: Blob): Promise<Blob> {
    return this.createColorVersion(imageBlob, [255, 255, 255]); // Blanco
  }

  async createBlackVersion(imageBlob: Blob): Promise<Blob> {
    return this.createColorVersion(imageBlob, [0, 0, 0]); // Negro
  }

  async smoothEdges(imageBlob: Blob): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto del canvas'));
          return;
        }

        // Aplicar filtro de suavizado
        ctx.filter = 'blur(0.5px)';
        ctx.drawImage(img, 0, 0);
        ctx.filter = 'none';
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Error al crear el blob suavizado'));
          }
        }, 'image/png');
      };

      img.onerror = () => reject(new Error('Error al cargar la imagen para suavizar'));
      img.src = URL.createObjectURL(imageBlob);
    });
  }

  private async createColorVersion(imageBlob: Blob, color: [number, number, number]): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto del canvas'));
          return;
        }

        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Cambiar todos los píxeles no transparentes al color especificado
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 0) { // Si no es transparente
            data[i] = color[0];     // R
            data[i + 1] = color[1]; // G
            data[i + 2] = color[2]; // B
            // Mantener el alpha original
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Error al crear la versión de color'));
          }
        }, 'image/png');
      };

      img.onerror = () => reject(new Error('Error al cargar la imagen para colorear'));
      img.src = URL.createObjectURL(imageBlob);
    });
  }

  private removeWhiteBackground(data: Uint8ClampedArray): void {
    const threshold = 240; // Umbral para considerar un píxel como "blanco"
    const tolerance = 30;  // Tolerancia para variaciones de color

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Si el píxel es mayormente blanco/gris claro
      if (r > threshold && g > threshold && b > threshold) {
        const avg = (r + g + b) / 3;
        if (Math.abs(r - avg) < tolerance && Math.abs(g - avg) < tolerance && Math.abs(b - avg) < tolerance) {
          data[i + 3] = 0; // Hacer transparente
        }
      }
    }
  }

  private applyAntiAliasing(data: Uint8ClampedArray, width: number, height: number): void {
    // Aplicar suavizado en los bordes para evitar el efecto de dientes de sierra
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const index = (y * width + x) * 4;
        
        if (data[index + 3] > 0 && data[index + 3] < 255) { // Píxel semi-transparente
          // Promediar con píxeles vecinos
          const neighbors = this.getNeighbors(data, x, y, width, height);
          if (neighbors.length > 0) {
            const avgAlpha = neighbors.reduce((sum, alpha) => sum + alpha, 0) / neighbors.length;
            data[index + 3] = Math.round(avgAlpha);
          }
        }
      }
    }
  }

  private getNeighbors(data: Uint8ClampedArray, x: number, y: number, width: number, height: number): number[] {
    const neighbors: number[] = [];
    
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const index = (ny * width + nx) * 4;
          neighbors.push(data[index + 3]);
        }
      }
    }
    
    return neighbors;
  }
}
