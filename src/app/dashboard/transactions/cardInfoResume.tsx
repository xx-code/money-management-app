import './cardInfoResume.css';

export default function CardInfoResume({total_spend, total_earning}: {total_spend: number|null, total_earning: number|null}) {
    let spend = '-------';
    let earning = '-------';

    if (total_spend != null) {
        spend = total_spend.toString()
    }

    if (total_earning != null) {
        earning = total_earning.toString()
    }

    return (
        <div className='card-info-resume'>
            <div className='card-info-resume-content'>
                <div className='card'>
                    <h3>Total depsense</h3>
                    <p className='card-spend'>${spend}</p>
                </div>
                <div className='card'>
                    <h3>Total gains</h3>
                    <p className='card-earning'>${earning}</p>
                </div>
                <div className='card'>
                    <h3>Total difference</h3>
                    <p className='card-diff'>${Math.round((Number(earning) + Number(spend)) * 100)/100}</p>
                </div>
            </div>
        </div>
    )
}