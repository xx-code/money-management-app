'use client'

import TextInput from "@/app/components/textInput";

import './index.css'
import { useReducer, useState } from "react";
import { TransactionType } from "@/core/domains/entities/transaction";
import Button from "@/app/components/button";
import InputDropDown from "@/app/components/inputDropdown";
import Tag from "@/app/components/tag";
import { isEmpty, searchInArr } from "@/core/domains/helpers";
import axios from "axios";
import { RequestAddTransactionUseCase } from "@/core/interactions/transaction/addTransactionUseCase";
import { RequestUpdateTransactionUseCase } from "@/core/interactions/transaction/updateTransactionUseCase";
import { TransactionModel } from "@/app/api/models/transaction";
import { AccountModel } from "@/app/api/models/accounts";
import { CategoryModel } from "@/app/api/models/categories";
import { TagModel } from "@/app/api/models/tag";

type TransactionInput = {
    account: string
    amount: number
    description: string 
    category: string 
    date: string 
    tag: string 
    type: string
    tagsSelected: string[]
}

type TransactionInputError = {
    account: string
    amount: string
    description: string
    category: string
    tag: string
    type: string
    date: string
}

const initTransactionInput: TransactionInput = {
    account: '',
    amount: 0,
    description: '',
    category: '',
    date: '',
    tag: '',
    type: 'Credit',
    tagsSelected: []
}

const initTransactionInputError: TransactionInputError = {
    account: '',
    amount: '',
    description: '',
    category: '',
    date: '',
    tag: '',
    type: ''
}

function createTransactionInputInitial(transaction: TransactionModel|undefined): TransactionInput {
    if (transaction) {
        return {
            account: transaction.accountId,
            category: transaction.category.categoryId,
            description: transaction.description,
            date: transaction.date,
            amount: transaction.amount,
            tag: '',
            tagsSelected: transaction.tags.map(tag => tag.tagId),
            type: transaction.type
        }
    }

    return initTransactionInput
}

const verifyInput = (input: TransactionInput): {isOk: boolean, errors: TransactionInputError} => {
    let isOk = true 
    let errors: TransactionInputError = initTransactionInputError

    if(isEmpty(input.account)) {
        isOk = false
        errors.account = "Vous devez selectionner un compte"
    } 

    if (input.amount <= 0) {
        isOk = false
        errors.amount = "Le prix doit etre superieur a 0"
    }

    if (isEmpty(input.category)) {
        isOk = false 
        errors.category = "Vous devez selectionner une categorie"
    }

    if (isEmpty(input.description)) {
        isOk = false 
        errors.description = "Ajouter une description a la transaction"
    }

    if (isEmpty(input.date)) {
        isOk = false
        errors.date = "Vous devez choisir une date de transaction"
    }

    return {
        isOk,
        errors
    }
} 

type ActionInput = {
    type: string
    field: string
    value: string
}

function reducer(state: TransactionInput, action: ActionInput) {
    if (action.type === 'update_field') {
        return {
            ...state,
            [action.field]: action.value
        }
    }

    if (action.type === 'add_tag') {
        let tags = Object.assign([], state.tagsSelected)
        if (state.tagsSelected.find(tag => tag === action.value) === undefined) {
            tags.push(action.value)
            return {
                ...state,
                tagsSelected: tags
            }
        } 
    }

    if (action.type === 'remove_tag') {
        let tags = Object.assign([], state.tagsSelected)
        let indexTag = tags.findIndex(tag => tag === action.value)
        if (indexTag !== -1) {
            tags.splice(indexTag, 1)
            return {
                ...state,
                tagsSelected: tags
            }
        }
    }

    return state
}

type Props = {
    accounts: AccountModel[]
    categories: CategoryModel[]
    tags: TagModel[]
    transaction: TransactionModel | undefined
    onSubmit: () => void
}

export default function TransactionForm({accounts, categories, tags, transaction, onSubmit}: Props) {
    const [inputTransaction, dispatch] = useReducer(reducer, transaction, createTransactionInputInitial );
    const [errorInputTransaction, setErrorInputTransaction] = useState<TransactionInputError>(initTransactionInputError);

    const [searchTags, setSearchTag] = useState(tags)
    const [searchCategories, setSearchCategories] = useState(categories)

    function handleInputTransaction(event: any) {
        if (event.target.name === 'tag') {
            let tagsFound = searchInArr(event.target.value, tags.map(tag => tag.title));
            setSearchTag(tags.filter(tag => tagsFound.includes(tag.title)));
        }
  
        if (event.target.name === 'category') {
            let categoriesFound = searchInArr(event.target.value, categories.map(category => category.title));
            setSearchCategories(categories.filter(category => categoriesFound.includes(category.title)));
        }
  
        dispatch({
            type: 'update_field', 
            field: event.target.name, 
            value: event.target.value
        })
    }

    function handleSelectOption(name: any, value: any) {
        if (name === "account")
            dispatch({type: 'update_field', field: name, value: value})

        if (name === "category") {
            dispatch({type: 'update_field', field: name, value: value})
            setSearchCategories(categories)
        }

        if (name === "tag") {
            dispatch({type: "update_field", value: "", field: 'tag'})
            dispatch({type: "add_tag", value: value, field: ''})
            setSearchTag(tags)
        }

        if (name === "blur_tag") {
            if (!isEmpty(value)) {
                let tagFound = tags.find(tag => tag.title.toLowerCase() === value.toLowerCase())
                
                let tagValue = value 
                if (tagFound)
                    tagValue = tagFound.tagId

                dispatch({type: "update_field", value: "", field: 'tag'})
                dispatch({type: "add_tag", value: tagValue, field: ''})
                setSearchTag(tags)
            }
        }
            
    }
  
    function handleDeleteOption(name: string, id: string) {
        if (name === 'tag')
            dispatch({type: 'remove_tag', field: '', value: id})
    }

    const displayAccount = (accountId: string) => {
        let tag = accounts.find((account) => account.accountId === accountId)
        if (tag) {
            return tag.title
        }
        return accountId
    }

    const displayCategory = (categoryId: string) => {
        let category = categories.find((category) => category.categoryId === categoryId)
        if (category) {
            return category.title
        }
        return category
    }

    const displayTag = (tagId: string) => {
        let tag = tags.find((tag) => tag.tagId === tagId)
        if (tag) {
            return tag.title
        }
        return tagId
    }

    async function save() {
        try {
            const {isOk, errors} = verifyInput(inputTransaction)
            setErrorInputTransaction(errors)
            if (isOk) {
                let tagsSelected = []
                let newTags = []
                for (let tag of inputTransaction.tagsSelected) {
                    if (tags.map(tag => tag.tagId).includes(tag)) {
                        tagsSelected.push(tag)
                    } else {
                        newTags.push(tag)
                    }
                }

                let request: RequestAddTransactionUseCase = {
                    account_ref: accounts.find(account => account.accountId === inputTransaction.account)!.accountId,
                    amount: inputTransaction.amount,
                    category_ref: categories.find(cat => cat.categoryId === inputTransaction.category)!.categoryId,
                    description: inputTransaction.description,
                    date: inputTransaction.date,
                    tag_ref: tagsSelected,
                    new_tags: newTags,
                    type: inputTransaction.type
                }

                await axios.post(`/api/transaction`, request)
                onSubmit()
            }
        } catch(err: any) {
            alert(err)
        }
    }

    async function update() {
        try {
            const {isOk, errors} = verifyInput(inputTransaction)
            setErrorInputTransaction(errors)
            if (isOk) {
                let tagsSelected = []
                let newTags = []
                for (let tag of inputTransaction.tagsSelected) {
                    if (tags.map(tag => tag.tagId).includes(tag)) {
                        tagsSelected.push(tag)
                    } else {
                        newTags.push(tag)
                    }
                }

                let request: RequestUpdateTransactionUseCase = {
                    id: transaction!.id,
                    account_ref: accounts.find(account => account.accountId === inputTransaction.account)!.accountId,
                    tags_ref: tagsSelected,
                    new_tags_ref: newTags,
                    category_ref: categories.find(cat => cat.categoryId === inputTransaction.category)!.categoryId,
                    type: inputTransaction.type,
                    description: inputTransaction.description,
                    date: inputTransaction.date,
                    amount: inputTransaction.amount
                }

                await axios.put(`/api/transaction/${transaction!.id}`, request)
                onSubmit()
            }
        } catch(err: any) {
            alert(err)
        }
    }
    
    return (
        <div className="transaction-content">
            <div className='nav-modal-add-new-transaction flex'>
                <div className={inputTransaction.type === TransactionType.CREDIT ? 'nav-btn is-active-nav-btn' : 'nav-btn'} onClick={() => dispatch({type: 'update_field', field: 'type', value: TransactionType.CREDIT})} >
                    Gains
                </div>
                <div className={inputTransaction.type === 'Debit' ? 'nav-btn is-active-nav-btn' : 'nav-btn'} onClick={() => dispatch({type: 'update_field', field: 'type', value: TransactionType.DEBIT})}>
                    Depense
                </div>
            </div>
            <div className='modal-body'>
                <div>
                    <InputDropDown 
                        type={'text'}
                        label={'Comptes'}
                        value={displayAccount(inputTransaction.account)}
                        name={'account'}
                        onChange={() => {}}
                        options={accounts.map(account => ({ value: account.accountId, displayValue: account.title }))}
                        onClickOption={handleSelectOption}
                        error={errorInputTransaction.account}
                        overOnBlur={undefined} 
                        placeholder={""} 
                        remover={false}
                    />
                    <TextInput 
                        type={'number'} 
                        title={'Prix'} 
                        value={inputTransaction.amount} 
                        name={'amount'} 
                        onChange={handleInputTransaction}  
                        error={errorInputTransaction.amount}  
                    />
                    <TextInput 
                        type={'text'} 
                        title={'Description'} 
                        value={inputTransaction.description} 
                        name={'description'} 
                        onChange={handleInputTransaction} 
                        error={errorInputTransaction.description} 
                    />
                    <InputDropDown 
                        type={'text'}
                        label={'Categorie'}
                        value={displayCategory(inputTransaction.category)}
                        name={'category'}
                        onChange={handleInputTransaction}
                        options={searchCategories.map(cat => ({ displayValue: cat.title, value: cat.categoryId }))}
                        onClickOption={handleSelectOption}
                        error={errorInputTransaction.category}
                        overOnBlur={undefined} 
                        placeholder={""} 
                        remover={false}                        
                    />
                    <TextInput 
                        type={'date'} 
                        title={'date'} 
                        value={inputTransaction.date} 
                        name={'date'} 
                        onChange={handleInputTransaction}  
                        error={errorInputTransaction.date} 
                    />
                    <InputDropDown 
                        type={'text'}
                        label={'tag'}
                        value={inputTransaction.tag}
                        name={'tag'}
                        onChange={handleInputTransaction}
                        options={searchTags.map(tag => ({ displayValue: tag.title, value: tag.tagId }))}
                        onClickOption={handleSelectOption}
                        error={errorInputTransaction.tag}
                        overOnBlur={() => handleSelectOption('blur_tag', inputTransaction.tag)} 
                        placeholder={""} 
                        remover={false}                        
                    />
                    <div className='flex flex-wrap' style={{marginBottom: '1em'}}>
                        {
                            inputTransaction.tagsSelected.map((tag, index) => (
                                <Tag 
                                    key={index} 
                                    title={displayTag(tag)} 
                                    onDelete={() => handleDeleteOption('tag', tag)} 
                                    color={undefined} />
                            ))
                        }
                    </div>
                </div>
                <div className='flex justify-around'>
                    <Button title={'Annuler'} backgroundColor={'#1E3050'} colorText={'white'} onClick={onSubmit} />
                    <Button title={ transaction !== undefined ? 'Modifier' : 'Ajouter'} backgroundColor={'#6755D7'} colorText={'white'} onClick={transaction !== undefined ? update : save} />
                </div>
            </div>
        </div>
    )
}