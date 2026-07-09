// Data the client must send when registering
export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'technician';
  phone?: string;
}

// Data the client must send when logging in
export interface LoginDto {
  email: string;
  password: string;
}
