'use client';

import { useState } from 'react';
import './index.css';

type TextInputType = 'text'|'number'|'date'; 

type Props = {
    type: TextInputType
    title: string
    value: any
    name: string
    onChange: (e:  React.ChangeEvent<HTMLInputElement>) => void
    error: string|null|undefined
}

export default function TextInput({type, value, name, onChange, title, error}: Props) {

    return (
        <>
            <div className="textinput">
                <input  className={value.toString().length > 0 ? 'focus-input' : ''} name={name}  type={type} value={value} onChange={onChange} autoComplete='off' />
                <p className={value.toString().length > 0 || type === 'date'? 'focus-title' : ''}>{title}</p>
                {
                    error !== null ? <span>{error}</span> : <></>
                }
            </div>
        </>
    )
}