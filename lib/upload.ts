import { supabase } from './supabase';

// Upload image to Supabase Storage
export async function uploadImage(
    file: File,
    bucket: string,
    folder: string
): Promise<string | null> {
    try {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) {
            console.error('Upload error:', error);
            throw error;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return urlData.publicUrl;
    } catch (error) {
        console.error('Upload image error:', error);
        return null;
    }
}

// Delete image from Supabase Storage
export async function deleteImage(
    imageUrl: string,
    bucket: string
): Promise<boolean> {
    try {
        // Extract path from URL
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split(`/storage/v1/object/public/${bucket}/`);
        if (pathParts.length < 2) return false;

        const filePath = pathParts[1];

        const { error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) {
            console.error('Delete error:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Delete image error:', error);
        return false;
    }
}

// Compress image before upload
export async function compressImage(
    file: File,
    maxWidth = 800,
    quality = 0.8
): Promise<File> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                        } else {
                            resolve(file);
                        }
                    },
                    'image/jpeg',
                    quality
                );
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
}
