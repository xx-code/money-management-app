
import CardTransaction from '../../components/cardTransaction';
import './listTransaction.css';

export default function ListTransaction({transactions} : {transactions: Array<any>}) {
    return (
        <div>
            {
                transactions.map((key, transaction) => <CardTransaction />)
            }
        </div>
    )
}