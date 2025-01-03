import { Money } from '@/core/domains/helpers';
import './cardResumeSpend.css'

type Props = {
    title: string, 
    lastMonth: Money|undefined, 
    currentMonth: Money|undefined
}

export function CardResumeSpend({title, lastMonth, currentMonth}: Props) {
    
    let percent = '--';
    let color = 'white';

    if (!isNaN(Number(lastMonth?.getAmount()))) {
        let diff = (Number(currentMonth?.getAmount()) - Number(lastMonth?.getAmount())) * 100;
  
        let value_percent = Number(lastMonth?.getAmount()) !== 0 ? Math.abs(diff)/Math.abs(Number(lastMonth?.getAmount())) : NaN;
        if (!isNaN(value_percent)) {
            percent = (Math.round(value_percent * 100)/100).toString();
        }

        if (lastMonth && currentMonth) {
           if (Number(lastMonth.getAmount()) < Number(currentMonth.getAmount())) {
                color = '#4FDC4C';
            } else if (Number(lastMonth) > Number(currentMonth)) {
                color = '#DC4C4C';
            } 
        }
        // refactor
        
    
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
                            <p>{lastMonth? lastMonth.toString() : "---"}</p>
                        </div>
                        <div className="card-resume-spend-sub-info-1">
                            <h6>Mois actuelle</h6>
                            <p>{currentMonth ? currentMonth.toString() : "---"}</p>
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