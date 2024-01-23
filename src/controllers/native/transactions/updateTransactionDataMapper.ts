import { ValidationError } from '../../../interactions/errors/validationError';
import { Request } from 'express';
import { RequestUpdateTransactionUseCase } from '../../../interactions/transaction/updateTransactionUseCase';
import { TransactionType } from '../../../entities/transaction';

export class UpdateTransactionUseCaseDataMapper {
    extract(request: Request): RequestUpdateTransactionUseCase {
        let body = request.body;
        if (request.params.id == undefined) {
            throw new ValidationError('Id field must not be empty');
        }

        let data: RequestUpdateTransactionUseCase = {
            id: request.params.id,
            tag_ref: null,
            category_ref: null,
            description: null,
            date: null,
            price: null,
            type: null
        };

        if (body.tag_id != undefined) {
            data.tag_ref = body.tag_id;
        }

        if (body.category_id != undefined) {
            data.category_ref = body.category_id;
        }

        if (body.date != undefined) {
            if (isNaN(new Date(body.date).getTime())) {
                throw new ValidationError('Date is not valid');
            }
            data.date = body.date;
        }

        if (body.description != undefined) {
            data.description = body.description;
        }

        if (body.type != undefined) {
            switch(body.type) {
                case 'Credit': {
                    data.type = TransactionType.Credit;
                    break;
                }
                case 'Debit': {
                    data.type = TransactionType.Debit;
                    break;
                }
                default: {
                    throw new ValidationError('Type transacation must be a Credit or Debit');
                }
            }
        }


        if (body.price != undefined) {
            if (isNaN(Number(body.price))) {
                throw new ValidationError('Pice value must be a number');
            }   
            data.price = Number(body.price);
        }

        return data;
    }
}