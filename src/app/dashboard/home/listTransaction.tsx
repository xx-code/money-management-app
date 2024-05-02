
import { Transaction } from '@/core/entities/transaction';
import CardTransaction from '../../components/cardTransaction';
import './listTransaction.css';

export default function ListTransaction({transactions} : {transactions: Array<Transaction>}) {
    return (
        <div>
            {
                transactions.map((transaction, key) => <CardTransaction key={key} transaction={transaction}/>)
            }
        </div>
    )
}