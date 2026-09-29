export interface Photo {
  id: number;
  url: string;
  attribution: string;
  license_code: string | null;
  original_dimensions?: {
    width: number;
    height: number;
  };
}

export function getPhotoUrl(photo: Photo, size: PhotoSize = 'medium'): string {
  return photo.url.replace('square', size);
}

export type PhotoSize = 'square' | 'small' | 'medium' | 'large' | 'original';
