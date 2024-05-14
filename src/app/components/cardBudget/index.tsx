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
                    <div className='percent'>
                    <svg width="60" height="60" viewBox="0 0 60 60" >
                        <text x={20} y={35} fontSize={10} >{percent}%</text>
                        <circle cx={size/2} cy={size/2} r={radius} strokeWidth={stroke} fill='none' strokeLinecap='round' className="bg"></circle>
                        <Cirbl cx={size/2} cy={size/2} r={radius} strokeWidth={stroke} fill='none' strokeLinecap='round'></Cirbl>
                    </svg>
                    </div>
                    <div className='card-budget-title'>
                        <h3>{budget.title}</h3>
                        <div className='card-budget-subtitle'>
                            <div className='money-info target'>
                                <h6>Cible</h6>
                                <p>$ {budget.target}</p>
                            </div>
                            <div className='money-info'>
                                <h6>Actuel</h6>
                                <p>$ {budget.current}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='card-budget-edit-button'>
                    <FontAwesomeIcon className='icon-modif' onClick={() => onUpdate(budget)} icon={["fas", "pen"]} />
                    <FontAwesomeIcon className='icon-delete' onClick={() => onDelete(budget.id, isBudgetCategory(budget))}  icon={["fas", "trash"]} />
                </div>
            </div>
        </div>
    )
}