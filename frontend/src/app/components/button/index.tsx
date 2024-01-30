import './index.css';

export default function Button({title, backgroundColor, colorText}: {title: string, backgroundColor: string, colorText: string}) {
    return (
        <button className="button-custom" style={{backgroundColor: backgroundColor, color: colorText}}>
            {title}
        </button>
    )
}