import { useCallback, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, storage } from './firebase';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'] as const;
const MAX_BYTES = 4 * 1024 * 1024; // 4MB

/** `accept` attribute value for `<input type="file">`. */
export const IMAGE_ACCEPT = ACCEPTED_TYPES.join(',');

export interface UseImageUploadOptions {
  /** Logical bucket folder, e.g. 'services' or 'business'. */
  folder: string;
}

export interface UseImageUpload {
  upload: (file: File) => Promise<string | null>;
  uploading: boolean;
  progress: number;
  error: string | null;
  reset: () => void;
}

function fileExtension(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : 'jpg';
}

function validate(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number])) {
    return 'Use a PNG, JPG, or WEBP image.';
  }
  if (file.size > MAX_BYTES) {
    return 'Image must be 4MB or smaller.';
  }
  return null;
}

/**
 * Uploads an image to Firebase Storage under `uploads/{uid}/{folder}/...`
 * and resolves to its public download URL. Domain-agnostic and reusable.
 */
export function useImageUpload({ folder }: UseImageUploadOptions): UseImageUpload {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  const upload = useCallback(
    async (file: File): Promise<string | null> => {
      const validationError = validate(file);
      if (validationError) {
        setError(validationError);
        return null;
      }

      const uid = auth.currentUser?.uid;
      if (!uid) {
        setError('You must be signed in to upload.');
        return null;
      }

      setError(null);
      setUploading(true);
      setProgress(0);

      const path = `uploads/${uid}/${folder}/${Date.now()}.${fileExtension(file.name)}`;
      const task = uploadBytesResumable(ref(storage, path), file, {
        contentType: file.type,
      });

      try {
        return await new Promise<string>((resolve, reject) => {
          task.on(
            'state_changed',
            (snapshot) => {
              const pct = snapshot.totalBytes
                ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                : 0;
              setProgress(pct);
            },
            reject,
            () => {
              getDownloadURL(task.snapshot.ref).then(resolve).catch(reject);
            },
          );
        });
      } catch {
        setError('Upload failed. Please try again.');
        return null;
      } finally {
        setUploading(false);
      }
    },
    [folder],
  );

  return { upload, uploading, progress, error, reset };
}
