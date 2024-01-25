import { Request } from 'express';
import { RequestUpdateTagBudget, RequestpdateCategoryBudget } from "../../../interactions/budgets/updateBudgetUseCase";
import { ValidationError } from '../../../interactions/errors/validationError';
import { Period } from '../../../entities/budget';

export class UpdateBudgetTagUseCaseDataMapper  {
    extract(req: Request): RequestUpdateTagBudget {
        let body = req.body;

        let request: RequestUpdateTagBudget = {
            id: req.params.id,
            title: null,
            target: null,
            tags: null,
            date_start: null,
            date_end: null
        };

        if (body.title != undefined) {
            request.title = body.title;
        }

        if (body.target != undefined) {
            request.target = Number(body.target);
        }

        if (body.dateStart != undefined) {
            if (isNaN(new Date(body.dateStart).getTime())) {
                throw new ValidationError('Date start is not valid');
            }
            request.date_start = new Date(body.dateStart);
        }

        if (body.dateEnd != undefined) {
            if (isNaN(new Date(body.dateEnd).getTime())) {
                throw new ValidationError('Date end is not valid');
            }
            request.date_end = new Date(body.dateEnd);
        }

        if (body.tags != undefined) {
            request.tags = body.tags
        }

        return request;
    }
}

export class UpdateBudgetCategoryUseCaseDataMapper  {
    extract(req: Request): RequestpdateCategoryBudget {
        let body = req.body;

        let request: RequestpdateCategoryBudget = {
            id: req.params.id,
            title: null,
            target: null,
            period: null,
            period_time: null,
            categories: null
        };

        if (body.title != undefined) {
            request.title = body.title;
        }

        if (body.target != undefined) {
            request.target = Number(body.target);
        }

        if (body.periodTime != undefined) {
            if (isNaN(Number(body.periodTime))) {
                throw new ValidationError('Period time must be a number');
            }
            request.period_time = Number(body.periodTime);
        }

        if (body.period != undefined) {
            let period = null;
            switch(body.period.toUpperCase()) {
                case 'DAY': {
                    period = Period.Day;
                    break;
                }
                case 'MONTH': {
                    period = Period.Month;
                    break;
                }
                case 'WEEK': {
                    period = Period.Week;
                    break;
                }
                case 'YEAR': {
                    period = Period.Year;
                    break;
                }
                default: {
                    throw new ValidationError('Period must be a Day, Week, Month, Year');
                }
            }
            request.period = period;
        }

        if (body.categories != undefined) {
            request.categories = body.categories
        }

        return request;
    }
}