import './index.css';
import {Transaction, TransactionType} from '../../../core/entities/transaction';

export default function CardTransaction({transaction} : {transaction: Transaction}) {
    return (
        <div className="card-transaction">
            <div className="card-transaction-content">
                <div className='card-transction-content-icon'>
                    <div className="card-transaction-icon">
                        <div className="icon">
                            <div className="icon-in"></div>
                        </div>
                    </div>
                    <div className="card-transaction-info">
                        <h3>{ transaction.category.title }</h3>
                        <p>{ transaction.record.description }</p>
                    </div>  
                </div>
                
                <div className="card-transaction-price">
                    {
                        transaction.record.type === TransactionType.Credit ?
                            <h4>-${transaction.record.price}</h4>
                        :
                            <h4>${transaction.record.price}</h4>
                    }
                    <h5>{transaction.record.date.toString()}</h5>
                </div>
            </div>
        </div>
    )
}