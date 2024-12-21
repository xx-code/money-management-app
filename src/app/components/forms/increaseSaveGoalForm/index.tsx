'use client'

import TextInput from "@/app/components/textInput";

import './index.css'
import { useReducer, useState } from "react";
import Button from "@/app/components/button";
import InputDropDown from "@/app/components/inputDropdown";
import { isEmpty } from "@/core/domains/helpers";
import axios from "axios";
import { AccountModel } from "@/app/api/models/accounts";
import { RequestIncreaseSaveGoal } from "@/core/interactions/saveGoal/increaseSaveGoal";

type SaveTransactionInput = {
    account: string
    amount: number
}

type SaveTransactionInputError = {
    account: string
    amount: string
}

const initTransactionInput: SaveTransactionInput = {
    account: '',
    amount: 0,
}

const initTransactionInputError: SaveTransactionInputError = {
    account: '',
    amount: '',
}

const verifyInput = (input: SaveTransactionInput): {isOk: boolean, errors: SaveTransactionInputError} => {
    let isOk = true 
    let errors: SaveTransactionInputError = initTransactionInputError

    if(isEmpty(input.account)) {
        isOk = false
        errors.account = "Vous devez selectionner un compte"
    } 

    if (input.amount <= 0) {
        isOk = false
        errors.amount = "Le prix doit etre superieur a 0"
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

function reducer(state: SaveTransactionInput, action: ActionInput) {
    if (action.type === 'update_field') {
        return {
            ...state,
            [action.field]: action.value
        }
    }
    return state
}

type Props = {
    accounts: AccountModel[]
    saveGoalRef: string
    onSubmit: () => void
}

export default function IncreaseAmountSaveGoalForm({accounts, saveGoalRef, onSubmit}: Props) {
    const [inputTransaction, dispatch] = useReducer(reducer, initTransactionInput );
    const [errorInputTransaction, setErrorInputTransaction] = useState<SaveTransactionInputError>(initTransactionInputError);

    function handleInputTransaction(event: any) {
        dispatch({
            type: 'update_field', 
            field: event.target.name, 
            value: event.target.value
        })
    }

    function handleSelectOption(name: any, value: any) {
        if (name === "account")
            dispatch({type: 'update_field', field: name, value: value})  
    }

    const displayAccount = (accountId: string) => {
        let tag = accounts.find((account) => account.accountId === accountId)
        if (tag) {
            return tag.title
        }
        return accountId
    }

    async function save() {
        try {
            const {isOk, errors} = verifyInput(inputTransaction)
            setErrorInputTransaction(errors)
            if (isOk) {
                let request: RequestIncreaseSaveGoal = {
                    account_ref: accounts.find(account => account.accountId === inputTransaction.account)!.accountId,
                    saving_goal_ref: saveGoalRef,
                    increase_amount: inputTransaction.amount
                }

                await axios.post(`/api/save-goal/add`, request)
                onSubmit()
            }
        } catch(err: any) {
            alert(err)
        }
    }

    return (
        <div className="transaction-content">
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
                </div>
                <div className='flex justify-around'>
                    <Button title={'Annuler'} backgroundColor={'#1E3050'} colorText={'white'} onClick={onSubmit} />
                    <Button title={'Ajouter'} backgroundColor={'#6755D7'} colorText={'white'} onClick={save} />
                </div>
            </div>
        </div>
    )
}