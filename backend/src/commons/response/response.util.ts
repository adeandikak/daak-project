/* Bentuk respons tunggal untuk seluruh endpoint. Semua controller membungkus
   hasilnya lewat helper di sini — bukan mengembalikan entity mentah — supaya
   FE selalu menerima amplop yang sama, termasuk saat galat. */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

export function successResponse<T>(data: T, message = 'Berhasil'): ApiResponse<T> {
  return { success: true, data, message };
}

export function errorResponse(message: string, errors?: any): ApiResponse {
  return { success: false, message, errors };
}

export function paginatedResponse<T>(
  data: T[],
  meta: { total: number; page: number; limit: number },
  message = 'Berhasil',
): ApiResponse {
  return {
    success: true,
    data: {
      items: data,
      meta: {
        ...meta,
        totalPages: Math.ceil(meta.total / meta.limit),
      },
    },
    message,
  };
}
