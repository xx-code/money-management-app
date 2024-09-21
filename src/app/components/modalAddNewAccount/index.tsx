import { useState } from 'react';
import Button from '../button';
import Modal from '../modal';
import TextInput from '../textInput';
import './index.css';
import { is_empty } from '@/core/entities/verify_empty_value';
import axios from 'axios';

export default function ModalAddNewAccount ({isOpen, onClose, onAdd}: 
    {isOpen: boolean,  onClose: any, onAdd: any,} ) {

    const [inputAccount, setInputAccount] = useState({title: ''});
    const [errorInputAccount, setErrorInputAccount] = useState<{title: string|null}>({title: null}) 


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
                    title: inputAccount.title
                };
            
                await axios.post('/api/account', new_account);
                await onAdd()
                closeModalAccountInput();
            } else {
                // @ts-ignore
                setErrorInputAccount(errors)
            }
        } catch (err) {
            console.log(err);
            alert(err);
        }
    }

    function closeModalAccountInput() {
        onClose();
        setErrorInputAccount({title: null});
        setInputAccount({title: '',});
    }

    return (
        <Modal isOpen={isOpen} onClose={() => {}}>
            <div className="modal-add-new-account">
                <h3>Ajouter nouveau compte</h3>
                <TextInput title="Nom du compte" type="text" value={inputAccount.title} onChange={handleInputAccount} name={"title"} options={[]} onClickOption={undefined} error={errorInputAccount.title} overOnBlur={undefined} />
                <div className="flex justify-around">
                    <Button title="Annuler" onClick={onClose} backgroundColor="#1E3050" colorText="white" />
                    <Button title="Ajouter" onClick={submit_account} backgroundColor="#6755D7" colorText="white" />
                </div>
            </div>
        </Modal>
    )
} 