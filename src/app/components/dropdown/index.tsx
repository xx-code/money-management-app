import './index.css';

export default function Dropdown({values, backgroundColor, color, customClassName='', onChange}: {values: string[], backgroundColor:string|null, customClassName:string, color: string, onChange: any}) {

    return (
        <select className={`dropdown ${customClassName}`} style={{ background: backgroundColor!=null?backgroundColor:'none', color: color }} onChange={onChange}>
            {
                values.map((value, key) => (<option key={key} value={value}>{value}</option>))
            }
        </select>
    )
}