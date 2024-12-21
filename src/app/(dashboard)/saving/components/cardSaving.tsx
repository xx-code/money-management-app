'use client'

import { isEmpty, Money } from '@/core/domains/helpers';
import './cardSaving.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

type ItemCard = {
    title: string
    link: string
    price: Money
    priceUpdate: Money
}

type Props = {
    title: string
    description: string
    currentPrice: Money
    targetPrice: Money
    items: ItemCard[]
    onIncrease: () => void 
    onTransfert: () => void
    onUpdate: () => void
    onDelete: () => void
}

export default function CardSaving({title, description, currentPrice, targetPrice, items, onIncrease, onTransfert, onDelete, onUpdate}: Props) {
    const [displayItem, setDisplayItem] = useState(false)

    let percent = (currentPrice.getAmount() * 100) / targetPrice.getAmount()
    percent = Math.ceil(percent);
    percent = percent > 100 ? 100 : percent;

    return (
        <div className='card-saving'>
            <div className='card-saving-title'>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className='card-saving-info-bar'>
                    <div className='card-saving-info-bar-sild'>
                        <p className='current'>{currentPrice.toString()}</p>
                        <div className='bar-load' style={{width: `${percent}%`, height: '100%'}}></div>
                        <p className='target'>{targetPrice.toString()}</p>
                    </div>
                </div>
            </div>
            <div className='card-saving-btn'>
                <div className='icon-modif' style={{background: "#483f8f"}}>
                    <FontAwesomeIcon  onClick={onIncrease} icon={["fas", "plus"]} />
                </div>
                <div className='icon-modif' style={{background: "#483f8f"}}>
                    <FontAwesomeIcon  onClick={onTransfert} icon={["fas", "right-left"]} />
                </div>
                <div className='icon-modif' style={{background: "#1da1f3"}}>
                    <FontAwesomeIcon  onClick={onUpdate} icon={["fas", "pen"]} />
                </div>
                <div className='icon-modif' style={{background: "#f34d4d"}}>
                    <FontAwesomeIcon  onClick={onDelete}  icon={["fas", "trash"]} />
                </div>
                
            </div>
            { 
                items.length > 0 ?
                    <div className='card-item'>
                        <ul>
                            <li>
                                <div style={{flex: 2}}>
                                    <p>Items</p>
                                </div>
                                <div style={{flex: 1}}>
                                    <p>Prix</p>
                                </div>
                                <div style={{flex: 1}}>
                                    <p>html prix</p>
                                </div>
                            </li>
                            {
                                items.map(item => {
                                    return (
                                        <li>
                                            <div style={{flex: 2}}>
                                                {
                                                    isEmpty(item.link) ?
                                                        <p>- {item.title}</p>
                                                    :
                                                        <a href={item.link}>- {item.title}</a>
                                                }
                                            </div>
                                            <div style={{flex: 1}}>{item.price.toString()}</div>
                                            <div style={{flex: 1}}>{item.priceUpdate.toString()}</div>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                :
                <></>
            }
            
        </div>
    )
}