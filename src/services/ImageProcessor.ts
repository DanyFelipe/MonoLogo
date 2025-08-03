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
        
        // Remover fondo blanco/gris claro con algoritmo mejorado
        this.removeWhiteBackground(data, canvas.width, canvas.height);
        
        // Aplicar anti-aliasing avanzado para suavizar bordes
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

  private removeWhiteBackground(data: Uint8ClampedArray, width: number, height: number): void {
    // Crear una copia de los datos para trabajar
    const originalData = new Uint8ClampedArray(data);
    
    // Paso 1: Detección mejorada de fondo con múltiples criterios
    this.detectAndMarkBackground(data, width, height);
    
    // Paso 2: Refinamiento de bordes con análisis de gradientes
    this.refineEdgesWithGradient(data, originalData, width, height);
    
    // Paso 3: Suavizado gaussiano para anti-aliasing superior
    this.applyGaussianSmoothing(data, width, height);
    
    // Paso 4: Corrección final de transparencias
    this.correctTransparencyEdges(data, width, height);
  }

  private applyAntiAliasing(data: Uint8ClampedArray, width: number, height: number): void {
    // Crear buffer temporal para evitar interferencias
    const tempData = new Uint8ClampedArray(data);
    
    // Aplicar anti-aliasing mejorado con múltiples pasadas
    for (let pass = 0; pass < 2; pass++) {
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3];
          
          // Procesar píxeles que están en el borde (alpha entre 1 y 254)
          if (alpha > 0 && alpha < 255) {
            const neighbors = this.getAdvancedNeighbors(x, y, width, height);
            
            if (neighbors.length > 0) {
              // Calcular promedio ponderado basado en distancia y similitud de color
              let weightedR = 0, weightedG = 0, weightedB = 0, weightedA = 0;
              let totalWeight = 0;
              
              neighbors.forEach(neighbor => {
                const weight = this.calculateNeighborWeight(data, index, neighbor.index, neighbor.distance);
                weightedR += data[neighbor.index] * weight;
                weightedG += data[neighbor.index + 1] * weight;
                weightedB += data[neighbor.index + 2] * weight;
                weightedA += data[neighbor.index + 3] * weight;
                totalWeight += weight;
              });
              
              if (totalWeight > 0) {
                // Mezclar con valores originales para preservar detalles
                const blendFactor = 0.4; // 40% de suavizado, 60% original
                tempData[index] = Math.round(data[index] * (1 - blendFactor) + (weightedR / totalWeight) * blendFactor);
                tempData[index + 1] = Math.round(data[index + 1] * (1 - blendFactor) + (weightedG / totalWeight) * blendFactor);
                tempData[index + 2] = Math.round(data[index + 2] * (1 - blendFactor) + (weightedB / totalWeight) * blendFactor);
                tempData[index + 3] = Math.round(data[index + 3] * (1 - blendFactor) + (weightedA / totalWeight) * blendFactor);
              }
            }
          }
        }
      }
      
      // Copiar datos temporales de vuelta para la siguiente pasada
      data.set(tempData);
    }
  }

  /**
   * Obtiene vecinos avanzados con información de distancia
   */
  private getAdvancedNeighbors(x: number, y: number, width: number, height: number): Array<{index: number, distance: number}> {
    const neighbors: Array<{index: number, distance: number}> = [];
    
    // Kernel 3x3 con pesos basados en distancia
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const index = (ny * width + nx) * 4;
          const distance = Math.sqrt(dx * dx + dy * dy);
          neighbors.push({ index, distance });
        }
      }
    }
    
    return neighbors;
  }

  /**
   * Calcula el peso de influencia de un vecino
   */
  private calculateNeighborWeight(data: Uint8ClampedArray, currentIndex: number, neighborIndex: number, distance: number): number {
    // Peso base inversamente proporcional a la distancia
    let weight = 1 / (distance + 0.1);
    
    // Factor de similitud de color
    const currentR = data[currentIndex];
    const currentG = data[currentIndex + 1];
    const currentB = data[currentIndex + 2];
    
    const neighborR = data[neighborIndex];
    const neighborG = data[neighborIndex + 1];
    const neighborB = data[neighborIndex + 2];
    
    const colorDiff = Math.sqrt(
      Math.pow(currentR - neighborR, 2) +
      Math.pow(currentG - neighborG, 2) +
      Math.pow(currentB - neighborB, 2)
    ) / 255;
    
    // Reducir peso si los colores son muy diferentes
    weight *= Math.exp(-colorDiff * 2);
    
    // Factor de transparencia
    const neighborAlpha = data[neighborIndex + 3];
    if (neighborAlpha === 0) {
      weight *= 0.1; // Reducir influencia de píxeles transparentes
    }
    
    return weight;
  }

  /**
   * Detecta y marca píxeles de fondo usando múltiples criterios
   */
  private detectAndMarkBackground(data: Uint8ClampedArray, width: number, height: number): void {
    const threshold = 235; // Umbral más estricto para blancos
    const grayThreshold = 245; // Umbral para grises claros
    const tolerance = 25; // Tolerancia para variaciones
    
    // Marcar píxeles que claramente son fondo
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];
      
      if (alpha === 0) continue; // Ya transparente
      
      // Detectar blancos puros y casi puros
      if (r >= threshold && g >= threshold && b >= threshold) {
        const colorVariance = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
        if (colorVariance <= tolerance) {
          data[i + 3] = 0; // Marcar como transparente
        }
      }
      
      // Detectar grises muy claros
      const avg = (r + g + b) / 3;
      if (avg >= grayThreshold) {
        const variance = Math.sqrt(((r - avg) ** 2 + (g - avg) ** 2 + (b - avg) ** 2) / 3);
        if (variance <= tolerance) {
          data[i + 3] = 0;
        }
      }
    }
    
    // Aplicar flood-fill desde las esquinas para capturar fondos conectados
    this.floodFillBackground(data, width, height);
  }

  /**
   * Aplica flood-fill desde las esquinas para detectar fondo conectado
   */
  private floodFillBackground(data: Uint8ClampedArray, width: number, height: number): void {
    const visited = new Set<number>();
    const stack: Array<{x: number, y: number}> = [];
    
    // Comenzar desde las cuatro esquinas
    const corners = [
      {x: 0, y: 0},
      {x: width - 1, y: 0},
      {x: 0, y: height - 1},
      {x: width - 1, y: height - 1}
    ];
    
    corners.forEach(corner => {
      const index = (corner.y * width + corner.x) * 4;
      if (this.isBackgroundColor(data, index)) {
        stack.push(corner);
      }
    });
    
    while (stack.length > 0) {
      const {x, y} = stack.pop()!;
      const key = y * width + x;
      
      if (visited.has(key) || x < 0 || x >= width || y < 0 || y >= height) {
        continue;
      }
      
      const index = (y * width + x) * 4;
      if (!this.isBackgroundColor(data, index)) {
        continue;
      }
      
      visited.add(key);
      data[index + 3] = 0; // Marcar como transparente
      
      // Agregar píxeles vecinos
      stack.push({x: x + 1, y}, {x: x - 1, y}, {x, y: y + 1}, {x, y: y - 1});
    }
  }

  /**
   * Determina si un píxel es color de fondo
   */
  private isBackgroundColor(data: Uint8ClampedArray, index: number): boolean {
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const alpha = data[index + 3];
    
    if (alpha === 0) return true;
    
    const threshold = 230;
    const tolerance = 30;
    
    if (r >= threshold && g >= threshold && b >= threshold) {
      const colorVariance = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
      return colorVariance <= tolerance;
    }
    
    return false;
  }

  /**
   * Refina los bordes usando análisis de gradientes
   */
  private refineEdgesWithGradient(data: Uint8ClampedArray, originalData: Uint8ClampedArray, width: number, height: number): void {
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const index = (y * width + x) * 4;
        
        if (data[index + 3] === 0) continue; // Ya transparente
        
        // Calcular gradiente de intensidad
        const gradient = this.calculateGradient(originalData, x, y, width, height);
        
        // Si el gradiente es bajo (área uniforme) y está cerca del fondo, hacer semi-transparente
        if (gradient < 15) {
          const backgroundProximity = this.calculateBackgroundProximity(data, x, y, width, height);
          if (backgroundProximity > 0.3) {
            const currentAlpha = data[index + 3];
            data[index + 3] = Math.round(currentAlpha * (1 - backgroundProximity * 0.7));
          }
        }
      }
    }
  }

  /**
   * Calcula el gradiente de intensidad en un punto
   */
  private calculateGradient(data: Uint8ClampedArray, x: number, y: number, width: number, height: number): number {
    const getIntensity = (px: number, py: number): number => {
      if (px < 0 || px >= width || py < 0 || py >= height) return 0;
      const idx = (py * width + px) * 4;
      return (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
    };
    
    const gx = getIntensity(x + 1, y) - getIntensity(x - 1, y);
    const gy = getIntensity(x, y + 1) - getIntensity(x, y - 1);
    
    return Math.sqrt(gx * gx + gy * gy);
  }

  /**
   * Calcula la proximidad al fondo
   */
  private calculateBackgroundProximity(data: Uint8ClampedArray, x: number, y: number, width: number, height: number): number {
    let transparentNeighbors = 0;
    let totalNeighbors = 0;
    
    for (let dy = -2; dy <= 2; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const idx = (ny * width + nx) * 4;
          totalNeighbors++;
          if (data[idx + 3] === 0) {
            transparentNeighbors++;
          }
        }
      }
    }
    
    return totalNeighbors > 0 ? transparentNeighbors / totalNeighbors : 0;
  }

  /**
   * Aplica suavizado gaussiano para anti-aliasing superior
   */
  private applyGaussianSmoothing(data: Uint8ClampedArray, width: number, height: number): void {
    // Kernel gaussiano 3x3
    const kernel = [
      [1, 2, 1],
      [2, 4, 2],
      [1, 2, 1]
    ];
    const kernelSum = 16;
    
    const tempData = new Uint8ClampedArray(data);
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const index = (y * width + x) * 4;
        
        // Solo suavizar píxeles que están en el borde (parcialmente transparentes)
        if (data[index + 3] > 0 && data[index + 3] < 255) {
          let r = 0, g = 0, b = 0, a = 0;
          
          for (let ky = 0; ky < 3; ky++) {
            for (let kx = 0; kx < 3; kx++) {
              const px = x + kx - 1;
              const py = y + ky - 1;
              const pidx = (py * width + px) * 4;
              const weight = kernel[ky][kx];
              
              r += data[pidx] * weight;
              g += data[pidx + 1] * weight;
              b += data[pidx + 2] * weight;
              a += data[pidx + 3] * weight;
            }
          }
          
          tempData[index] = r / kernelSum;
          tempData[index + 1] = g / kernelSum;
          tempData[index + 2] = b / kernelSum;
          tempData[index + 3] = a / kernelSum;
        }
      }
    }
    
    // Copiar datos suavizados de vuelta
    data.set(tempData);
  }

  /**
   * Corrección final de transparencias para bordes más suaves
   */
  private correctTransparencyEdges(data: Uint8ClampedArray, width: number, height: number): void {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const alpha = data[index + 3];
        
        if (alpha > 0 && alpha < 128) {
          // Para píxeles con baja opacidad, verificar si están en el borde del objeto
          const edgeStrength = this.calculateEdgeStrength(data, x, y, width, height);
          
          if (edgeStrength < 0.3) {
            // Si no hay mucho contraste, reducir la opacidad gradualmente
            data[index + 3] = Math.round(alpha * 0.3);
          } else {
            // Si hay contraste, mantener cierta opacidad para el anti-aliasing
            data[index + 3] = Math.round(Math.max(alpha, 64));
          }
        }
      }
    }
  }

  /**
   * Calcula la fuerza del borde en un punto
   */
  private calculateEdgeStrength(data: Uint8ClampedArray, x: number, y: number, width: number, height: number): number {
    let maxDiff = 0;
    const currentIndex = (y * width + x) * 4;
    const currentIntensity = (data[currentIndex] + data[currentIndex + 1] + data[currentIndex + 2]) / 3;
    
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        
        const nx = x + dx;
        const ny = y + dy;
        
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIndex = (ny * width + nx) * 4;
          const neighborIntensity = (data[nIndex] + data[nIndex + 1] + data[nIndex + 2]) / 3;
          const diff = Math.abs(currentIntensity - neighborIntensity);
          maxDiff = Math.max(maxDiff, diff);
        }
      }
    }
    
    return maxDiff / 255;
  }
}
