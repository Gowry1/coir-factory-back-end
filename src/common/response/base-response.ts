export class BaseResponse {
  status: string;
  statusCode: string;
  message: string;

  constructor(status: string, statusCode: string, message: string) {
    this.status = status;
    this.statusCode = statusCode;
    this.message = message;
  }
}
