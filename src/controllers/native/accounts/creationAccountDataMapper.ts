import { Request } from 'express';
import { CreationAccountUseCaseRequest } from '../../../interactions/account/creationAccountUseCase';
import { ValidationError } from '../../../interactions/errors/validationError';


export class CreationAccountRequestMapper {
    extract(request: Request): CreationAccountUseCaseRequest {
        let body = request.body;

        if (body.title == undefined) {
            throw new ValidationError('Title field is not define', 400);
        }

        if (body.credit_value == undefined) {
            throw new ValidationError('Credit value is not define', 400);
        }

        if (body.credit_limit == undefined) {
            throw new ValidationError('Credit limit is not define', 400);
        }

        if (isNaN(Number(body.credit_limit))) {
            throw new ValidationError('Credit value must be a number', 400);
        }

        if (isNaN(Number(body.credit_value))) {
            throw new ValidationError('Credit value must be a number', 400);
        }

        return {
            title: body.title,
            credit_limit: body.credit_limit,
            credit_value: body.credit_value
        }
        
    }
}