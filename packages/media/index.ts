import { createClient } from '@supabase/supabase-js';

export class MediaService {
  private bucket = 'vehicles';

  private getClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Key are required for MediaService!');
    }

    return createClient(supabaseUrl, supabaseKey);
  }

  async uploadFile(file: File | Buffer, path: string, contentType?: string) {
    const supabase = this.getClient();
    const { data, error } = await supabase.storage
      .from(this.bucket)
      .upload(path, file, {
        contentType,
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(this.bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  }

  async deleteFile(path: string) {
    const supabase = this.getClient();
    const { error } = await supabase.storage
      .from(this.bucket)
      .remove([path]);

    if (error) throw error;
  }
}
