import './index.css';

export default function CardBudget() {
    return (
        <div className='card-budget'>
            <div className='card-budget-content'>
                <div className='card-budget-info'>
                    <div className='percent'>
                        percent graph
                    </div>
                    <div className='card-budget-title'>
                        <h3>title</h3>
                        <div className='card-budget-subtitle'>
                            <div className='money-info target'>
                                <h6>Cible</h6>
                                <p>$9045</p>
                            </div>
                            <div className='money-info'>
                                <h6>Actuel</h6>
                                <p>$5066</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='card-budget-edit-button'>
                    <div className='icon-modif'>
                    </div>
                    <div className='icon-delete'>
                    </div>
                </div>
            </div>
        </div>
    )
}