import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
library.add(fas)

import './topNav.css';

function IconNotification() {
    return(
        <div className='icon-notification'>
            <FontAwesomeIcon className='icon' style={{width: "20px", height: "100%", color: ""}} icon={["fas", "bell"]} />
            <div className="alert-icon"></div>
        </div>
    )
}

export default function TopNav ({title} : {title: string}) {
    return (
        <div className="top-nav">
            <div className='title'>
                <h1>{title}</h1>
            </div>
            <div>
                <IconNotification />
            </div>
        </div>
    )
}