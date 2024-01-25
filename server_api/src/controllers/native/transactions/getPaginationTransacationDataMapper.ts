import { Request } from 'express';
import { ValidationError } from '../../../interactions/errors/validationError';
import { TransactionType } from '../../../entities/transaction';
import { RequestGetPagination } from '../../../interactions/transaction/getPaginationTransactionUseCase';

export class GetPaginationTransactionUseCaseDataMapper {
    extract(req: Request): RequestGetPagination{
        let body = req.body;

        if (req.body.page == undefined) {
            throw new ValidationError('Page of pagination is empty');           
        }

        if (req.body.size == undefined) {
            throw new ValidationError('Size of pagination is empty');
        }

        let sortBy = null;
        if (body.sort_by != undefined) {
            sortBy = body.sort_by;
        }

        let sortSense = null;
        if (body.sort_sense != undefined) {
            sortSense = body.sort_sense;
        }

        if (isNaN(Number(req.body.page))) {
            throw new ValidationError('Page paramter must be a number');
        }

        if (isNaN(Number(req.body.size))) {
            throw new ValidationError('Size paramter must be a number');
        }


        let account_fitler = [];
        if (body.account_filter != undefined) {
            account_fitler = body.account_filter;
        }

        let category_filter = [];
        if (body.category_filter != undefined) {
            category_filter = body.category_filter;
        }

        let tag_filter = [];
        if (body.tag_filter != undefined) {
            tag_filter = body.tag_filter;
        }


        return {
            page: Number(req.body.page),
            size: Number(req.body.size),
            sort_by: sortBy,
            sort_sense: sortSense,
            account_filter: account_fitler,
            category_filter: category_filter,
            tag_filter: tag_filter
        }
    }
}