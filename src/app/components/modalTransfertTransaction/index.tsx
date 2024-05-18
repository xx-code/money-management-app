import { useState } from 'react';
import Button from '../button';
import Modal from '../modal';
import TextInput from '../textInput';
import './index.css';
import { is_empty } from '@/core/entities/verify_empty_value';
import axios from 'axios';
import { AccountDisplay } from '@/core/entities/account';
import DateParser from '@/core/entities/date_parser';

export default function ModalAddNewAccount ({isOpen, accounts, onClose, onAdd}: 
    {isOpen: boolean, accounts: AccountDisplay[], onClose: any, onAdd: any,} ) {

    const [input, setInput] = useState({account_from: '', account_to: '', price: 0, date: DateParser.now().toString()});
    const [errorInput, setErrorInput] = useState<{account_from: string|null, account_to: string|null, price: string|null, date: string|null}>({account_from: null, account_to: null, price: null, date: null}) 

    function handleInput(event:any) {
        setInput({...input, [event.target.name]: event.target.value});
    }

    function handleClickInput(name: string, value: string) {
        setInput({...input, [name]: value});
    }
    
    async function submit() {
        try {

            let do_submit = true;

            let errors = {}
            
            if (is_empty(input.account_from)) {
                errors = {...errors, account_from: 'Ce champs ne doit pas etre vide'};
                do_submit = false;
            } else {
                errors = {...errors, account_from: null};
            }

            if (is_empty(input.account_to)) {
                errors = {...errors, account_to: 'Ce champs ne doit pas etre vide'};
                do_submit = false;
            } else {
                errors = {...errors, account_to: null};
            }

            if (input.account_to === input.account_from) {
                errors = {...errors, account_to: 'L\'envoyeur est different du receveur'};
                do_submit = false;
            } else {
                errors = {...errors, account_to: null};
            }

            if (input.price <= 0) {
                errors = {...errors, price: 'Le prix doit est superieur a 0'};
                do_submit = false;
            } else {
                errors = {...errors, price: null};
            }

            if (is_empty(input.date)) {
                errors = {...errors, date: 'Ce champs ne doit pas etre vide'};
                do_submit = false;
            } else {
                errors = {...errors, date: null};
            }

            if (do_submit) {
                let account_from = accounts.find(account => account.title === input.account_from);
                let account_to = accounts.find(account => account.title === input.account_to);

                let new_transaction = {
                    account_id_from: account_from!.id,
                    account_id_to: account_to!.id,
                    price: input.price,
                    date: input.date
                };
            
                await axios.post('/api/transaction/transfert', new_transaction);
                closeModal();
            } else {
                // @ts-ignore
                setErrorInput(errors)
            }
        } catch (err:any) {
            console.log(err);
            alert(err.response.data);
        }
    }

    function closeModal() {
        onClose();
        setErrorInput({account_from: null, account_to: null, price: null, date: null});
        setInput({account_from: '', account_to: '', price: 0, date: DateParser.now().toString()});
    }

    return (
        <Modal isOpen={isOpen} onClose={() => {}}>
            <div className="modal-add-new-account">
                <h3>Transfert entre compte</h3>
                <TextInput type={'text'} title={'Account Envoyeur'} value={input.account_from} name={'account_from'} onChange={() => {}} options={accounts.map(account => account.title)} onClickOption={handleClickInput} error={errorInput.account_from} overOnBlur={undefined} />
                <TextInput type={'text'} title={'Account Receveur'} value={input.account_to} name={'account_to'} onChange={() => {}} options={accounts.map(account => account.title)} onClickOption={handleClickInput} error={errorInput.account_to} overOnBlur={undefined} />
                <TextInput type={'date'} title={'date'} value={input.date} name={'date'} onChange={handleInput} options={[]} onClickOption={undefined} error={errorInput.date} overOnBlur={undefined} />
                <TextInput title="Prix" type="number" value={input.price} onChange={handleInput} name={"price"} options={[]} onClickOption={undefined} error={errorInput.price} overOnBlur={undefined} />
                <div className="flex justify-around">
                    <Button title="Annuler" onClick={closeModal} backgroundColor="#1E3050" colorText="white" />
                    <Button title="Transferer" onClick={submit} backgroundColor="#6755D7" colorText="white" />
                </div>
            </div>
        </Modal>
    )
} 