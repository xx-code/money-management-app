import './topNav.css';

function IconNotification() {
    return(
        <div className='icon-notification'>
            <div className="icon"></div>
            <div className="alert-icon"></div>
        </div>
    )
}

export default function TopNav () {
    return (
        <div className="top-nav">
            <div className='title'>
                <h1>Bonjour, Auguste!</h1>
            </div>
            <div>
                <IconNotification />
            </div>
        </div>
    )
}