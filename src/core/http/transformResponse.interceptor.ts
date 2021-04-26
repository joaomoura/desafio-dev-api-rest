import { NestInterceptor, Injectable, ExecutionContext, CallHandler } from '@nestjs/common';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NestResponse } from './nestResponse';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {

    private httpAdapter: AbstractHttpAdapter;

    constructor(adapterHost: HttpAdapterHost) {
        this.httpAdapter = adapterHost.httpAdapter;
    }

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle()
                    .pipe(
                        map( (controllerResponse: NestResponse) => {
                            if (controllerResponse instanceof NestResponse) {
                                const contextt = context.switchToHttp();
                                const response = contextt.getResponse();
                                const { headers, status, body } = controllerResponse;

                                const headersNames = Object.getOwnPropertyNames(headers);

                                headersNames.forEach( headerName => {
                                    const headerValue = headers[headerName];
                                    this.httpAdapter.setHeader(response, headerName, headerValue);
                                });

                                this.httpAdapter.status(response, status);

                                return body;
                            }

                            return controllerResponse;
                        })
                    );
    }
}