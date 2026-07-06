import { supabase, isSupabaseConfigured } from '@/utils/supabaseClient';
import { StorageBucket, UploadResult } from '@/types/storage';

export const storageService = {
  isConfigured(): boolean {
    return isSupabaseConfigured();
  },

  async uploadFile(bucket: StorageBucket, path: string, file: File): Promise<UploadResult> {
    if (this.isConfigured()) {
      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(path, file, { upsert: true });

        if (error) throw error;
        
        const publicUrl = this.getPublicUrl(bucket, path);
        return { success: true, url: publicUrl, path: data.path };
      } catch (err: any) {
        console.error(`Supabase storage upload error in bucket ${bucket}:`, err);
        return { success: false, error: err.message || 'Supabase upload failed' };
      }
    } else {
      // Fallback implementation
      console.warn(`Supabase not configured. Using mock storage upload for bucket: ${bucket}`);
      
      // Attempt to read as base64 for persistence if it's small enough (e.g. logos)
      let fileUrl = '';
      if (file.size < 1.5 * 1024 * 1024) {
        try {
          fileUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        } catch {
          fileUrl = URL.createObjectURL(file);
        }
      } else {
        fileUrl = URL.createObjectURL(file);
      }

      // Store in local storage mock index
      try {
        const stored = localStorage.getItem('outdoorcore_mock_storage') || '[]';
        const files = JSON.parse(stored);
        files.push({ bucket, path, name: file.name, url: fileUrl, size: file.size, type: file.type, uploadedAt: new Date().toISOString() });
        localStorage.setItem('outdoorcore_mock_storage', JSON.stringify(files));
      } catch (e) {
        console.error('Failed to save to mock storage database:', e);
      }

      return { success: true, url: fileUrl, path };
    }
  },

  async deleteFile(bucket: StorageBucket, path: string): Promise<{ success: boolean; error?: string }> {
    if (this.isConfigured()) {
      try {
        const { error } = await supabase.storage.from(bucket).remove([path]);
        if (error) throw error;
        return { success: true };
      } catch (err: any) {
        console.error(`Supabase storage delete error in bucket ${bucket}:`, err);
        return { success: false, error: err.message || 'Supabase delete failed' };
      }
    } else {
      try {
        const stored = localStorage.getItem('outdoorcore_mock_storage') || '[]';
        let files = JSON.parse(stored);
        files = files.filter((f: any) => !(f.bucket === bucket && f.path === path));
        localStorage.setItem('outdoorcore_mock_storage', JSON.stringify(files));
      } catch (e) {
        // Ignore
      }
      return { success: true };
    }
  },

  getPublicUrl(bucket: StorageBucket, path: string): string {
    if (this.isConfigured()) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      return data.publicUrl;
    } else {
      try {
        const stored = localStorage.getItem('outdoorcore_mock_storage') || '[]';
        const files = JSON.parse(stored);
        const found = files.find((f: any) => f.bucket === bucket && f.path === path);
        if (found) return found.url;
      } catch (e) {
        // Ignore
      }
      // Return placeholder
      return `https://placeholder.supabase.co/storage/v1/object/public/${bucket}/${path}`;
    }
  },

  async listFiles(bucket: StorageBucket, folder: string = ''): Promise<{ name: string; size: number; metadata: any }[]> {
    if (this.isConfigured()) {
      try {
        const { data, error } = await supabase.storage.from(bucket).list(folder);
        if (error) throw error;
        return (data || []).map(f => ({
          name: f.name,
          size: f.metadata?.size || 0,
          metadata: f.metadata
        }));
      } catch (err) {
        console.error(`Supabase storage list error in bucket ${bucket}:`, err);
        return [];
      }
    } else {
      try {
        const stored = localStorage.getItem('outdoorcore_mock_storage') || '[]';
        const files = JSON.parse(stored);
        return files
          .filter((f: any) => f.bucket === bucket && f.path.startsWith(folder))
          .map((f: any) => ({
            name: f.name,
            size: f.size,
            metadata: { mimetype: f.type }
          }));
      } catch (e) {
        return [];
      }
    }
  }
};
