
'use client';

import './nav.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// @ts-ignore
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
                    <NavButton className={pathname === '/' ? 'active' : ''} title='Accueil' link='/' icon={["fas", "house"]} />
                    <NavButton className={pathname === '/budget' ? 'active' : ''} title='Budget' link='/budget' icon={["fas", "wallet"]}/>
                    <NavButton className={pathname === '/visualisation' ? 'active' : ''} title='Visualisation' link='/visualisation' icon={["fas", "chart-pie"]}/>
                    <NavButton className={pathname === '/saving' ? 'active' : ''} title="But d'epargne" link='/saving' icon={["fas", "piggy-bank"]}/>
                    <NavButton className={pathname === '/parameter' ? 'active' : ''} title='Parametre' link='/parameter' icon={["fas", "gear"]}/>
                </div>
            </div>
        </div>
    )
}