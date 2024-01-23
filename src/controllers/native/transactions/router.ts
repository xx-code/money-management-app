import { Router, Request, Response } from 'express';
import { AddTransactionRequestDataMapper } from './addTransactionDataMapper';
import { AddTransactionUseCase } from '../../../interactions/transaction/addTransactionUseCase';
import { CrytoGraphie } from '../utils/cryto';
import { accountRepository, categoryRepository, tagRepository, transactionRepository } from '../resources/initInMemoryRepository';
import { GetTagUseCase } from '../../../interactions/tag/getTagUseCase';
import { NotFoundError } from '../../../interactions/errors/notFoundError';
import { CreationTagUseCase } from '../../../interactions/tag/creationTagUseCase';
import { GetAccountUseCase } from '../../../interactions/account/getAccountUseCase';
import { GetTransactionUseCase } from '../../../interactions/transaction/getTransactionUseCase';
import { GetCategoryUseCase } from '../../../interactions/category/getCategoryUseCase';
import { GetPaginationTransaction } from '../../../interactions/transaction/getPaginationTransactionUseCase';
import { GetPaginationTransactionUseCaseDataMapper } from './getPaginationTransacationDataMapper';
import { UpdateTransactionUseCaseDataMapper } from './updateTransactionDataMapper';
import { UpdateTransactionUseCase } from '../../../interactions/transaction/updateTransactionUseCase';
import { DeleteTransactionUseCase } from '../../../interactions/transaction/deleteTransactionUseCase';

const router = Router();

function verifyIfCategoryExist(category_ref: string): void {
    let category = new GetCategoryUseCase(categoryRepository);
    category.execute(category_ref);
}

function verifyIfTagExist(tag_ref: string, res: Response): void {
    try {
        let getTag = new GetTagUseCase(tagRepository);
        getTag.execute(tag_ref);
    } catch(error: any) {
        if (error instanceof NotFoundError) {
            let creationNewTag = new CreationTagUseCase(tagRepository);
            creationNewTag.execute(tag_ref);
        } else {
            res.status(400).send(error.message);
        }
    }
}

router.post('/', (req: Request, res: Response) => {
    try {
        let dataMapper = new AddTransactionRequestDataMapper();
        let addNewTransaction = new AddTransactionUseCase(transactionRepository, new CrytoGraphie());

        let data = dataMapper.extract(req);

        // verify use exist
        let getAccount = new GetAccountUseCase(accountRepository);
        getAccount.execute(data.account_ref);

        // verify category exist
        verifyIfCategoryExist(data.category_ref);

        // Creation of new tag if is not exist
        if (data.tag_ref != null) {
            verifyIfTagExist(data.tag_ref, res);
        }

        let response = addNewTransaction.execute(data);
        res.status(400).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

router.get('/:id', (req: Request, res: Response) => {
    try {
        let usecase = new GetTransactionUseCase(transactionRepository);
        let response = usecase.execute(req.params.id);
        res.status(201).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

router.get('/', (req: Request, res: Response) => {
    try {
        let dataMapper = new GetPaginationTransactionUseCaseDataMapper();
        let usecase = new GetPaginationTransaction(transactionRepository);
        let data = dataMapper.extract(req);

        let response = usecase.execute(data);

        res.status(201).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

router.put('/:id', (req: Request, res: Response) => {
    try {
        let dataMapper = new UpdateTransactionUseCaseDataMapper();
        let usecase = new UpdateTransactionUseCase(transactionRepository);
        let data = dataMapper.extract(req);

        // verify category exist
        if (data.category_ref != null) {
            verifyIfCategoryExist(data.category_ref);
        }

        // Creation of new tag if is not exist
        if (data.tag_ref != null) {
            verifyIfTagExist(data.tag_ref, res);
        }

        let response = usecase.execute(data);

        res.status(201).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

router.delete('/:id', (req: Request, res: Response) => {
    try {
        let usecase = new DeleteTransactionUseCase(transactionRepository);
        let response = usecase.execute(req.params.id);  
        
        res.status(201).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

export default router;
