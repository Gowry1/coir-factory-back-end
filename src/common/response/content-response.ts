import { BaseResponse } from './base-response';

export class ContentResponse<T> extends BaseResponse {
  result: Record<string, T> = {};

  constructor(
    key: string,
    dto: T,
    status: string,
    statusCode: string,
    message: string,
  ) {
    super(status, statusCode, message);
    this.result[key] = dto;
  }
}
