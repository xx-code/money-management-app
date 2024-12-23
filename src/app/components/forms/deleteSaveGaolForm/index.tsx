'use client'

import TextInput from "@/app/components/textInput";

import './index.css'
import { useReducer, useState } from "react";
import Button from "@/app/components/button";
import { isEmpty } from "@/core/domains/helpers";
import axios from "axios";import { RequestDeleteSaveGoal } from "@/core/interactions/saveGoal/deleteSaveGoal";
import { AccountModel } from "@/app/api/models/accounts";
import InputDropDown from "../../inputDropdown";
;

type DeleteSaveGoalInput = {
    account: string
}

type DeleteSaveGoalError = {
    account: string
}

const initAccountInput: DeleteSaveGoalInput = {
    account: '',
}

const initAccountInputError: DeleteSaveGoalError = {
    account: '',
}


const verifyInput = (input: DeleteSaveGoalInput): {isOk: boolean, errors: DeleteSaveGoalError} => {
    let isOk = true 
    let errors: DeleteSaveGoalError = initAccountInputError

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

function reducer(state: DeleteSaveGoalInput, action: ActionInput) {
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
    saveGoalId: string
    onSubmit: () => void
}

export default function DeleteSaveGoalForm({onSubmit, accounts, saveGoalId}: Props) {
    const [inputAccount, dispatch] = useReducer(reducer, initAccountInput );
    const [errorInputAccount, setErrorInputAccount] = useState<DeleteSaveGoalError>(initAccountInputError);

    
    function handleSelectOption(name: any, value: any) {
        if (name === "account")
            dispatch({type: 'update_field', field: name, value: value})     
    }

    async function save() {
        try {
            const {isOk, errors} = verifyInput(inputAccount)
            setErrorInputAccount(errors)
            if (isOk) {
                let request: RequestDeleteSaveGoal = {
                    account_tranfert_ref: inputAccount.account,
                    save_goal_ref: saveGoalId
                }

                await axios.post(`/api/save-goal/delete`, request)
                onSubmit()
            }
        } catch(err: any) {
            alert(err)
        }
    }

    const displayAccount = (accountId: string) => {
        let tag = accounts.find((account) => account.accountId === accountId)
        if (tag) {
            return tag.title
        }
        return accountId
    }
    
    return (
        <div className="transaction-content">
            <div className='modal-body'>
                <div>
                    <InputDropDown 
                        type={'text'}
                        label={'Comptes'}
                        value={displayAccount(inputAccount.account)}
                        name={'account'}
                        onChange={() => {}}
                        options={accounts.map(account => ({ value: account.accountId, displayValue: account.title }))}
                        onClickOption={handleSelectOption}
                        error={errorInputAccount.account}
                        overOnBlur={undefined} 
                        placeholder={""} 
                        remover={false}
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