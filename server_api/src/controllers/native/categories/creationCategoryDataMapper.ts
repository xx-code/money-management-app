import { Request } from 'express';
import { ValidationError } from '../../../interactions/errors/validationError';
import { RequestCreationCategoryUseCase } from '../../../interactions/category/creationCategoryUseCase';


export class CreationCategoryUseCaseDataMapper {
    extract(request: Request): RequestCreationCategoryUseCase {
        let body = request.body;

        if (body.title == undefined) {
            throw new ValidationError('Title field is empty');
        }

        if (body.icon == undefined) {
            throw new ValidationError('Icon field is empty');
        }

        return {
            title: body.title,
            icon: body.icon
        }
    }
}