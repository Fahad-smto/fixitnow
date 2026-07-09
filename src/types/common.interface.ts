// Generic API response shape used by every controller
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

// Shape of the JWT payload after verification
export interface JwtPayload {
  id: string;
  role: 'customer' | 'technician' | 'admin';
}

// Generic pagination/filter query params reused by list endpoints
export interface PaginationQuery {
  page?: number;
  limit?: number;
}
