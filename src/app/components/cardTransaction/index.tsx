import './index.css';
import {Transaction, TransactionType} from '../../../core/entities/transaction';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tag from '../tag';
import matchSystemIcon from '@/app/_utils/matchSystemIcon';
// @ts-ignore
library.add(fas);


export default function CardTransaction({transaction, onEdit, onDelete} : {transaction: Transaction, onEdit: any, onDelete:any}) {
    return (
        <div className="card-transaction">
            <div className="card-transaction-content">
                <div className='card-transction-content-icon'>
                    <div className="card-transaction-icon">
                        <div className="icon">
                            {
                                // @ts-ignore
                                <FontAwesomeIcon className="icon-in" icon={matchSystemIcon(transaction.category.icon)} />
                            }
                        </div>
                    </div>
                    <div className="card-transaction-info">
                        <h3>{ transaction.category.title }</h3>
                        <p>{ transaction.record.description }</p>
                    </div>
                    <div className='ml-1'>
                       <div className='flex flex-wrap'>
                            {
                                transaction.tags.map((tag, index) => <Tag key={index} title={tag} onDelete={undefined} color={undefined}/>) 
                            }
                        </div>   
                    </div>
                    
                </div>
                
                <div className="card-transaction-price">
                    {
                        transaction.record.type === TransactionType.Credit ?
                            <h4>${transaction.record.price}</h4>
                        :
                            <h4>-${transaction.record.price}</h4>
                    }
                    <h5>{transaction.record.date.toString()}</h5>
                </div>
            </div>
            <div className='card-transaction-edit flex'>
                <div className='edit-btn' style={{backgroundColor: "#313343"}} onClick={onEdit}>
                    <FontAwesomeIcon icon={['fas', 'pen']} style={{fontSize: '10px'}} /> 
                </div>
                <div className='edit-btn' style={{backgroundColor: "#DC4C4C"}} onClick={onDelete}>
                    <FontAwesomeIcon icon={['fas', 'trash']} style={{fontSize: '10px'}}  />
                </div>
            </div>
        </div>
    )
}