import './index.css';

export default function Dropdown({values, backgroundColor, color}: {values: string[], backgroundColor:string|null, color: string}) {
    return (
        <select className="dropdown" style={{ background: backgroundColor!=null?backgroundColor:'none', color: color }}>
            {
                values.map(value => (<option value={value}>{value}</option>))
            }
        </select>
    )
}