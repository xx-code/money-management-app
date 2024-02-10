import './index.css';

export default function Dropdown({values, backgroundColor, color, customClassName=''}: {values: string[], backgroundColor:string|null, customClassName:string, color: string}) {
    return (
        <select className={`dropdown ${customClassName}`} style={{ background: backgroundColor!=null?backgroundColor:'none', color: color }}>
            {
                values.map((value, key) => (<option key={key} value={value}>{value}</option>))
            }
        </select>
    )
}