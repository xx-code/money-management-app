import { useState } from 'react';
import Button from '../button';
import Modal from '../modal';
import TextInput from '../textInput';
import './index.css';
import { is_empty } from '@/core/entities/verify_empty_value';
import axios from 'axios';
import { Account } from '@/core/entities/account';
import { RequestIncreaseSaveGoal } from '@/core/interactions/saveGoal/increaseSaveGoal';
import { SaveGoalDisplay } from '@/core/entities/save_goal';
import { RequestDeleteSaveGoal } from '@/core/interactions/saveGoal/deleteSaveGoal';

export default function ModalDeleteSavingGoal ({isOpen, onClose, onAdd, accounts, saveGoal}: 
    {isOpen: boolean,  onClose: any, onAdd: any, accounts: Account[], saveGoal: SaveGoalDisplay|null} ) {

    const [inputSavingGoal, setInputSavingGoal] = useState({account: ''});
    const [errorInputSavingGoal, setErrorInputSavingGoal] = useState<{account: string|null}>({account: null}) 


    function handleSelectInAccount(name: any, value: any) {
        setInputSavingGoal({...inputSavingGoal, account: value});
    }
    
    async function submitGoal() {
        try {

            let do_submit = true;

            let errors = {}
            
            if (is_empty(inputSavingGoal.account)) {
                errors = {...errors, title: 'Vous devez selectection un compte'};
                do_submit = false;
            } else {
                    errors = {...errors, title: null};
            }

            if (do_submit) {
                let account = accounts.find((account) => account?.title === inputSavingGoal.account);

                let reqDelete: RequestDeleteSaveGoal = {
                    save_goal_ref: saveGoal!.id,
                    account_tranfert_ref: account!.id,
                };

            
                await axios.post('/api/save-goal/delete', reqDelete);
                await onAdd()
                closeModalAccountInput();
            } else {
                // @ts-ignore
                setErrorInputSavingGoal(errors)
            }
        } catch (err: any) {
            console.log(err)
            alert(err.response.data);
        }
    }

    function closeModalAccountInput() {
        onClose();
        setErrorInputSavingGoal({account: ''});
        setInputSavingGoal({account: ''});
    }

    return (
        <Modal isOpen={isOpen} onClose={() => {}}>
            <div className="modal-increase-saving">
                <h3>Selectionner compte fin</h3>
                <TextInput type={'text'} title={'Account'} value={inputSavingGoal.account} name={'account'} onChange={() => {}} options={accounts.map(account => account.title)} onClickOption={handleSelectInAccount} error={errorInputSavingGoal.account} overOnBlur={undefined} />
                <div className="flex justify-around">
                    <Button title="Annuler" onClick={closeModalAccountInput} backgroundColor="#1E3050" colorText="white" />
                    <Button title="Delete" onClick={submitGoal} backgroundColor="#6755D7" colorText="white" />
                </div>
            </div>
        </Modal>
    )
} 