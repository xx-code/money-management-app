import './index.css';

export function TitleSection({title} : {title: string}) {
    return (
        <div className='title-section'>
            <h1>{title}</h1>
            <div className='bar'></div>
        </div>
    )
}