import { Request, Response, Router } from 'express';
import { CreationCategoryUseCase } from '../../../interactions/category/creationCategoryUseCase';
import { categoryRepository } from '../resources/initInMemoryRepository';
import { CreationCategoryUseCaseDataMapper } from './creationCategoryDataMapper';
import { GetCategoryUseCase } from '../../../interactions/category/getCategoryUseCase';
import { GetAllCategoryUseCase } from '../../../interactions/category/getAllCategoryUseCase';
import { DeleteCategoryUseCase } from '../../../interactions/category/deleteCategoryUseCase';

const router = Router();

router.post('/', (req: Request, res: Response) => {
    try {
        let dataMapper = new CreationCategoryUseCaseDataMapper();
        let usecase = new CreationCategoryUseCase(categoryRepository);

        let response = usecase.execute(dataMapper.extract(req));

        res.status(201).send(response);
    } catch(error:any) {
        res.status(400).send(error.message);
    }
});

router.get('/:title', (req: Request, res: Response) => {
    try {
        let usecase = new GetCategoryUseCase(categoryRepository);
        
        let response = usecase.execute(req.params.title);

        res.status(201).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

router.get('/', (req: Request, res: Response) => { 
    try {
        let usecase = new GetAllCategoryUseCase(categoryRepository);
        let response = usecase.execute();
        res.status(201).send(response);   
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});


router.delete('/:title', (req: Request, res: Response) => {
    try {
        let usecase = new DeleteCategoryUseCase(categoryRepository);
        let response = usecase.execute(req.params.title);
        res.status(201).send(response);   
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

export default router;