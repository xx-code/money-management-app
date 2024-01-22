import { Request, Response, Router } from 'express';
import { tagRepository } from '../resources/initInMemoryRepository';
import { CreationTagUseCase } from '../../../interactions/tag/creationTagUseCase';
import { ValidationError } from '../../../interactions/errors/validationError';
import { GetTagUseCase } from '../../../interactions/tag/getTagUseCase';
import { GetAllTagUseCase } from '../../../interactions/tag/getAllTagsUseCase';
import { DeleteTagUseCase } from '../../../interactions/tag/deleteTagUseCase';

const router = Router();

router.post('/', (req: Request, res: Response) => {
    try {
        // data mapper
        
        if (req.body.title == undefined) {
            throw new ValidationError('Title field is empty');
        }
        let titleTag = req.body.title;

        let usecase = new CreationTagUseCase(tagRepository);

        let response = usecase.execute(titleTag);

        res.status(201).send(response);
    } catch(error:any) {
        res.status(400).send(error.message);
    }
});

router.get('/:title', (req: Request, res: Response) => {
    try {
        let usecase = new GetTagUseCase(tagRepository);
        
        let response = usecase.execute(req.params.title);

        res.status(201).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

router.get('/', (req: Request, res: Response) => { 
    try {
        let usecase = new GetAllTagUseCase(tagRepository);
        let response = usecase.execute();
        res.status(201).send(response);   
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});


router.delete('/:title', (req: Request, res: Response) => {
    try {
        let usecase = new DeleteTagUseCase(tagRepository);
        let response = usecase.execute(req.params.title);
        res.status(201).send(response);   
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

export default router;