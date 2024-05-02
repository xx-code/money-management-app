import '../index.css';

type TextInputType = 'text'|'number'|'date'; 

export default function TextInput({type, value, onChange, title}: {type: TextInputType, title: string, value: any, onChange: any}) {
    return (
        <div className="textinput">
            <input type={type} value={value} onChange={onChange} />
            <p className='focus-title'>{title}</p>
        </div>
    )
}