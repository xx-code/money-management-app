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

export default function ModalIncreaseSavingGoal ({isOpen, onClose, onAdd, accounts, saveGoal}: 
    {isOpen: boolean,  onClose: any, onAdd: any, accounts: Account[], saveGoal: SaveGoalDisplay|null} ) {

    const [inputSavingGoal, setInputSavingGoal] = useState({account: '', price: 0});
    const [errorInputSavingGoal, setErrorInputSavingGoal] = useState<{price: string|null, account: string|null}>({price: null, account: null}) 


    function handleInputSaveGoal(event: any) {
        setInputSavingGoal({...inputSavingGoal, [event.target.name]: event.target.value});
    }

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

            if (inputSavingGoal.price <= 0) {
                errors = {...errors, price: 'la target doit etre superieur a 0'};
                do_submit = false;
            } else {
                    errors = {...errors, title: null};
            }

            if (do_submit) {
                let account = accounts.find((account) => account?.title === inputSavingGoal.account);

                let addPrice: RequestIncreaseSaveGoal = {
                    saving_goal_ref: saveGoal!.id,
                    account_ref: account!.id,
                    price: inputSavingGoal.price
                };

            
                await axios.post('/api/save-goal/add', addPrice);
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
        setErrorInputSavingGoal({account: '', price: ''});
        setInputSavingGoal({account: '', price: 0});
    }

    return (
        <Modal isOpen={isOpen} onClose={() => {}}>
            <div className="modal-increase-saving">
                <h3>Ajouter de l'argent</h3>
                <TextInput type={'text'} title={'Account'} value={inputSavingGoal.account} name={'account'} onChange={() => {}} options={accounts.map(account => account.title)} onClickOption={handleSelectInAccount} error={errorInputSavingGoal.account} overOnBlur={undefined} />
                <TextInput title="Prix" type="number" value={inputSavingGoal.price} onChange={handleInputSaveGoal} name={"price"} options={[]} onClickOption={undefined} error={errorInputSavingGoal.price} overOnBlur={undefined} />
                <div className="flex justify-around">
                    <Button title="Annuler" onClick={closeModalAccountInput} backgroundColor="#1E3050" colorText="white" />
                    <Button title="Ajouter" onClick={submitGoal} backgroundColor="#6755D7" colorText="white" />
                </div>
            </div>
        </Modal>
    )
} 