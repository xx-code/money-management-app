import { PropsWithChildren } from 'react'
import './index.css'

export default function Modal({children, isOpen, onClose} : {isOpen: Boolean, onClose: any, children: React.ReactNode})  {
    return (
        <div className={isOpen ? 'modal modal-open' : 'modal'}>
            <div className='modal-content'>
                {children}
            </div>
        </div>
    )
    
}