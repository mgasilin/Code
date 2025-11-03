// Общие интерфейсы для всего приложения
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TokenPayload {
  userId: number;
  role: string;
  phoneNumber?: string;
  ldapUid?: string;
}

// Query параметры для списков
export interface ListQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}