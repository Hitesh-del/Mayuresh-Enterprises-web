import { supabase } from '@/lib/supabase';

const MAX_FILE_SIZE = 1024 * 1024; // 1 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];

export interface UploadProgress {
  loaded: number;
  total: number;
}

function sanitizeFileName(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
  return base.slice(0, 50);
}

function compressImage(file: File, quality = 0.8, maxDimension = 1080): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas to Blob failed'));
        },
        'image/webp',
        quality
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
  });
}

async function prepareFile(file: File): Promise<File> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Unsupported file format. Please use JPEG, PNG, GIF, WEBP, or AVIF.');
  }
  if (file.size <= MAX_FILE_SIZE) return file;

  let quality = 0.8;
  let prepared: Blob = file;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    prepared = await compressImage(file, quality);
    if (prepared.size <= MAX_FILE_SIZE || quality <= 0.3) break;
    quality -= 0.1;
  }
  const newName = `${sanitizeFileName(file.name.replace(/\.[^.]+$/, ''))}.webp`;
  return new File([prepared], newName, { type: 'image/webp' });
}

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  const prepared = await prepareFile(file);
  const fileName = `${userId}/${Date.now()}_${prepared.name}`;
  const { data, error } = await supabase.storage.from('avatars').upload(fileName, prepared, {
    upsert: true,
    contentType: prepared.type,
  });
  if (error) throw error;
  const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(data.path);
  return urlData.publicUrl;
}
