import './index.css';

export type DropdownValue = {
    returnValue: string,
    value: string
}

export type Props = {
    values: DropdownValue[], 
    valueSelected: string,
    backgroundColor:string|null, 
    customClassName:string, 
    color: string, 
    onChange: any
}

export default function Dropdown({values, backgroundColor, color, valueSelected, customClassName='', onChange}: Props) {

    return (
        <select className={`dropdown ${customClassName}`} style={{ background: backgroundColor!=null?backgroundColor:'none', color: color}} onChange={onChange} value={valueSelected}>
            {
                values.map((el, key) => (<option key={key} value={el.returnValue}>{el.value}</option>))
            }
        </select>
    )
}