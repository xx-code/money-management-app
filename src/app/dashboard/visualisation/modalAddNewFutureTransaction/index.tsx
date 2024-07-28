import { Transaction, TransactionType, mapperTransactionType } from '@/core/entities/transaction';
import './index.css';
import { useState } from 'react';
import DateParser from '@/core/entities/date_parser';
import { is_empty } from '@/core/entities/verify_empty_value';
import { periodsFrench, search_in_array } from '@/core/entities/libs';
import { AccountDisplay } from '@/core/entities/account';
import axios from 'axios';
import { Category } from '@/core/entities/category';
import TextInput from '@/app/components/textInput';
import Button from '@/app/components/button';
import Modal from '@/app/components/modal';
import Tag from '@/app/components/tag';
import { typePeriods } from '@/core/entities/budget';
import { RequestAddFutureTransaction } from '@/core/interactions/futureTransaction/addFutureTransactionUseCase';
import { FutureTransaction } from '@/core/entities/future_transaction';
import { RequestUpdateFutureTransaction } from '@/core/interactions/futureTransaction/updateFutureTransactionUseCase';

interface ModalTransaction {
    isOpen: boolean,
    future_transaction: FutureTransaction|null,
    onClose: any,
    onAdd: any,
    categories: Category[],
    tags: string[],
    accounts: AccountDisplay[]
}

export function ModalAddNewFutureTransaction({isOpen, future_transaction, onClose, onAdd, accounts, categories, tags}: ModalTransaction){
    const [inputTransaction, setInputTransaction] = useState({account: '', price: 0, description: '', category: '', date: DateParser.now().toString(), period: '', periodTime: 1, repeat: 1,  tag: '', type: 'Credit'});
    const [errorInputTransaction, setErrorInputTransaction] = useState<{account: string|null, price: string|null, description: string|null, category: string|null, date: string|null, tag: string|null, period: string|null, periodTime: string|null, repeat: string|null}>({account: null, price: null, description: null, category: null, date: null, tag: null, period: null, periodTime: null, repeat: null});
    const [searchingCategories, setSearchingCategories] = useState<Category[]>(categories);
    const [searchingTags, setSearchingTags] = useState<string[]>(tags);
    const [selectedTagList, setSelectedTagList] = useState<string[]>([]);
    const [prevFutureTransaction, setPrevFutureTransaction] = useState(future_transaction);
    const [isRepeat, setIsRepeat] = useState(false);

    if (prevFutureTransaction !== future_transaction) {
        setPrevFutureTransaction(future_transaction);
        if (future_transaction !== null) {
            setInputTransaction({
                ...inputTransaction, 
                account: future_transaction.account.title, 
                type: future_transaction.record.type,
                category: future_transaction.category.title, 
                date: future_transaction.record.date.toString(),
                tag: '', 
                description: future_transaction.record.description, 
                price: future_transaction.record.price,
                // @ts-ignore
                period: periodsFrench[future_transaction.period],
                periodTime: future_transaction.period_time
            });
            setSelectedTagList(future_transaction.tags);
            if (future_transaction.repeat)
                setIsRepeat(true)
        }
    }

    function handleInputTransaction(event: any) {
        if (event.target.name === 'tag') {
            let tag_found = search_in_array(event.target.value, tags);
            setSearchingTags(tag_found);
        }
  
        if (event.target.name === 'category') {
            let categories_found = search_in_array(event.target.value, categories.map(category => category.title));
            setSearchingCategories(categories.filter(category => categories_found.includes(category.title)));
        }

        setInputTransaction({...inputTransaction, [event.target.name]: event.target.value})
    }

    function handleSelectInTransaction(name: any, value: any) {
        if (name === 'tag' && !is_empty(value) && !selectedTagList.includes(value)) {
            setSelectedTagList([...selectedTagList, value])
        } else if (name === 'category') {
            setInputTransaction({...inputTransaction, [name]: value});
        } else {
            setInputTransaction({...inputTransaction, [name]: value})
        }
    }
  
    function removeTagSelected(name: string) {
        let tags = Object.assign([], selectedTagList);
        tags.splice(tags.indexOf(name), 1);
        setSelectedTagList(tags);
    }


    function closeModalTransaction() {
        onClose();
        setErrorInputTransaction({account: null, price: null, description: null, category: null, date: null, tag: null, period: null, periodTime: null, repeat: null});
        setIsRepeat(false)
        setInputTransaction({account: '', price: 0, description: '', category: '', date: DateParser.now().toString(), tag: '', type: 'Credit', period: '', periodTime:0, repeat: 1});
        setSelectedTagList([]);
        setSearchingCategories(categories);
        setSearchingTags(tags);
    }

    async function submit_transaction() {
        try {
            let do_submit = true;
  
            let errors = {};
            let accountsList = accounts.map(account => account.title);
            
            if (!accountsList.includes(inputTransaction.account)) {
                errors = {...errors, account: 'Ce compte n\'existe pas'};
                do_submit = false;
            } else {
                errors = {...errors, account: null};
            }
  
            if (is_empty(inputTransaction.account)) {
                errors = {...errors, account: 'Ce champs ne doit pas etre vide'};
                do_submit = false;
            } else {
                errors = {...errors, account: null};
            }
            


            if (is_empty(inputTransaction.category)) {
                errors = {...errors, category: 'Ce champs ne doit pas etre vide'};
                do_submit = false;
            } else {
                errors = {...errors, category: null};
            }
            
            let category = categories.find(cat => cat.title === inputTransaction.category)

            if (category === undefined) {
                errors = {...errors, category: 'Cette categories n\'existe pas'};
                do_submit = false;
            } else {
                errors = {...errors, category: null};
            }
  
            
            if (is_empty(inputTransaction.description)) {
                errors = {...errors, description: 'Ce champs ne doit pas etre vide'};
                do_submit = false;
            } else {
                errors = {...errors, description: null};
            }
  
            if (is_empty(inputTransaction.date)) {
                errors = {...errors, date: 'Ce champs ne doit pas etre vide'};
                do_submit = false;
            } else {
                errors = {...errors, date: null};
            }
  
            if (inputTransaction.price < 0) {
                errors = {...errors, price: 'Une transaction doit etre superieur a 0'};
                do_submit = false;
            } else {
                errors = {...errors, price: null};
            }

            if (is_empty(inputTransaction.period)) {
                do_submit = false;
                errors = {...errors, period: 'La periode ne doit pas  etre vide'}
            } else {
                errors = {...errors, period: null}
            }

            if (inputTransaction.periodTime <= 0) {
                do_submit = false;
                errors = {...errors, periodTime: 'Le nombre de periode ne doit pas etre vide'}
            } else {
                errors = {...errors, periodTime: null}
            }

            if (isRepeat && inputTransaction.repeat <= 0) {
                errors = {...errors, repeat: 'Le nombre de repetition doit etre superieur a zero'}
                do_submit = false
            } else {
                errors = {...errors, repeat: null}
            }
  
            if  (do_submit) {
                let account = accounts.find((account) => account?.title === inputTransaction.account);
                let period = Object.entries(periodsFrench).find(key => key[1] === inputTransaction.period);
            
  
                if (future_transaction !== null) {
                    let request_update_future_transaction: RequestUpdateFutureTransaction = {
                        id: future_transaction.id,
                        account_ref: account!.id,
                        description: inputTransaction.description,
                        date_start: inputTransaction.date,
                        price: inputTransaction.price,
                        type_record: mapperTransactionType(inputTransaction.type)!,
                        tags_ref: selectedTagList,
                        category_ref: category!.id,
                        period: period![0],
                        period_time: inputTransaction.periodTime,
                        repeat: isRepeat ? inputTransaction.repeat : null
                    }

                    await axios.put(`/api/future-transactions/${future_transaction?.id}`, request_update_future_transaction);
                } else {
                    let request_future_transaction: RequestAddFutureTransaction = {
                        account_ref: account!.id,
                        description: inputTransaction.description,
                        date_start: inputTransaction.date,
                        price: inputTransaction.price,
                        type_record: mapperTransactionType(inputTransaction.type)!,
                        tags_ref: selectedTagList,
                        category_ref: category!.id,
                        period: period![1],
                        period_time: inputTransaction.periodTime,
                        repeat: isRepeat ? inputTransaction.repeat : null
                    }

                    await axios.post('/api/future-transactions', request_future_transaction);
                }
                onAdd();
                closeModalTransaction();
            } else {
                // @ts-ignore
                setErrorInputTransaction(errors);
            }
        } catch(err:any) {
            console.log(err);
            alert(err.response.data);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className='modal-add-new-transaction'>
                <div className='nav-modal-add-new-transaction flex'>
                    <div className={inputTransaction.type === TransactionType.Credit ? 'nav-btn is-active-nav-btn' : 'nav-btn'} onClick={() => setInputTransaction({...inputTransaction, type: TransactionType.Credit})} style={{borderTopLeftRadius: '0.5rem'}}>
                        Gains
                    </div>
                    <div className={inputTransaction.type === 'Debit' ? 'nav-btn is-active-nav-btn' : 'nav-btn'} onClick={() => setInputTransaction({...inputTransaction, type: TransactionType.Debit})} style={{borderTopRightRadius: '0.5rem'}}>
                        Depense
                    </div>
                </div>
                <div className='modal-body'>
                    <div>
                        <TextInput type={'text'} title={'Account'} value={inputTransaction.account} name={'account'} onChange={handleInputTransaction} options={accounts.map(account => account.title)} onClickOption={handleSelectInTransaction} error={errorInputTransaction.account} overOnBlur={undefined} />
                        <TextInput type={'number'} title={'Prix'} value={inputTransaction.price} name={'price'} onChange={handleInputTransaction} options={[]} onClickOption={undefined} error={errorInputTransaction.price} overOnBlur={undefined} />
                        <TextInput type={'text'} title={'Description'} value={inputTransaction.description} name={'description'} onChange={handleInputTransaction} options={[]} onClickOption={undefined} error={errorInputTransaction.description} overOnBlur={undefined} />
                        <TextInput type={'text'} title={'Categorie'} value={inputTransaction.category} name={'category'} onChange={handleInputTransaction} options={searchingCategories.map(cat => cat.title)} onClickOption={handleSelectInTransaction} error={errorInputTransaction.category} overOnBlur={undefined} />
                        <TextInput type={'date'} title={'Date debut'} value={inputTransaction.date} name={'date'} onChange={handleInputTransaction} options={[]} onClickOption={undefined} error={errorInputTransaction.date} overOnBlur={undefined} />
                        <TextInput type={'text'} title={'Tag'} value={inputTransaction.tag} name={'tag'} onChange={handleInputTransaction} options={searchingTags} onClickOption={handleSelectInTransaction} error={errorInputTransaction.tag} overOnBlur={() => handleSelectInTransaction('tag', inputTransaction.tag)} />
                        <div className='flex flex-wrap' style={{marginBottom: '1em'}}>
                            {
                                selectedTagList.map((tag, index) => <Tag key={index} title={tag} onDelete={() => removeTagSelected(tag)} color={undefined} />)
                            }
                        </div>
                        <TextInput type={'text'} title={'Periode'} value={inputTransaction.period} name={'period'} onChange={handleInputTransaction} options={typePeriods.map((val, index) => val.title)} onClickOption={handleSelectInTransaction} error={errorInputTransaction.period} overOnBlur={() => handleSelectInTransaction('period', inputTransaction.period)} />
                        <TextInput type={'number'} title={'Nombre de periode'} value={inputTransaction.periodTime} name={'periodTime'} onChange={handleInputTransaction} options={[]} onClickOption={undefined} error={errorInputTransaction.periodTime} overOnBlur={undefined} />
                        <div style={{display: 'flex', marginBottom: '5px', padding: '5px'}}>
                            <input type='checkbox' checked={isRepeat} onChange={() => setIsRepeat(!isRepeat)}/>
                            <p style={{fontSize: "small", marginLeft: '2px'}}>Mettre une limite de repetion</p>
                        </div>
                        {
                            isRepeat ?
                                <TextInput type={'number'} title={'Repetition'} value={inputTransaction.repeat} name={'repeat'} onChange={handleInputTransaction} options={[]} onClickOption={undefined} error={errorInputTransaction.repeat} overOnBlur={undefined} />
                            :
                            <></>
                        }
                        
                    </div>
                    <div className='flex justify-around'>
                        <Button title={'Annuler'} backgroundColor={'#1E3050'} colorText={'white'} onClick={closeModalTransaction} />
                        <Button title={ future_transaction !== null ? 'Modifier' : 'Ajouter'} backgroundColor={'#6755D7'} colorText={'white'} onClick={submit_transaction} />
                    </div>
                </div>
            </div>
        </Modal>
    )
}