import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost, AbstractHttpAdapter } from "@nestjs/core";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

    private httpAdapter: AbstractHttpAdapter;

    constructor(adapterHost: HttpAdapterHost) {
        this.httpAdapter = adapterHost.httpAdapter;
    }

    catch(exception: Error, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const request = context.getRequest();
        const response = context.getResponse();

        const { status, body } = exception instanceof HttpException 
            ? {
                status: exception.getStatus(),
                body: exception.getResponse()
            }
            : {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                body: {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    timestamp: new Date().toISOString(),
                    message: exception.message,
                    path: request.path
                }
            };
        
        this.httpAdapter.reply(response, body, status);
    }

}