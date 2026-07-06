import { MediaAsset } from '@/data/media';

export type StorageBucket = 'logos' | 'media' | 'contracts' | 'invoices' | 'maintenance' | 'avatars';

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
  path: string;
  bucket: StorageBucket;
  uploadedAt: string;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export type { MediaAsset };
