
'use client';

import './nav.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
library.add(fas)


function LogoTitle({ title }: {title: string}) {
    return (
        <div className="nav-icon">
            <h3>{title}</h3>
        </div>
    )
}

function NavButton({title, icon, link, className}: {title: string, className: string, icon:any,  link: any}) {
    return (
        <div className={`nav-link-content`}>
            <Link href={link}>
                <div className='button-content'> 
                    <FontAwesomeIcon className={'icon ' + className} icon={icon} />
                    <span>
                        { title }
                    </span>  
                </div>
            </Link>
        </div>
    )
}

export default function Nav() {
    const pathname = usePathname();

    return (
        <div className="nav">
            <div className="nav-content">
                <LogoTitle title="Agni." />
                <div className="nav-link">
                    <NavButton className={pathname === '/dashboard/home' ? 'active' : ''} title='Accueil' link='/dashboard/home' icon={["fas", "house"]} />
                    <NavButton className={pathname === '/dashboard/budget' ? 'active' : ''} title='Budget' link='/dashboard/budget' icon={["fas", "wallet"]}/>
                    <NavButton className={pathname === '/dashboard/parameter' ? 'active' : ''} title='Parametre' link='/dashboard/parameter' icon={["fas", "gear"]}/>
                </div>
            </div>
        </div>
    )
}