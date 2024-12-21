import './index.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import styled, { keyframes } from "styled-components";
import { Money } from '@/core/domains/helpers';

// @ts-ignore
library.add(fas);

interface Props {
    title: string
    description: string
    targetPrice: Money
    currentPrice: Money
    onUpdate: () => void
    onDelete: () => void 
}

export default function CardWithProgressBar({title, description, targetPrice, currentPrice, onUpdate, onDelete} : Props) {
    let percent = (currentPrice.getAmount() * 100) / targetPrice.getAmount()
    percent = Math.ceil(percent);
    percent = percent > 100 ? 100 : percent;
    let size = 60
    let stroke = 10
    let radius = (size - stroke)/2;
    let circumference = (radius) * Math.PI * 2;
    let dash = (percent: number) => (percent * circumference) / 100;
    let strokeDash = (percent: number) => circumference - dash(percent);

    return (
        <div className='card-budget'>
            <div className='card-budget-content'>
                <div className='card-budget-info'>
                    <div className='card-budget-info-text'>
                        <div className='card-budget-info-img'>
                            <div ></div>
                        </div>
                        <div className='card-budget-info-title'>
                            <h1>{title}</h1>
                            <p>description</p>
                        </div>
                    </div>
                    <div className='card-budget-info-bar'>
                        <div className='card-budget-info-bar-sild'>
                            <p className='current'>{currentPrice.toString()}</p>
                            <div className='bar-load' style={{width: `${percent}%`, height: '100%'}}></div>
                            <p className='target'>{targetPrice.toString()}</p>
                        </div>
                    </div>
                </div>
                
                <div className='card-budget-edit-button'>
                    <div className='edit-btn' style={{backgroundColor: '#34495e'}} onClick={onUpdate}>
                        <FontAwesomeIcon  icon={["fas", "pen"]} />
                    </div>
                    <div className='edit-btn' style={{backgroundColor: '#f34d4d'}} onClick={onDelete} >
                        <FontAwesomeIcon icon={["fas", "trash"]} />
                    </div>
                </div> 
            </div>
        </div>
    )
}