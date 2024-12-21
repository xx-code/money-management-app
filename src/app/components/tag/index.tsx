import { isEmpty } from '@/core/domains/helpers';
import './index.css';

export default function Tag({title, onDelete, color} : {title: string, onDelete: any|undefined, color: string|undefined|null}) {
    return (
        <div className='tag' style={{backgroundColor: isEmpty(color) ? 'gray' : color!}}>
            <p>{title}</p>
            {
                onDelete !== undefined ?<span onClick={onDelete}>x</span> : <></>
            }
        </div>
    )
}