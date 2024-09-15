export interface Response<T> {
  result: T;
  success: boolean;
  errorMessages: string[];
  statusCode: number;
}
