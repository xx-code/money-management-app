'use client';

import { useState } from 'react';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { isEmpty } from '@/core/domains/helpers';
import useOutsideClick from '../hooks/outsideClick';

// @ts-ignore
library.add(fas)

type TextInputType = 'text'|'number'|'date';

export type OptionDropdown = {
    displayValue: string
    value: string
}

type Props = {
    type: TextInputType, 
    label: string, 
    value: any, 
    name:string, 
    placeholder: string
    onChange: (event: any) => void, 
    options: OptionDropdown[]|undefined, 
    onClickOption: (name: any, value: string) => void,  
    error: string|undefined |null, 
    overOnBlur: any|undefined,
    remover: boolean
}

export default function InputDropDown({type, value, name, onChange, label, options = [], onClickOption, error, overOnBlur, placeholder="", remover = false}: Props) {
    const [focused, setFocused] = useState(false);
    const [isBlur, setIsBlur] = useState(true)  // Patch: When we write tag to search and we don't want value in search by overOnBlur 

    const onFocus = () => {
        setFocused(true)
    }

    const onBlur = () => {
        if (overOnBlur !== undefined) {
            overOnBlur(); 
        }
        setTimeout(() => {
            setIsBlur(true)
            setFocused(false);
        }, 150);
    }

    const handleClickOutside = () => {
        setFocused(false)
        if (onBlur && !isBlur)
            onBlur()
        setIsBlur(true)
    }

    const handleClickOption = (name:any, value: string) => {
        setIsBlur(false)
        onClickOption(name, value)
    }

    const ref = useOutsideClick(handleClickOutside)

    return (
        <>
            <div  ref={ref} className="search-dropdown">
                <div className="label">{label}</div>
                <div style={{position: 'relative'}}>
                    <input  className={value?.toString().length > 0 ? 'focus-input' : ''} placeholder={remover ? "Aucun" : placeholder} name={name} onFocus={onFocus} onBlur={onBlur} type={type} value={value} onChange={onChange} autoComplete='off' />
                    <div className='icon'>
                        {
                            focused ?
                            <FontAwesomeIcon className='icon' icon={['fas', 'caret-up']} />
                            :
                            <FontAwesomeIcon className='icon' icon={['fas', 'caret-down']} />
                        }
                    </div>
                </div>
                
                {
                    error ? <span>{error}</span> : <></>
                }
                {
                    options?.length > 0 ?
                    <div className={focused ? "search-option search-option-display" : "search-option"} onMouseOver={onFocus} >
                        { options.map((option, index) =>{ 
                            return (
                                <div key={index} className='option' 
                                    onClick={() => handleClickOption(name, option.value)}>
                                        {option.displayValue}
                                </div> 
                            )
                        })
                        } 
                        {
                            remover ?
                                <div className='option' 
                                    onClick={() => handleClickOption(name, "")}>
                                        Aucun
                                </div> 
                                :
                                <></>
                        }
                    </div>
                    :
                    <></>
                }
            </div>
            
        </>
    )
}