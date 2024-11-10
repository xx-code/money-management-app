import { BudgetWithCategoryDisplay, BudgetWithTagDisplay, isBudgetCategory } from '@/core/entities/budget';
import './index.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import styled, { keyframes } from "styled-components";

// @ts-ignore
library.add(fas);


export default function CardBudget({budget, onUpdate, onDelete} : {budget: BudgetWithCategoryDisplay | BudgetWithTagDisplay, onUpdate: any, onDelete: any}) {
    let percent = (budget.current * 100) / budget.target;
    percent = Math.ceil(percent);
    percent = percent > 100 ? 100 : percent;
    let size = 60
    let stroke = 10
    let radius = (size - stroke)/2;
    let circumference = (radius) * Math.PI * 2;
    let dash = (percent: number) => (percent * circumference) / 100;
    let strokeDash = (percent: number) => circumference - dash(percent);

    const spin = keyframes`
        from {
            stroke-dasharray: ${dash(0)} ${strokeDash(0)};
        }
        to {
            stroke-dasharray: ${dash(percent)} ${strokeDash(percent)};
        }
    `

    const Cirbl = styled.circle`
        transform: rotate(-90deg);
        transform-origin: ${size/2}px ${size/2}px;
        stroke-dasharray: ${dash(0)} ${strokeDash(0)};
        transition: stroke-dasharray 0.3s linear 0s;
        stroke: #5394fd;  
        animation: ${spin} 1s linear 0s 1 forwards; 
    `

    return (
        <div className='card-budget'>
            <div className='card-budget-content'>
                <div className='card-budget-info'>
                    <div className='card-budget-info-text'>
                        <div className='card-budget-info-img'>
                            <div ></div>
                        </div>
                        <div className='card-budget-info-title'>
                            <h1>{budget.title}</h1>
                            <p>df</p>
                        </div>
                    </div>
                    <div className='card-budget-info-bar'>
                        <div className='card-budget-info-bar-sild'>
                            <p className='current'>${budget.current}</p>
                            <div className='bar-load' style={{width: `${percent}%`, height: '100%'}}></div>
                            <p className='target'>${budget.target}</p>
                        </div>
                    </div>
                </div>
                
                <div className='card-budget-edit-button'>
                    <div className='edit-btn' style={{backgroundColor: '#34495e'}} onClick={() => onUpdate(budget)}>
                        <FontAwesomeIcon  icon={["fas", "pen"]} />
                    </div>
                    <div className='edit-btn' style={{backgroundColor: '#f34d4d'}} onClick={() => onDelete(budget.id, isBudgetCategory(budget))} >
                        <FontAwesomeIcon icon={["fas", "trash"]} />
                    </div>
                </div> 
            </div>
        </div>
    )
}