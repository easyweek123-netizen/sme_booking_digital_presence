export interface User {
  id: number;
  email: string;
  name: string;
  firebaseUid?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
