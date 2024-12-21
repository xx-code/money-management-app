import './index.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import styled, { keyframes } from "styled-components";

// @ts-ignore
library.add(fas);


export default function CardSaving({savingGoald, onUpdate, onDelete, onIncrease, onTransfert} : {savingGoald: any, onIncrease: any, onTransfert: any, onUpdate: any, onDelete: any}) {

    const computerPercentEvolution = () => {
       let percent = (savingGoald.balance * 100 ) / savingGoald.target

       return percent
    }

    return (
        <div className='card-saving'>
            <div className='card-saving-content'>
                <div className='card-value'>
                    <div className='card-saving-info'>
                        <div className='card-saving-title'>
                            <h3>{savingGoald.title}</h3>
                            <div className='card-saving-subtitle'>
                                <div className='money-info target'>
                                    <h6>Cible</h6>
                                    <p>$ {savingGoald.target}</p>
                                </div>
                                <div className='money-info'>
                                    <h6>Actuel</h6>
                                    <p>$ {savingGoald.balance}</p>
                                </div>
                                <div className={`money-info money-rest`}>
                                    <h6>Reste</h6>
                                    <p>$ {savingGoald.target - savingGoald.balance }</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='card-saving-edit-button'>
                        <FontAwesomeIcon className='icon-modif' onClick={onIncrease} icon={["fas", "plus"]} />
                        <FontAwesomeIcon className='icon-modif' onClick={onTransfert} icon={["fas", "right-left"]} />
                        <FontAwesomeIcon className='icon-modif' onClick={() => onUpdate(savingGoald)} icon={["fas", "pen"]} />
                        <FontAwesomeIcon className='icon-delete' onClick={() => onDelete(savingGoald.id)}  icon={["fas", "trash"]} />
                    </div>
                </div>
                <div className='card-propress'>
                    <div className='progress-bar'>
                        <div className='bar' style={{width: `${computerPercentEvolution()}%`}}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}