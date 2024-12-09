'use client'

import TextInput from "@/app/components/textInput";

import './style.css'
import { useEffect, useState } from "react";
import { TransactionType } from "@/core/domains/entities/transaction";
import Button from "@/app/components/button";
import { useAccountsFetching } from "../../hooks/accounts";
import { useCategories, useTags } from "../../hooks/system";

export default function TransactionEditorPage({params: {id}}: { params: {id: string}}) {
    const { accounts, error, fetchAllAccounts, loading } = useAccountsFetching()
    const { categories, fetchCategories } = useCategories()
    const { tags, fetchTags } = useTags()

    const [transaction, setTransaction] = useState(null)
    const [inputTransaction, setInputTransaction] = useState({account: '', price: 0, description: '', category: '', date: '', tag: '', type: 'Credit'});
    const [errorInputTransaction, setErrorInputTransaction] = useState<{account: string|null, price: string|null, description: string|null, category: string|null, date: string|null, tag: string|null}>({account: null, price: null, description: null, category: null, date: null, tag: null});

    function handleInputTransaction(event: any) {
        // if (event.target.name === 'tag') {
        //     let tag_found = search_in_array(event.target.value, tags);
        //     setSearchingTags(tag_found);
        // }
  
        // if (event.target.name === 'category') {
        //     let categories_found = search_in_array(event.target.value, categories.map(category => category.title));
        //     setSearchingCategories(categories.filter(category => categories_found.includes(category.title)));
        // }
  
        // setInputTransaction({...inputTransaction, [event.target.name]: event.target.value});
    }

    function handleSelectInTransaction(name: any, value: any) {
        // if (name === 'tag' && !is_empty(value) && !selectedTagList.includes(value)) {
        //     setSelectedTagList([...selectedTagList, value])
        // } else {
        //     setInputTransaction({...inputTransaction, [name]: value});
        // }
    }
  
    function removeTagSelected(name: string) {
        // let tags = Object.assign([], selectedTagList);
        // tags.splice(tags.indexOf(name), 1);
        // setSelectedTagList(tags);
    }

    useEffect(() => {
        fetchAllAccounts()
        fetchCategories()
        fetchTags()
    }, [])
    
    return (
        <div className='modal-add-new-transaction'>
            <div className="transaction-content">
                <div className='nav-modal-add-new-transaction flex'>
                    <div className={inputTransaction.type === TransactionType.CREDIT ? 'nav-btn is-active-nav-btn' : 'nav-btn'} onClick={() => setInputTransaction({...inputTransaction, type: TransactionType.CREDIT})} >
                        Gains
                    </div>
                    <div className={inputTransaction.type === 'Debit' ? 'nav-btn is-active-nav-btn' : 'nav-btn'} onClick={() => setInputTransaction({...inputTransaction, type: TransactionType.DEBIT})}>
                        Depense
                    </div>
                </div>
                <div className='modal-body'>
                    <div>
                        <TextInput type={'text'} title={'Account'} value={inputTransaction.account} name={'account'} onChange={handleInputTransaction} options={accounts.map(account => account.title)} onClickOption={handleSelectInTransaction} error={errorInputTransaction.account} overOnBlur={undefined} />
                        <TextInput type={'number'} title={'Prix'} value={inputTransaction.price} name={'price'} onChange={handleInputTransaction} options={[]} onClickOption={undefined} error={errorInputTransaction.price} overOnBlur={undefined} />
                        <TextInput type={'text'} title={'Description'} value={inputTransaction.description} name={'description'} onChange={handleInputTransaction} options={[]} onClickOption={undefined} error={errorInputTransaction.description} overOnBlur={undefined} />
                        <TextInput type={'text'} title={'Categorie'} value={inputTransaction.category} name={'category'} onChange={handleInputTransaction} options={categories.map(cat => cat.title)} onClickOption={handleSelectInTransaction} error={errorInputTransaction.category} overOnBlur={undefined} />
                        <TextInput type={'date'} title={'date'} value={inputTransaction.date} name={'date'} onChange={handleInputTransaction} options={[]} onClickOption={undefined} error={errorInputTransaction.date} overOnBlur={undefined} />
                        <TextInput type={'text'} title={'tag'} value={inputTransaction.tag} name={'tag'} onChange={handleInputTransaction} options={tags.map(tag => tag.title)} onClickOption={handleSelectInTransaction} error={errorInputTransaction.tag} overOnBlur={() => handleSelectInTransaction('tag', inputTransaction.tag)} />
                        <div className='flex flex-wrap' style={{marginBottom: '1em'}}>
                            {
                                /*selectedTagList.map((tag, index) => <Tag key={index} title={tag} onDelete={() => removeTagSelected(tag)} color={undefined} />)*/
                            }
                        </div>
                    </div>
                    <div className='flex justify-around'>
                        <Button title={'Annuler'} backgroundColor={'#1E3050'} colorText={'white'} onClick={() => {}} />
                        <Button title={ transaction !== null ? 'Modifier' : 'Ajouter'} backgroundColor={'#6755D7'} colorText={'white'} onClick={() => {}} />
                    </div>
                </div>
            </div>
        </div>
    )
}