import { Transaction, TransactionType } from '@/core/entities/transaction';
import Button from '../button';
import Modal from '../modal';
import Tag from '../tag';
import TextInput from '../textInput';
import './index.css';
import { useState } from 'react';
import DateParser from '@/core/entities/date_parser';
import { is_empty } from '@/core/entities/verify_empty_value';
import { search_in_array } from '@/core/entities/libs';
import { AccountDisplay } from '@/core/entities/account';
import axios from 'axios';
import { Category } from '@/core/entities/category';

interface ModalTransaction {
    isOpen: boolean,
    transaction: Transaction|null,
    onClose: any,
    onAdd: any,
    categories: Category[],
    tags: string[],
    accounts: AccountDisplay[]
}

export function ModalAddNewTransaction({isOpen, transaction, onClose, onAdd, accounts, categories, tags}: ModalTransaction){
    const [inputTransaction, setInputTransaction] = useState({account: '', price: 0, description: '', category: '', date: DateParser.now().toString(), tag: '', type: 'Credit'});
    const [errorInputTransaction, setErrorInputTransaction] = useState<{account: string|null, price: string|null, description: string|null, category: string|null, date: string|null, tag: string|null}>({account: null, price: null, description: null, category: null, date: null, tag: null});
    const [searchingCategories, setSearchingCategories] = useState<Category[]>(categories);
    const [searchingTags, setSearchingTags] = useState<string[]>(tags);
    const [selectedTagList, setSelectedTagList] = useState<string[]>([]);
    const [prevTransaction, setPrevTransaction] = useState(transaction);

    if (prevTransaction !== transaction) {
        setPrevTransaction(transaction);
        if (transaction !== null) {
            setInputTransaction({
                ...inputTransaction, 
                account: transaction.account.title, 
                type: transaction.record.type,
                category: transaction.category.title, 
                date: transaction.record.date.toString(),
                tag: '', 
                description: transaction.record.description, 
                price: transaction.record.price
            });
            setSelectedTagList(transaction.tags);
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
  
        setInputTransaction({...inputTransaction, [event.target.name]: event.target.value});
    }

    function handleSelectInTransaction(name: any, value: any) {
        if (name === 'tag' && !is_empty(value) && !selectedTagList.includes(value)) {
            setSelectedTagList([...selectedTagList, value])
        } else {
            setInputTransaction({...inputTransaction, [name]: value});
        }
    }
  
    function removeTagSelected(name: string) {
        let tags = Object.assign([], selectedTagList);
        tags.splice(tags.indexOf(name), 1);
        setSelectedTagList(tags);
    }


    function closeModalTransaction() {
        onClose();
        setErrorInputTransaction({account: null, price: null, description: null, category: null, date: null, tag: null});
        setInputTransaction({account: '', price: 0, description: '', category: '', date: DateParser.now().toString(), tag: '', type: 'Credit'});
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
  
            if  (do_submit) {
                let account = accounts.find((account) => account?.title === inputTransaction.account);
                
                let request_transaction = {
                  account_ref: account!.id,
                  description: inputTransaction.description,
                  date: inputTransaction.date,
                  price: inputTransaction.price,
                  type: inputTransaction.type,
                  tag_ref: selectedTagList,
                  category_ref: category!.id
                }
  
                if (transaction !== null) {
                  await axios.put(`/api/transaction/${transaction?.id}`, request_transaction);
                } else {
                  await axios.post('/api/transaction', request_transaction);
                }
                await onAdd();
                closeModalTransaction();
            } else {
                // @ts-ignore
                setErrorInputTransaction(errors);
            }
        } catch(err:any) {
            console.log(err);
            alert(err.data);
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
                        <TextInput type={'date'} title={'date'} value={inputTransaction.date} name={'date'} onChange={handleInputTransaction} options={[]} onClickOption={undefined} error={errorInputTransaction.date} overOnBlur={undefined} />
                        <TextInput type={'text'} title={'tag'} value={inputTransaction.tag} name={'tag'} onChange={handleInputTransaction} options={searchingTags} onClickOption={handleSelectInTransaction} error={errorInputTransaction.tag} overOnBlur={() => handleSelectInTransaction('tag', inputTransaction.tag)} />
                        <div className='flex flex-wrap' style={{marginBottom: '1em'}}>
                            {
                                selectedTagList.map((tag, index) => <Tag key={index} title={tag} onDelete={() => removeTagSelected(tag)} color={undefined} />)
                            }
                        </div>
                    </div>
                    <div className='flex justify-around'>
                        <Button title={'Annuler'} backgroundColor={'#1E3050'} colorText={'white'} onClick={closeModalTransaction} />
                        <Button title={ transaction !== null ? 'Modifier' : 'Ajouter'} backgroundColor={'#6755D7'} colorText={'white'} onClick={submit_transaction} />
                    </div>
                </div>
            </div>
        </Modal>
    )
}