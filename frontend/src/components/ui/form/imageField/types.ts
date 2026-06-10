export interface ImageField {
  // state
  value: string;
  hasImage: boolean;
  loadError: boolean;
  isUploading: boolean;
  progress: number;
  error: string | null;
  urlMode: boolean;

  // id shared between the file input and any <label htmlFor> trigger
  inputId: string;

  // handlers
  setUrl: (next: string) => void;
  toggleUrlMode: () => void;
  clear: () => void;
  markLoadError: () => void;
  markLoaded: () => void;
  handleFile: (file: File | undefined) => Promise<void>;
}
