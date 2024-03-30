import './index.css';

export default function CardTransaction() {
    return (
        <div className="card-transaction">
            <div className="card-transaction-content">
                <div className='card-transction-content-icon'>
                    <div className="card-transaction-icon">
                        <div className="icon">
                            <div className="icon-in"></div>
                        </div>
                    </div>
                    <div className="card-transaction-info">
                        <h3>Shopping</h3>
                        <p>Grocery shopping</p>
                    </div>  
                </div>
                
                <div className="card-transaction-price">
                    <h4>-$150</h4>
                    <h5>12 August 2023</h5>
                </div>
            </div>
        </div>
    )
}