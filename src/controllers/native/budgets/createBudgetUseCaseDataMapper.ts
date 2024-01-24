import { Request } from 'express';
import { CreationBudgetCategoryUseCaseRequest, CreationBudgetTagUseCaseRequest } from "../../../interactions/budgets/creationBudgetUseCase";
import { ValidationError } from '../../../interactions/errors/validationError';
import { Period } from '../../../entities/budget';

export class CreateBudgetTagUseCaseDataMapper  {
    extract(req: Request): CreationBudgetTagUseCaseRequest {
        let body = req.body;

        if (body.title == undefined) {
            throw new ValidationError('Title field is empty');
        }

        if (body.target == undefined) {
            throw new ValidationError('Target field is empty');
        }

        if (body.dateStart == undefined) {
            if (isNaN(new Date(body.dateStart).getTime())) {
                throw new ValidationError('Date start is not valid');
            }
        }

        if (body.dateEnd == undefined) {
            if (isNaN(new Date(body.dateEnd).getTime())) {
                throw new ValidationError('Date end is not valid');
            }
        }

        if (body.tags == undefined) {
            throw new ValidationError('tags field is empty');
        }

        return {
            title: body.title,
            target: Number(body.target),
            date_start: new Date(body.dateStart),
            date_end: new Date(body.dateEnd),
            tags: body.tags
        };
    }
}

export class CreateBudgetCategoryUseCaseDataMapper {
    extract(req: Request): CreationBudgetCategoryUseCaseRequest {
        let body = req.body;

        if (body.title == undefined) {
            throw new ValidationError('Title field is empty');
        }

        if (body.target == undefined) {
            throw new ValidationError('Target field is empty');
        }

        if (body.periodTime == undefined) {
            throw new ValidationError('Period time field is empty');
        }

        if (body.period == undefined) {
            throw new ValidationError('Period field is empty');
        }

        if (body.categories == undefined) {
            throw new ValidationError('Categories field is empty');
        }

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

        return {
            title: body.title,
            target: Number(body.target),
            period: period,
            period_time: Number(body.periodTime),
            categories: body.categories
        };
    }
}