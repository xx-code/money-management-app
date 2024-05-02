import { useEffect, useRef, useState } from 'react';
import './index.css';
import { search_in_array } from '@/core/entities/libs';

type TextInputType = 'text'|'number'|'date'; 

export default function TextInput({type, value, name, onChange, title, options = [], onClickOption, error, overOnBlur }: 
    {type: TextInputType, title: string, value: any, name:string, onChange: any, options: string[], onClickOption: any, error: string|null, overOnBlur: any|undefined}) {
    const selector_ref = useRef(null)
    const [focused, setFocused] = useState(false);

    const onFocus = () => {
        setFocused(true)
    }

    const onBlur = () => {
        if (overOnBlur !== undefined) {
            overOnBlur();
        }
        setTimeout(() => {
            setFocused(false);
        }, 150);
    }



    return (
        <>
            <div className="textinput">
                <input  className={value.toString().length > 0 ? 'focus-input' : ''} name={name} onFocus={onFocus} onBlur={onBlur} type={type} value={value} onChange={onChange} />
                <p className={value.toString().length > 0 ? 'focus-title' : ''}>{title}</p>
                {
                    error !== null ? <span>{error}</span> : <></>
                }
                {
                    options.length > 0 ?
                    <div ref={selector_ref} className={focused ? "search-option search-option-display" : "search-option"} onMouseOver={onFocus} >
                        { options.map((value, index) => <div key={index} className='option' onClick={() => onClickOption(name, value)}>{value}</div>) }
                    </div>
                    :
                    <></>
                }
            </div>
            
        </>
    )
}