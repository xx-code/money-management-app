import './index.css';
import {TransactionType} from '../../../core/entities/transaction';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tag from '../tag';
import { FutureTransaction } from '@/core/entities/future_transaction';
import { periodsFrench } from '@/core/entities/libs';
// @ts-ignore
library.add(fas);


export default function CardFutureTransaction({futureTransaction, onEdit, onDelete} : {futureTransaction: FutureTransaction, onEdit: any, onDelete:any}) {
    return (
        <div className="card-transaction">
            <div className="card-transaction-content">
                <div className='card-transction-content-icon'>
                    <div className="card-transaction-icon">
                        <div className="icon">
                            {
                                futureTransaction.category.title === 'Transfert' ?
                                <FontAwesomeIcon className="icon-in" icon={["fas", "right-left"]} />
                                :
                                // @ts-ignore
                                <FontAwesomeIcon className="icon-in" icon={futureTransaction.category.icon} />
                            }
                        </div>
                    </div>
                    <div className="card-transaction-info">
                        <h3>{ futureTransaction.category.title }</h3>
                        <p>{ futureTransaction.record.description }</p>
                        <p>{ 'Chaque ' + futureTransaction.period_time + ' ' + futureTransaction.period }</p>
                    </div>
                    <div className='ml-1'>
                       <div className='flex flex-wrap'>
                            {
                                futureTransaction.tags.map((tag, index) => <Tag key={index} title={tag} onDelete={undefined} color={undefined}/>) 
                            }
                        </div>   
                    </div>
                    
                </div>
                
                <div className="card-transaction-price">
                    {
                        futureTransaction.record.type === TransactionType.Credit ?
                            <h4>${futureTransaction.record.price}</h4>
                        :
                            <h4>-${futureTransaction.record.price}</h4>
                    }
                    <h5>Date du prochain payment: {futureTransaction.date_update.toString()}</h5>
                    <h5>Fin de payment: {futureTransaction.date_end ? futureTransaction.date_end.toString() : 'Illimite'}</h5>
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