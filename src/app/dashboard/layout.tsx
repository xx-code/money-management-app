import Nav from './nav';
import './page.css';
import TopNav from './topNav';

export default function DashboardLayout({
    children,
    modal
  }: {
    children: React.ReactNode,
    modal: React.ReactNode
  }) {
    return (
       <div id='dashboard' className="flex" style={{height: '100vh', padding: '1.5em 2em'}}>
            <div className="container-left">
                <Nav />
            </div>
            <div className="container-right place-content-center">
                <TopNav />
                {children}
                {modal}
                <div id="modal-root" />
            </div>
        </div> 
    ) 
  }