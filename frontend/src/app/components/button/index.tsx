import './index.css';

export default function Button({title, backgroundColor, colorText, onClick}: {title: string, backgroundColor: string, colorText: string, onClick: any}) {
    return (
        <button className="button-custom" onClick={onClick} style={{backgroundColor: backgroundColor, color: colorText}}>
            {title}
        </button>
    )
}