import Nav from "./nav"

export default function Dashboard() {
    return (
        <div className="flex" style={{height: '100vh', padding: '1.5em 2em'}}>
            <div>
                <Nav />
            </div>
            <div>
                <h1>Hello, Next.js!</h1>
            </div>
        </div>
    )
}