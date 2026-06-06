import type { RefObject } from 'react';

export interface ImageField {
  // state
  value: string;
  hasImage: boolean;
  loadError: boolean;
  isUploading: boolean;
  progress: number;
  error: string | null;
  urlMode: boolean;

  // handlers
  openPicker: () => void;
  setUrl: (next: string) => void;
  toggleUrlMode: () => void;
  clear: () => void;
  markLoadError: () => void;
  markLoaded: () => void;

  // internal — used by <HiddenInput>
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleFile: (file: File | undefined) => Promise<void>;
}
