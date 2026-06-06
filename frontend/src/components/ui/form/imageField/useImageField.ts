import { useCallback, useRef, useState } from 'react';
import { useImageUpload } from '../../../../lib/useImageUpload';
import type { ImageField } from './types';

export interface UseImageFieldOptions {
  value: string;
  onChange: (url: string) => void;
  folder: string;
}

export function useImageField({ value, onChange, folder }: UseImageFieldOptions): ImageField {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadError, setLoadError] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const { upload, uploading, progress, error, reset } = useImageUpload({ folder });

  const hasImage = !!value && !loadError;

  const openPicker = useCallback(() => fileInputRef.current?.click(), []);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      const url = await upload(file);
      if (url) {
        setLoadError(false);
        setUrlMode(false);
        onChange(url);
      }
    },
    [upload, onChange],
  );

  const setUrl = useCallback(
    (next: string) => {
      setLoadError(false);
      onChange(next);
    },
    [onChange],
  );

  const toggleUrlMode = useCallback(() => setUrlMode((m) => !m), []);

  const clear = useCallback(() => {
    onChange('');
    setLoadError(false);
    reset();
  }, [onChange, reset]);

  const markLoadError = useCallback(() => setLoadError(true), []);
  const markLoaded = useCallback(() => setLoadError(false), []);

  return {
    value,
    hasImage,
    loadError,
    isUploading: uploading,
    progress,
    error,
    urlMode,
    openPicker,
    setUrl,
    toggleUrlMode,
    clear,
    markLoadError,
    markLoaded,
    fileInputRef,
    handleFile,
  };
}
