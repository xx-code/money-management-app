
'use client';

import './nav.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


function LogoTitle({ title }: {title: string}) {
    return (
        <div className="nav-icon">
            <h3>{title}</h3>
        </div>
    )
}

function NavButton({title, onClick}: {title: string, onClick: any}) {
    return (
        <div className="nav-link-content">
            <button onClick={onClick}>
                <div className='button-content'> 
                    <div className='icon' />
                    <span>
                        { title }
                    </span>  
                </div>
            </button>
        </div>
    )
}

export default function Nav() {
    return (
        <div className="nav">
            <div className="nav-content">
                <LogoTitle title="Agni." />
                <div className="nav-link">
                    <NavButton title='Home' onClick={() => {console.log('home')} } />
                    <NavButton title='Budget' onClick={() => {console.log('budget')} }/>
                </div>
            </div>
        </div>
    )
}