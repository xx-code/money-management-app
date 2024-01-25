import { Router, Request, Response } from 'express';
import { CreationAccountRequestMapper } from './creationAccountDataMapper'; 
import { CreationAccountUseCase } from '../../../interactions/account/creationAccountUseCase';
import { CrytoGraphie } from '../utils/cryto';
import { accountRepository } from '../resources/initInMemoryRepository';
import { GetAccountUseCase } from '../../../interactions/account/getAccountUseCase';
import { GetAllAccountUseCase } from '../../../interactions/account/getAllAccountUseCase';
import { UpdateAccountRequestDataMapper } from './updateAccountDataMapper';
import { UpdateAccountUseCase } from '../../../interactions/account/updateAccountUseCase';

const router = Router();

router.post('/', (req: Request, res: Response) => {
    try {
        let dataMapper = new CreationAccountRequestMapper();
        let data = dataMapper.extract(req);

        let usecase = new CreationAccountUseCase(accountRepository, new CrytoGraphie());

        let response = usecase.execute(data);
        
        res.status(201).send(response);
    } catch(err: any) {
        res.status(400).send(err.message);
    }
});

router.get('/:id', (req: Request, res: Response) => {
    try {
        let id = req.params.id;

        let usecase = new GetAccountUseCase(accountRepository);
        let response = usecase.execute(id);

        res.status(201).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});


router.get('/', (_: Request, res: Response) => {
    try {
        let usecase = new GetAllAccountUseCase(accountRepository);
        let response = usecase.execute();

        res.status(201).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

router.put('/:id', (req: Request, res: Response) => {
    try {
        let dataMapper = new UpdateAccountRequestDataMapper();
        let data = dataMapper.extract(req);

        let usecase = new UpdateAccountUseCase(accountRepository);
        let response = usecase.execute(data);

        res.status(201).send(response);
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

router.delete('/', (req: Request, res: Response) => {
    try {
        
    } catch (error: any) {
        res.status(400).send(error.message);
    }
});

export default router;