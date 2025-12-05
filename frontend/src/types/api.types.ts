/**
 * Standard API error response from backend
 */
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

/**
 * RTK Query error shape
 */
export interface RtkQueryError {
  status: number;
  data?: ApiError;
}

/**
 * Type guard to check if an error is an RTK Query error
 */
export function isRtkQueryError(error: unknown): error is RtkQueryError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as RtkQueryError).status === 'number'
  );
}

/**
 * Extract error message from RTK Query error
 */
export function getErrorMessage(error: unknown, defaultMessage = 'Something went wrong'): string {
  if (isRtkQueryError(error)) {
    return error.data?.message || defaultMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
}

