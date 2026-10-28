import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // CORS headerlarini har qanday holatda, hatto xatolik yuz berganda ham kafolatlash
    const origin = request.headers.origin;
    if (origin) {
      response.header('Access-Control-Allow-Origin', origin);
      response.header('Access-Control-Allow-Credentials', 'true');
      response.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      response.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,X-Requested-With');
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ichki server xatoligi yuz berdi';
    let code = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, any>;
        if (resObj.error && typeof resObj.error === 'object' && resObj.error.code) {
          message = resObj.message || resObj.error.message;
          code = resObj.error.code;
        } else if (Array.isArray(resObj.message)) {
          message = resObj.message.join(', ');
        } else if (resObj.message) {
          message = resObj.message;
        }

        if (resObj.code) {
          code = resObj.code;
        } else if (!code || code === 'INTERNAL_SERVER_ERROR') {
          code = this.getErrorCodeFromStatus(status);
        }
      }
    } else if (exception && typeof exception === 'object' && (exception as any).code === '23505') {
      // PostgreSQL takroriy kalit (Unique constraint violation)
      status = HttpStatus.CONFLICT;
      message = 'Bunday ID yoki ma’lumot bazada allaqachon mavjud (takroriy kalit)';
      code = 'CONFLICT';
    } else if (exception instanceof Error) {
      message = exception.message || message;
    }

    response.status(status).json({
      message,
      error: {
        message,
        code,
      },
    });
  }

  private getErrorCodeFromStatus(status: number): string {
    switch (status) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      case 422:
        return 'UNPROCESSABLE_ENTITY';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }
}
