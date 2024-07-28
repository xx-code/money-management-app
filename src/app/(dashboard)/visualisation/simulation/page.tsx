'use client'

import TextInput from '@/app/components/textInput';
import TopNav from '../../topNav';
import './index.css';
import Button from '@/app/components/button';
import DateParser from '@/core/entities/date_parser';
import { useState } from 'react';
import { is_empty } from '@/core/entities/verify_empty_value';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RecordForEstimation, RequestEstimation } from '@/core/interactions/futureTransaction/estimateWalletUseCase';
import { TransactionType, mapperTransactionType } from '@/core/entities/transaction';
import axios from 'axios';
import roundPrice from '@/app/lib/roundPrice';

// @ts-ignore
library.add(fas);

type Input = {
    price: string,
    date: string,
    type: string
}


export default function Simulation() {
    const [input, setInput] = useState<Input>({price: '', date: DateParser.now().toString(), type: ''})
    const [estimations, setEstimations] = useState<Input[]>([])
    const [estimation, setEstimation] = useState<number|null>(null);
    const [errors, setErrors] = useState<Input>({price: '', date: '', type: ''})


    const handleInput = (event: any) => {
        setInput({...input, [event.target.name]: event.target.value})
    }

    const handleClickOption = (name: string, value: string) => {
        setInput({...input, type: value})
    }

    const deleteEstimation = (index: number) => {
        const new_estimation = estimations.filter((val, val_index) => val_index !== index)

        if (new_estimation.length === 0) 
            setEstimation(null)

        setEstimations(new_estimation)
        setInput({price: '', date: DateParser.now().toString(), type: ''})
    }

    const onAddEstimation = () => {
        let is_valid = true
        let error: any = {}

        if (Number(input.price) <= 0) {
            is_valid = false 
            error.price = 'le prix doit etre superieur a 0'
        } else {
            error.price = ''
        }

        if (is_empty(input.date)) {
            is_valid = false
            error.date = 'vous devez choisir une date'
        } else {
            error.date = ''
        }   

        if (is_empty(input.type)) {
            is_valid = false
            error.type = 'Vous devez selectionner un type'
        } else {
            error.type = ''
        }

        setErrors(error)
        if (is_valid) {
            setEstimations([...estimations, input])
            setInput({price: '', date: DateParser.now().toString(), type: ''})
        }
            
    }

    const startStimulation = async () => {
        try {
            let request: RequestEstimation = {records: []}

            for (let input of estimations) {
                request.records.push({
                    date: input.date,
                    price: Number(input.price),
                    type: input.type === 'Gains' ? TransactionType.Credit : TransactionType.Debit
                })
            }

            let res = await axios.post('/api/future-transactions/stimulation', request)

            setEstimation(res.data.estimation)
        } catch (err: any) {
            console.log(err);
            alert(err.response.data);
        }
    }

    return (
        <>
            <TopNav title='Sisualiation'/>
            <div style={{ marginTop: '2rem' }}>
                <div>
                    <div style={{display: 'flex'}}>
                        <TextInput 
                            type={'number'} 
                            title={'Prix'} 
                            value={input.price} 
                            name={'price'} 
                            onChange={handleInput} 
                            options={[]} 
                            onClickOption={undefined} 
                            error={errors.price} 
                            overOnBlur={undefined} 
                        />
                        <TextInput 
                            type={'date'} 
                            title={'Date'} 
                            value={input.date} 
                            name={'date'} 
                            onChange={handleInput} 
                            options={[]} 
                            onClickOption={undefined} 
                            error={errors.date} 
                            overOnBlur={undefined} 
                        />
                        <TextInput 
                            type={'text'} 
                            title={'Type'} 
                            value={input.type} 
                            name={'type'} 
                            onChange={() => {}} 
                            options={['Gains', 'Depense']} 
                            onClickOption={handleClickOption} 
                            error={errors.type} 
                            overOnBlur={undefined} 
                        />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row-reverse'}}>
                        <Button title={'Ajouter Transaction'} backgroundColor={'#6755d7'} colorText={'white'} onClick={onAddEstimation} />
                    </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', marginBlock: '25px'}}>
                    {
                        estimations.length > 0 && estimation !== null ?
                        <h3>Votre balance pourra etre a: {roundPrice(estimation)} $</h3>
                        :
                        <></>
                    }
                    
                </div>
                <div>
                    {
                        estimations.length > 0 ?
                            <Button title={'Simuler'} backgroundColor={'#6755d7'} colorText={'white'} onClick={startStimulation} />
                        :
                        <></>
                    }
                    
                </div>
                <div>
                    {
                        estimations.map((estimation: Input, index: number) => {
                            return (
                                <div className='item-estimation' key={index} >
                                    <h5>{estimation.price} $</h5>
                                    <h5>{estimation.date}</h5>
                                    <h5>{estimation.type}</h5>
                                    <div className='edit-btn' onClick={() => deleteEstimation(index)}>
                                        <FontAwesomeIcon icon={['fas', 'trash']} style={{fontSize: '10px'}}  />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}