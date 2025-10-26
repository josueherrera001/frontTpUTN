import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { CloudinaryService } from '@api/cloudinary.service';
import { CloudinaryUploadResponse, UploadedImg } from 'shared/models/uploadimg';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cloudinary-upload',
  standalone: true,
  imports: [DatePipe,CommonModule, HttpClientModule],
  templateUrl: './cloudinary-upload.component.html',
  styleUrl: './cloudinary-upload.component.scss'
})
export class CloudinaryUploadComponent {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() imagesUploaded = new EventEmitter<UploadedImg>();
  // file1!: File;

    @Input() uploadedImages: UploadedImg[] = [];
    isDragging = false;
    maxFiles = 1;
    acceptedTypes = 'image/*';
    private readonly toastrSvc = inject(ToastrService);

    constructor(private cloudinaryService: CloudinaryService) {

    }

  // Manejar drag and drop
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFiles(Array.from(files));
    }
  }

  // Click en el área de upload
  onUploadAreaClick() {
    this.fileInput.nativeElement.click();
  }
 updateImage(i:any) {
    this.fileInput.nativeElement.click();
    debugger;
    //  const input = event.target as HTMLInputElement;
    // if (input.files && input.files.length > 0) {
    //   this.processFiles(Array.from(input.files));
    //   input.value = ''; // Reset input
    // }
  }
  // Manejar selección de archivos
  onFileSelected(event: Event) {
    debugger;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFiles(Array.from(input.files));
      input.value = ''; // Reset input
    }
  }

  // Procesar archivos
  async processFiles(files: File[]) {
    const remainingSlots = this.maxFiles - this.uploadedImages.length;
    const filesToProcess = files.slice(0, remainingSlots);

    for (const file of filesToProcess) {
      await this.processSingleFile(file);
    }

    if (files.length > remainingSlots) {
      this.showNotification(`Solo se pueden subir ${this.maxFiles} imágenes máximo`, 'warning');
    }
  }

  // Procesar un solo archivo
  async processSingleFile(file: File) {
    // Validar archivo
    const validation = this.cloudinaryService.validateFile(file);
    debugger;
    if (!validation.isValid) {
      this.showNotification(validation.error!, 'error');
      return;
    }

    // Crear objeto de imagen
    const image: UploadedImg = {
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      url: null,
      uploadDate: new Date(),
      progress: 0,
      status: 'pending'
    };

    // Generar preview local
    try {
      image.url = await this.generateImagePreview(file);
      this.uploadedImages.pop()
      this.uploadedImages.push(image);
      this.uploadToCloudinary(image);
    } catch (error) {
      this.showError(image, 'Error al generar preview de la imagen');
    }
  }

  // Generar preview local
  private generateImagePreview(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  uploadToCloudinary(image: UploadedImg) {
    image.status = 'uploading';

  debugger;
    this.simulateUploadProgress(image);

     this.cloudinaryService.uploadImage(image.file).subscribe({
        next: (result: any) => {
            debugger;
          image.status = 'completed';
          image.progress = 100;
          image.secure_url = result.secure_url;
          image.public_id = result.public_id;
          image.cloudinaryData = result;

          this.showNotification(`"${image.name}" subida exitosamente`, 'success');
          this.emitImagesUploaded();

        },
        error: (err) => {
          debugger;
          image.status = 'error';
          image.error = this.getErrorMessage(err);
          this.showNotification(`Error al subir "${image.name}"`, 'error');
          console.error('Cloudinary upload error:', err);
        },
      });
  }

  // Simular progreso de upload
  private simulateUploadProgress(image: UploadedImg) {
    let progress = 0;
    const interval = setInterval(() => {
      if (image.status !== 'uploading') {
        clearInterval(interval);
        return;
      }

      progress += Math.random() * 15;
      if (progress >= 90) {
        progress = 90; // Mantener en 90% hasta que termine
        clearInterval(interval);
      }
      image.progress = Math.min(progress, 90);
    }, 200);
  }

  // Eliminar imagen
  removeImage(id: string) {
    // const image = this.uploadedImages[index];
    // if (image.public_id) {
      // Opcional: Eliminar también de Cloudinary
      this.cloudinaryService.deleteImage(id).subscribe(
        ( resp ) =>{
          debugger;
        }
      );
    // }

    this.uploadedImages.pop();
    this.emitImagesUploaded();
    this.showNotification('Imagen eliminada', 'info');
  }

  // Reintentar upload
  retryUpload(image: UploadedImg) {
    this.uploadToCloudinary(image);
  }

  // Copiar URL al clipboard
  copyUrl(image: UploadedImg) {
    if (image.secure_url) {
      navigator.clipboard.writeText(image.secure_url).then(() => {
        this.showNotification('URL copiada al portapapeles', 'success');
      });
    }
  }

  // Emitir evento de imágenes subidas
  private emitImagesUploaded() {
    const completedImages = this.uploadedImages.filter(img => img.status === 'completed')[0];
    debugger;
    this.imagesUploaded.emit(completedImages);
  }

  // Mostrar error
  private showError(image: UploadedImg, error: string) {
    image.status = 'error';
    image.error = error;
    this.showNotification(error, 'error');
  }

  // Obtener mensaje de error
  private getErrorMessage(error: any): string {
    if (error.error?.error?.message) {
      return error.error.error.message;
    }
    return error.message || 'Error desconocido al subir la imagen';
  }

  // Mostrar notificación
  private showNotification(message: string, type: 'success' | 'error' | 'warning' | 'info') {
     this.toastrSvc.clear () ;
    switch (type) {
    case 'success':
      this.toastrSvc.success(
          message,
          'Sistema de Gestión y de ventas'
        );
    break;
    case 'error':
      this.toastrSvc.error(
          message,
          'Sistema de Gestión y de ventas'
        );
    break;
    default:
      this.toastrSvc.info(
          message,
          'Sistema de Gestión y de ventas'
        );
      break;
  }
 }

  // Formatear tamaño
  formatFileSize(bytes: number): string {
    return this.cloudinaryService.formatFileSize(bytes);
  }

  // Obtener clase del estado
  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'uploading':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  // Obtener texto del estado
  getStatusText(status: string): string {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'uploading':
        return 'Subiendo...';
      case 'error':
        return 'Error';
      default:
        return 'Pendiente';
    }
  }

  // Obtener ícono del estado
  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'uploading':
        return 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z';
      case 'error':
        return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return 'M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }
}
