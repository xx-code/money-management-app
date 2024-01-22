import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import AccountRouter from '../src/controllers/native/accounts/router';
import TransactionRouter from '../src/controllers/native/transactions/router';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/account', AccountRouter);
app.use('/transaction', TransactionRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + Typescript ');
}); 

app.listen(port, () => {
  console.log('[server]: Sever is running at http://localhost:${port}');
});