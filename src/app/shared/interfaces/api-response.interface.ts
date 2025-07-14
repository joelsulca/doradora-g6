export interface ApiBaseResponse<T> {
  success: boolean;
  statusCode: number;
  mensaje: string;
  data: T;
} 