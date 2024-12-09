
import Button from '@/app/components/button';
import CardTransaction, { CardTranscationValue } from '../../../components/cardTransaction';
import './listTransaction.css';

type PropsPagination = {
    currentPage: number
    maxPage: number
    previous: () => void
    next: () => void
}

function Pagination({currentPage, maxPage, previous, next} : PropsPagination) {
    return (
        <div className="flex justify-between">
            {
                currentPage === 1 && maxPage <=1 ? 
                <></>
                :
                <>
                    {
                        currentPage === 1 ? 
                        <>
                            <div></div>
                            <Button backgroundColor="#6755D7" colorText="white" title="Suivant" onClick={next}/>
                        </>
                        :
                        <>
                            {
                                currentPage == maxPage ?
                                <>
                                    <Button backgroundColor="#313343" colorText="white" title="Precedent" onClick={previous} />
                                </>
                                :
                                <>
                                    <Button backgroundColor="#313343" colorText="white" title="Precedent" onClick={previous} />
                                    <Button backgroundColor="#6755D7" colorText="white" title="Suivant" onClick={next}/>
                                </>
                            }
                        </>
                    }
                </>
            }
        </div>
    )
}

type PropsList = {
    transactions: CardTranscationValue[],
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

function ListTransaction({transactions, onEdit, onDelete} : PropsList) {
    return (
        <div>
            {
                transactions.map((transaction, key) => <CardTransaction key={key} transaction={transaction} onEdit={() => onEdit(transaction.transactionId)} onDelete={() => onDelete(transaction.transactionId)} />)
            }
        </div>
    )
}

type Props = PropsList & PropsPagination

export default function TransactionPaginations({transactions, onEdit, onDelete, currentPage, maxPage, next, previous}: Props) {
    return (
        <>
            <ListTransaction 
                transactions={transactions} onEdit={onEdit} onDelete={onDelete} />
            <Pagination currentPage={currentPage} maxPage={maxPage} previous={previous} next={next} />   
        </>
    )
}