import { HttpClient } from '@angular/common/http';
import {
  Injectable,
  inject,
} from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, mapTo, Observable, of, tap } from 'rxjs';
import { CloudinaryUploadResponse } from 'shared/models/uploadimg';

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  private readonly _http = inject(HttpClient);
  private readonly _endpoint = environment.apiURLlocal + 'imagenes';

  constructor() {}

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this._http.post<any>(`${this._endpoint}`, formData);
  }

  deleteImage(publicId: string): Observable<any> {
       return this._http.delete(`${this._endpoint}/${publicId.split('/')[1]}`);
  }

  generateImageUrl(publicId: string, transformations: string = ''): string {
    return '';
  }

  validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB (límite de Cloudinary free)
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Tipo de archivo no permitido. Use JPEG, PNG, GIF, WebP o SVG.',
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'El archivo es demasiado grande. Máximo 10MB.',
      };
    }

    return { isValid: true };
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
