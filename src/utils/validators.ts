import type { UploadPayload } from '../types/payroll';

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const KTP_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
export const FAMILY_CARD_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
export const POWER_OF_ATTORNEY_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png'];
const MAX_IMAGE_DIMENSION = 1600;
const JPEG_QUALITY = 0.72;

export function isAllowedFile(file: File, allowedMimeTypes: string[]): boolean {
  return allowedMimeTypes.includes(file.type) && file.size <= MAX_FILE_SIZE;
}

function readImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Gagal memproses gambar'));
    };
    image.src = objectUrl;
  });
}

function canvasToJpegBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Gagal mengompres gambar'));
        return;
      }
      resolve(blob);
    }, 'image/jpeg', JPEG_QUALITY);
  });
}

async function compressImageFile(file: File): Promise<File> {
  if (!IMAGE_MIME_TYPES.includes(file.type)) return file;

  try {
    const image = await readImage(file);
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) return file;

    canvas.width = width;
    canvas.height = height;
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    const compressedBlob = await canvasToJpegBlob(canvas);
    if (compressedBlob.size >= file.size) return file;

    const fileName = file.name.replace(/\.(png|jpe?g)$/i, '') || 'upload';
    return new File([compressedBlob], `${fileName}.jpg`, {
      type: 'image/jpeg',
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  }
}

export async function fileToBase64Payload(file: File): Promise<UploadPayload> {
  const processedFile = await compressImageFile(file);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.onload = () => {
      const result = String(reader.result || '');
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve({
        fileName: processedFile.name,
        mimeType: processedFile.type,
        size: processedFile.size,
        base64,
      });
    };
    reader.readAsDataURL(processedFile);
  });
}
