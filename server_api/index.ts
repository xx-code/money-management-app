import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
// import AccountRouter from '../../server_api/src/controllers/native/accounts/router';
// import TransactionRouter from '../../server_api/src/controllers/native/transactions/router';
// import CategoryRouter from '../../server_api/src/controllers/native/categories/router';
// import TagRouter from '../../server_api/src/controllers/native/tag/router';
// import BudgetRouter from '../../server_api/src/controllers/native/budgets/router';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// app.use('/account', AccountRouter);
// app.use('/transaction', TransactionRouter);
// app.use('/category', CategoryRouter);
// app.use('/tag', TagRouter);
// app.use('/budget', BudgetRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + Typescript ');
}); 

app.listen(port, () => {
  console.log('[server]: Sever is running at http://localhost:${port}');
});