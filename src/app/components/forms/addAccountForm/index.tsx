'use client'

import TextInput from "@/app/components/textInput";

import './index.css'
import { useReducer, useState } from "react";
import Button from "@/app/components/button";
import { isEmpty } from "@/core/domains/helpers";
import axios from "axios";;
import { RequestCreationAccountUseCase } from "@/core/interactions/account/creationAccountUseCase";

type AccountInput = {
    account: string
}

type AccountInputError = {
    account: string
}

const initAccountInput: AccountInput = {
    account: '',
}

const initAccountInputError: AccountInputError = {
    account: '',
}


const verifyInput = (input: AccountInput): {isOk: boolean, errors: AccountInputError} => {
    let isOk = true 
    let errors: AccountInputError = initAccountInputError

    if(isEmpty(input.account)) {
        isOk = false
        errors.account = "Vous devez selectionner un compte"
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

function reducer(state: AccountInput, action: ActionInput) {
    if (action.type === 'update_field') {
        return {
            ...state,
            [action.field]: action.value
        }
    }

    return state
}

type Props = {
    onSubmit: () => void
}

export default function AddAccountForm({onSubmit}: Props) {
    const [inputAccount, dispatch] = useReducer(reducer, initAccountInput );
    const [errorInputAccount, setErrorInputAccount] = useState<AccountInputError>(initAccountInputError);

    function handleInputAccount(event: any) {
        dispatch({
            type: 'update_field', 
            field: event.target.name, 
            value: event.target.value
        })
    }

    async function save() {
        try {
            const {isOk, errors} = verifyInput(inputAccount)
            setErrorInputAccount(errors)
            if (isOk) {
                let request: RequestCreationAccountUseCase = {
                    title: inputAccount.account
                }

                await axios.post(`/api/account`, request)
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
                    <TextInput 
                        type={'text'}
                        title={'Nom du compte'}
                        value={initAccountInput.account}
                        name={'account'}
                        onChange={handleInputAccount}
                        error={errorInputAccount.account}
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