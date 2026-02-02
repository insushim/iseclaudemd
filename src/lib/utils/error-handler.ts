/**
 * Error Handler Utility Module
 * 에러 처리를 표준화하는 유틸리티
 */

export function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function createErrorResponse(context: string, error: unknown): string {
  const errorMessage = handleError(error);
  return `❌ ${context} 오류: ${errorMessage}`;
}
