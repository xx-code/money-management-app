import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
// @ts-ignore
library.add(fas)

import '../index.css';
import './index.css';
import { isEmpty } from '@/core/domains/helpers';

type Props = {
    title: string, 
    onClick: any, 
    onDelete: any|undefined, 
    icon: any
    color: any
}

export default function TagIcon({title, onDelete, onClick, icon, color} : Props) {
    
    return (
        <div className='tag tag-click' style={{backgroundColor: isEmpty(color) ? 'gray' : color}}>
            <div className='flex content-center items-center' onClick={onClick}>
                <FontAwesomeIcon className='icon' icon={icon} />
                <p>{title}</p> 
            </div>
            {
                onDelete !== undefined ?<span onClick={onDelete}>x</span> : <></>
            }
        </div>
    )
}