function LogoTitle({ title }) {
    return (
        <div className="nav-content">
            <h3>{title}</h3>
        </div>
    )
}

function NavButton() {
    return (
        <div className="nav-content">
            <button>
                Title
            </button>
        </div>
    )
}

export default function Nav() {
    return (
        <div className="nav-color">
            <Logo />
            <NavButton />
            <NavButton />
            <NavButton />
            <NavButton />
        </div>
    )
}