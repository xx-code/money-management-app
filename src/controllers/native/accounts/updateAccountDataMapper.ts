import { ValidationError } from '../../../interactions/errors/validationError';
import { Request } from 'express';
import { RequestUpdateAccountUseCase } from '../../../interactions/account/updateAccountUseCase';

export class UpdateAccountRequestDataMapper {
    extract(request: Request): RequestUpdateAccountUseCase {
        let body = request.body;
        if (request.params.id == undefined) {
            throw new ValidationError('Id field must not be empty');
        }

        let data: RequestUpdateAccountUseCase = {
            id: request.params.id,
            title: null,
            credit_limit: null,
            credit_value: null
        };

        if (body.title != undefined) {
            data.title = body.title;
        }

        if (body.credit_value != undefined) {
            if (isNaN(Number(body.credit_value))) {
                throw new ValidationError('Credit value must be a number');
            }
            data.credit_value = body.credit_value;
        }

        if (body.credit_limit != undefined) {
            if (isNaN(Number(body.credit_limit))) {
                throw new ValidationError('Credit value must be a number');
            }   
            data.credit_limit == body.credit_limit;
        }

        return data;
    }
}