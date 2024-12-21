import './index.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tag from '../tag';
import matchSystemIcon from '@/app/_utils/matchSystemIcon';
import { TransactionType } from '@/core/domains/entities/transaction';
import { Money } from '@/core/domains/helpers';
// @ts-ignore
library.add(fas);

export type CardTranscationValue = {
    transactionId: string
    description: string 
    type: TransactionType
    amount: Money
    category: {category_id: string, title: string, icon: string, color: string|null}
    tags: {tag_id: string, value: string, color: string|null}[]
    date: string 
}

type Props = {
    transaction: CardTranscationValue
    onEdit: () => void 
    onDelete: () => void
}

export default function CardTransaction({transaction, onEdit, onDelete} : Props) {

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
                        <p>{ transaction.description }</p>
                    </div>
                    <div className='ml-1'>
                       <div className='flex flex-wrap'>
                            {
                                transaction.tags.map((tag, index) => <Tag key={index} title={tag.value} onDelete={undefined} color={tag.color}/>) 
                            }
                        </div>   
                    </div>
                    
                </div>
                
                <div className="card-transaction-price">
                    {
                        transaction.type === TransactionType.CREDIT ?
                            <h4>{transaction.amount.toString()}</h4>
                        :
                            <h4>{ "-" + transaction.amount.toString()}</h4>
                    }
                    <h5>{transaction.date}</h5>
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