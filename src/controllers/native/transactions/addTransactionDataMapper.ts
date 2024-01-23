import { Request } from 'express';
import { RequestAddTransactionUseCase } from '../../../interactions/transaction/addTransactionUseCase';
import { ValidationError } from '../../../interactions/errors/validationError';
import { TransactionType } from '../../../entities/transaction';

export class AddTransactionRequestDataMapper {
    extract(req: Request): RequestAddTransactionUseCase{
        let body = req.body;

        if (body.description == undefined) {
            throw new ValidationError('Description field is empty');
        }  

        if (body.account_id == undefined) {
            throw new ValidationError('Account id field is empty');
        }

        if (body.price == undefined) {
            throw new ValidationError('Price field is empty');
        }

        if (body.date == undefined) {
            throw new ValidationError('Date field is empty');
        }

        if (body.type == undefined) {
            throw new ValidationError('Type field is empty');
        }

        if (body.category_id == undefined) {
            throw new ValidationError('Category id field is empty');
        }

        let tag = null;
        if (body.tag_id == undefined) {
            tag = body.tag;
        }

        if (isNaN(new Date(body.date).getTime())) {
            throw new ValidationError('Date is not valid');
        }

        if (isNaN(Number(body.price))) {
            throw new ValidationError('Price must be a number');
        }

        let type = body.type;

       switch(body.type) {
        case 'Credit': {
            type = TransactionType.Credit;
            break;
        }
        case 'Debit': {
            type = TransactionType.Debit;
            break;
        }
        default: {
            throw new ValidationError('Type transacation must be a Credit or Debit');
        }
       }

        return {
            account_ref: body.account_id,
            price: Number(body.price),
            description: body.description,
            date: new Date(body.date),
            category_ref: body.category_id,
            tag_ref: tag,
            type: type
        }
    }
}