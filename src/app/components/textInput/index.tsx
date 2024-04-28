import './index.css';

type TextInputType = 'text'|'number'; 

export default function TextInput({type, value, onChange, title}: {type: TextInputType, title: string, value: any, onChange: any}) {
    return (
        <div className="textinput">
            <p>{title}</p>
            <input type={type} value={value} onChange={onChange} />
        </div>
    )
}