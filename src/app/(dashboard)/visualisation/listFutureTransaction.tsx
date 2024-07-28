

import './listTransaction.css';
import CardFutureTransaction from '@/app/components/cardFutureTransaction';
import { FutureTransaction } from '@/core/entities/future_transaction';

export default function ListFutureTransaction({futureTransactions, onEdit, onDelete} : {futureTransactions: FutureTransaction[], onEdit: any, onDelete: any}) {
    return (
        <div>
            {
                futureTransactions.map((futureTransaction, key) => <CardFutureTransaction key={key} futureTransaction={futureTransaction} onEdit={() => onEdit(futureTransaction)} onDelete={() => onDelete(futureTransaction.id)} />)
            }
        </div>
    )
}