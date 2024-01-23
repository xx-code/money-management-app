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
import { DeleteAccountUseCase } from '../../../interactions/account/deleteAccountUseCase';
import { GetCategoryUseCase } from '../../../interactions/category/getCategoryUseCase';

const router = Router();

router.post('/', (req: Request, res: Response) => {
    try {
        let dataMapper = new AddTransactionRequestDataMapper();
        let addNewTransaction = new AddTransactionUseCase(transactionRepository, new CrytoGraphie());

        let data = dataMapper.extract(req);

        // verify use exist
        let getAccount = new GetAccountUseCase(accountRepository);
        getAccount.execute(data.account_ref);

        // verify category exist
        let category = new GetCategoryUseCase(categoryRepository);
        category.execute(data.category_ref);

        // Creation of new tag if is not exist
        if (data.tag_ref != null) {
            try {
                let getTag = new GetTagUseCase(tagRepository);
                getTag.execute(data.tag_ref);
            } catch(error: any) {
                if (error instanceof NotFoundError) {
                    let creationNewTag = new CreationTagUseCase(tagRepository);
                    creationNewTag.execute(data.tag_ref);
                } else {
                    res.status(400).send(error.message);
                }
            }
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

/*router.get('/', (req: Request, res: Response) => {
    try {
        let usecase = new GetPaginationTransaction(transactionRepository);
        let request: RequestGetPagination = {
            page: req.params.page,
            size: req.params.size,
            sort_by: req.params.sort_by,

        }
        usecase.execute();
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});*/

router.delete('/:id', (req: Request, res: Response) => {
    try {
        let usecase = new DeleteAccountUseCase(accountRepository);
        let response = usecase.execute(req.params.id);  
        
        res.status(201).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

export default router;
