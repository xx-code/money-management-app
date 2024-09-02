import './cardResumeSpend.css'

export function CardResumeSpend({title, last_month='------', current_month='------'} : {title: string, last_month: string|undefined, current_month: string|undefined}) {

    let percent = '--';
    let color = 'white';

    if (!isNaN(Number(last_month))) {
        let diff = (Number(current_month) - Number(last_month)) * 100;
  
        let value_percent = Number(last_month) !== 0 ? Math.abs(diff)/Math.abs(Number(last_month)) : NaN;
        if (!isNaN(value_percent)) {
            percent = (Math.round(value_percent * 100)/100).toString();
        }

        // refactor
        if (Number(last_month) < Number(current_month)) {
            color = '#4FDC4C';
        } else if (Number(last_month) > Number(current_month)) {
            color = '#DC4C4C';
        }
    
    }

    return (
        <div className="card-resume-spend">
            <div className="card-resume-spend-content">
                <div className="card-resume-spend-info"> 
                    <div className="card-resume-spend-title">
                        <h3>{title}</h3>
                    </div>
                    <div className="card-resume-spend-sub-info">
                        <div className="card-resume-spend-sub-info-1">
                            <h6>Dernier mois</h6>
                            <p>${last_month}</p>
                        </div>
                        <div className="card-resume-spend-sub-info-1">
                            <h6>Mois actuelle</h6>
                            <p>${current_month}</p>
                        </div>
                    </div>
                </div>
                <div className="card-resume-spend-info-percent">
                    <div className="card-resume-spend-percent">
                        <h3 style={{color: color}}>{percent}%</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}