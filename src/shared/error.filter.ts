import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Inject, Logger as NestLogger} from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from 'winston';
import { MongoError } from 'mongodb';
import { ValidationError } from 'class-validator';
import { Error } from 'mongoose';
import * as responses from './../config/keys/responses.json';

interface ErrorField {
    param: string;
    message: string | null;
}

@Catch()
export class ErrorFilter implements ExceptionFilter {
    // errors = [];

    constructor(@Inject('winston') private readonly logger: Logger) {}
    catch(exception: HttpException | MongoError | Error.ValidationError | string | any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response: Response = ctx.getResponse();
        const request: Request = ctx.getRequest();
        let stackNeeded = false;

        const res = {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            path: request.url,
            type: request.method,
            message: 'נראה שקיימת שגיאה',
            errors: [],
        };

        if (typeof exception === 'string') {
            res.message = exception;
            res.statusCode = 400;

        } else if (exception instanceof HttpException) {
            res.statusCode = exception.getStatus();
            if (Array.isArray(exception.message.message))
                res.errors = this.formatValidatorClass(exception.message.message);

        } else if (exception instanceof Error.ValidationError) {
            res.errors = this.formatValidatorMongoose(exception.errors);

        } else if (exception instanceof MongoError) {
            if (exception.code === 11000) { // for unique value in DB
                const err: ErrorField = {
                    param: exception.errmsg.split('index:')[1].split('_1 dup key')[0].trim(),
                    message: 'כבר נמצא בשימוש',
                };
                res.errors.push(err);
            }
        } else {
            stackNeeded = true;
        }

        this.logger.error({...res, stack: stackNeeded ? exception.stack : null});
        return response.status(res.statusCode).json(res);
    }

    formatValidatorClass(errors: any[]) {
        const formatedErrors = [];
        for (const msg of errors) {
            if (msg as any instanceof ValidationError) {
                const message = Object.values(msg.constraints).join('. ');
                const err = {param: msg.property, message};
                formatedErrors.push(err);
            }
        }
        return formatedErrors;
    }

    formatValidatorMongoose(errors: {[path: string]: Error.ValidatorError | Error.CastError}) {
        const formatedErrors = [];
        for (const field in errors) {
            const error = errors[field];
            const errType = error.kind;
            const err: ErrorField = {
                param: error.path,
                message: null,
            };
            switch (errType) {
                case 'user defined':
                    err.message = error.message;
                    break;
                case 'maxlength':
                case 'minlength':
                    if (error instanceof Error.ValidatorError)
                        err.message = responses[errType] + error.properties[errType];
                    break;
                default:
                    err.message = responses[errType];
                    break;
            }
            formatedErrors.push(err);
        }
        return formatedErrors;
    }
}
