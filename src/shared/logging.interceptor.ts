
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    Logger.log('Before...');
    const req = context.switchToHttp().getRequest();
    const now = Date.now();

    Logger.log('interceptor log!!!');
    return next
      .handle()
      .pipe(
        tap(() => Logger.log(`After... ${req.url + ' ' + req.method} ${Date.now() - now}mss`)),
      );
  }
}
