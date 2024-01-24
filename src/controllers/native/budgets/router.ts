import {Router, Request, Response} from 'express';
import { CreateBudgetCategoryUseCaseDataMapper, CreateBudgetTagUseCaseDataMapper } from './createBudgetUseCaseDataMapper';
import { CreationBudgetCategoryUseCase, CreationBudgetTagUseCase } from '../../../interactions/budgets/creationBudgetUseCase';
import { budgetCategoryRepository, budgetTagRepository, categoryRepository, tagRepository } from '../resources/initInMemoryRepository';
import { CrytoGraphie } from '../utils/cryto';
import { GetBudgetCategoryUseCase, GetBudgetTagUseCase } from '../../../interactions/budgets/getBudgetUseCase';
import { GetAllBudgetCategoryUseCase, GetAllBudgetTagUseCase } from '../../../interactions/budgets/getAllBudgetUseCase';
import { UpdateBudgetCategoryUseCase, UpdateBudgetTagUseCase } from '../../../interactions/budgets/updateBudgetUseCase';
import { UpdateBudgetCategoryUseCaseDataMapper, UpdateBudgetTagUseCaseDataMapper } from './updateBudgetUseCaseDateMapper';
import { DeleteBudgetCategoryUseCase, DeleteBudgetTagUseCase } from '../../../interactions/budgets/deleteBudgetUseCase';
import { GetTagUseCase } from '../../../interactions/tag/getTagUseCase';
import { GetCategoryUseCase } from '../../../interactions/category/getCategoryUseCase';

const router = Router();

function verifyIfCategoryExist(category_ref: string): void {
    let category = new GetCategoryUseCase(categoryRepository);
    category.execute(category_ref);
}

function verifyIfTagExist(tag_ref: string): void {
    let tag = new GetTagUseCase(tagRepository);
    tag.execute(tag_ref);
}

// Tags 
router.post('/tag', (req: Request, res: Response) => {
    try {
        let dataMapper = new CreateBudgetTagUseCaseDataMapper();
        let data = dataMapper.extract(req);

        for (let tag of data.tags) {
            verifyIfTagExist(tag);
        }
 
        let usecase = new CreationBudgetTagUseCase(budgetTagRepository, new CrytoGraphie());
        let response = usecase.execute(data);

        res.status(201).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

router.get('/tag/:id', (req: Request, res: Response) => {
    try {
        let usecase = new GetBudgetTagUseCase(budgetTagRepository);
        let response = usecase.execute(req.params.id);

        res.status(201).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

router.get('/tags', (req: Request, res: Response) => {
    try {
        let usecase = new GetAllBudgetTagUseCase(budgetTagRepository);
        let response = usecase.execute();

        res.status(201).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

router.put('/tag/:id', (req: Request, res: Response) => {
    try {
        let dataMapper = new UpdateBudgetTagUseCaseDataMapper();
        let data = dataMapper.extract(req);

        if (data.tags != null) {
            for (let tag of data.tags!) {
                verifyIfTagExist(tag);
            }
        }

        let usecase = new UpdateBudgetTagUseCase(budgetTagRepository);
        let response = usecase.execute(data);

        res.status(201).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

router.delete('/tag/:id', (req: Request, res: Response) => {
    try {
        let usecase = new DeleteBudgetTagUseCase(budgetTagRepository);
        let response = usecase.execute(req.params.id);

        res.status(201).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

// Category
router.post('/category', (req: Request, res: Response) => {
    try {
        let dataMapper = new CreateBudgetCategoryUseCaseDataMapper();
        let data = dataMapper.extract(req);

        for (let category of data.categories) {
            verifyIfCategoryExist(category);
        }

        let usecase = new CreationBudgetCategoryUseCase(budgetCategoryRepository, new CrytoGraphie());
        let response = usecase.execute(data);

        res.status(201).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

router.get('/category/:id', (req: Request, res: Response) => {
    try {
        let usecase = new GetBudgetCategoryUseCase(budgetCategoryRepository);
        let response = usecase.execute(req.params.id);

        res.status(201).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

router.get('/categories', (req: Request, res: Response) => {
    try {
        let usecase = new GetAllBudgetCategoryUseCase(budgetCategoryRepository);
        let response = usecase.execute();

        res.status(201).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

router.put('/category/:id', (req: Request, res: Response) => {
    try {
        let dataMapper = new UpdateBudgetCategoryUseCaseDataMapper();
        let data = dataMapper.extract(req);

        if (data.categories != null) {
            for (let category of data.categories) {
                verifyIfCategoryExist(category);
            }
        }

        let usecase = new UpdateBudgetCategoryUseCase(budgetCategoryRepository);
        let response = usecase.execute(data);

        res.status(201).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

router.delete('/category/:id', (req: Request, res: Response) => {
    try {
        let usecase = new DeleteBudgetCategoryUseCase(budgetCategoryRepository);
        let response = usecase.execute(req.params.id);

        res.status(201).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

export default router;