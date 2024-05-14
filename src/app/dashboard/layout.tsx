import Nav from './nav';
import './page.css';
import TopNav from './topNav';


export default function DashboardLayout({
    children
  }: {
    children: React.ReactNode,
  }) {
    return (
       <div id='dashboard' className="flex" style={{height: '100vh', padding: '1.5em 2em'}}>
            <div className="container-left">
                <Nav />
            </div>
            <div className="container-right">
                {children}
            </div>
        </div> 
    ) 
  }