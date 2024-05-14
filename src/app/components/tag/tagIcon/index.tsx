import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
// @ts-ignore
library.add(fas)

import '../index.css';
import './index.css';


export default function TagIcon({title, onDelete, onClick, icon} : {title: string, onClick: any, onDelete: any|undefined, icon: any}) {
    
    return (
        <div className='tag tag-click' style={{backgroundColor: 'gray'}}>
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