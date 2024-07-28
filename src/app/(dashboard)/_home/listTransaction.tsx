
import { Transaction } from '@/core/entities/transaction';
import CardTransaction from '../../components/cardTransaction';
import './listTransaction.css';

export default function ListTransaction({transactions, onEdit, onDelete} : {transactions: Transaction[], onEdit: any, onDelete: any}) {
    return (
        <div>
            {
                transactions.map((transaction, key) => <CardTransaction key={key} transaction={transaction} onEdit={() => onEdit(transaction)} onDelete={() => onDelete(transaction.id)} />)
            }
        </div>
    )
}