import { useState } from 'react';
import Button from '../button';
import Modal from '../modal';
import TextInput from '../textInput';
import './index.css';
import { is_empty } from '@/core/entities/verify_empty_value';
import axios from 'axios';

export default function ModalAddNewAccount ({isOpen, onClose, onAdd}: 
    {isOpen: boolean,  onClose: any, onAdd: any,} ) {

    const [inputAccount, setInputAccount] = useState({title: '', credit_limit: 0, credit_value: 0});
    const [errorInputAccount, setErrorInputAccount] = useState<{title: string|null, credit_limit: string|null, credit_value: string|null}>({title: null, credit_limit: null, credit_value: null}) 


    function handleInputAccount(event: any) {
        setInputAccount({...inputAccount, [event.target.name]: event.target.value});
    }
    
    async function submit_account() {
        try {

            let do_submit = true;

            let errors = {}
            
            if (is_empty(inputAccount.title)) {
                errors = {...errors, title: 'Ce champs ne doit pas etre vide'};
                do_submit = false;
            } else {
                    errors = {...errors, title: null};
            }

            if (do_submit) {
                let new_account = {
                    title: inputAccount.title,
                    credit_value: inputAccount.credit_value,
                    credit_limit: inputAccount.credit_limit
                };
            
                await axios.post('/api/account', new_account);
                closeModalAccountInput();
            } else {
                setErrorInputAccount(errors)
            }
        } catch (err) {
            console.log(err);
            alert(err);
        }
    }

    function closeModalAccountInput() {
        onClose();
        setErrorInputAccount({title: null, credit_limit: null, credit_value: null});
        setInputAccount({title: '', credit_limit: 0, credit_value: 0});
    }

    return (
        <Modal isOpen={isOpen} onClose={() => {}}>
            <div className="modal-add-new-account">
                <h3>Ajouter nouveau compte</h3>
                <TextInput title="Nom du compte" type="text" value={inputAccount.title} onChange={handleInputAccount} name={"title"} options={[]} onClickOption={undefined} error={errorInputAccount.title} overOnBlur={undefined} />
                <TextInput title="Valeur de carte credit" type="number" value={inputAccount.credit_value} onChange={handleInputAccount} name={"credit_value"} options={[]} onClickOption={undefined} error={errorInputAccount.credit_value} overOnBlur={undefined} />
                <TextInput title="Limite de depense" type="number" value={inputAccount.credit_limit} onChange={handleInputAccount} name={"credit_limit"} options={[]} onClickOption={undefined} error={errorInputAccount.credit_limit} overOnBlur={undefined} />
                <div className="flex justify-around">
                    <Button title="Annuler" onClick={onClose} backgroundColor="#1E3050" colorText="white" />
                    <Button title="Ajouter" onClick={submit_account} backgroundColor="#6755D7" colorText="white" />
                </div>
            </div>
        </Modal>
    )
} 