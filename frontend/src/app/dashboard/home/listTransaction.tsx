import CardTransaction from '@/app/components/cardTransaction';
import './listTransaction.css';

export default function ListTransaction({transactions} : {transactions: Array<any>}) {
    return (
        <div>
            {
                transactions.map((transaction, key) => <CardTransaction key={key} />)
            }
        </div>
    )
}