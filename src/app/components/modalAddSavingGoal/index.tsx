import { useState } from 'react';
import Button from '../button';
import Modal from '../modal';
import TextInput from '../textInput';
import './index.css';
import { is_empty } from '@/core/entities/verify_empty_value';
import axios from 'axios';
import { RequestNewSaveGoal } from '@/core/interactions/saveGoal/addSaveGoal';

export default function ModalAddSavingGoal ({isOpen, onClose, onAdd}: 
    {isOpen: boolean,  onClose: any, onAdd: any,} ) {

    const [inputSavingGoal, setInputSavingGoal] = useState({title: '', target: 0, description: ''});
    const [errorInputSavingGoal, setErrorInputSavingGoal] = useState<{title: string|null, target: string|null}>({title: null, target: null}) 


    function handleInputAccount(event: any) {
        setInputSavingGoal({...inputSavingGoal, [event.target.name]: event.target.value});
    }
    
    async function submitGoal() {
        try {

            let do_submit = true;

            let errors = {}
            
            if (is_empty(inputSavingGoal.title)) {
                errors = {...errors, title: 'Ce champs ne doit pas etre vide'};
                do_submit = false;
            } else {
                    errors = {...errors, title: null};
            }

            if (inputSavingGoal.target <= 0) {
                errors = {...errors, price: 'la target doit etre superieur a 0'};
                do_submit = false;
            } else {
                    errors = {...errors, title: null};
            }

            if (do_submit) {
                let new_account: RequestNewSaveGoal = {
                    title: inputSavingGoal.title,
                    target: inputSavingGoal.target,
                    description: inputSavingGoal.description
                };
            
                await axios.post('/api/save-goal', new_account);
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
        setErrorInputSavingGoal({title: null, target: null});
        setInputSavingGoal({title: '', target: 0, description: ''});
    }

    return (
        <Modal isOpen={isOpen} onClose={() => {}}>
            <div className="modal-add-saving">
                <h3>Ajouter nouveau but d'epargne</h3>
                <TextInput title="Titre" type="text" value={inputSavingGoal.title} onChange={handleInputAccount} name={"title"} options={[]} onClickOption={undefined} error={errorInputSavingGoal.title} overOnBlur={undefined} />
                <TextInput title="Description" type="text" value={inputSavingGoal.description} onChange={handleInputAccount} name={"description"} options={[]} onClickOption={undefined} error={''} overOnBlur={undefined} />
                <TextInput title="Cible" type="number" value={inputSavingGoal.target} onChange={handleInputAccount} name={"target"} options={[]} onClickOption={undefined} error={errorInputSavingGoal.target} overOnBlur={undefined} />
                <div className="flex justify-around">
                    <Button title="Annuler" onClick={closeModalAccountInput} backgroundColor="#1E3050" colorText="white" />
                    <Button title="Ajouter" onClick={submitGoal} backgroundColor="#6755D7" colorText="white" />
                </div>
            </div>
        </Modal>
    )
} 