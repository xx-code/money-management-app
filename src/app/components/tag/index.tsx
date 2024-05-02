import './index.css';

export default function Tag({title, onDelete} : {title: string, onDelete: any|undefined}) {
    return (
        <div className='tag'>
            <p>{title}</p>
            {
                onDelete !== undefined ?<span onClick={onDelete}>x</span> : <></>
            }
        </div>
    )
}