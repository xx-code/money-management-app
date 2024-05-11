import './index.css';

export default function Tag({title, onDelete, color} : {title: string, onDelete: any|undefined, color: string|undefined}) {
    return (
        <div className='tag' style={{backgroundColor: color === undefined ? 'gray' : color}}>
            <p>{title}</p>
            {
                onDelete !== undefined ?<span onClick={onDelete}>x</span> : <></>
            }
        </div>
    )
}