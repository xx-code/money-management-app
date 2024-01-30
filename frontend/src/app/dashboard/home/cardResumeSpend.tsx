import Title from "@/app/components/title";

export function CardResumeSpend() {
    return (
        <div className="card-resume-spend">
            <div className="card-resume-spend-content">
                <div className="card-resume-spend-info"> 
                    <div className="card-resume-spend-title">
                        <h3>blaba</h3>
                    </div>
                    <div className="card-resume-spend-sub-info">
                        <div className="card-resume-spend-sub-info-1">
                            <h6>Mois passe</h6>
                            <p>$----</p>
                        </div>
                        <div className="card-resume-spend-sub-info-1">
                            <h6>Mois actuelle</h6>
                            <p>$000</p>
                        </div>
                    </div>
                </div>
                <div className="card-resume-spend-info-percent">
                    <div className="card-resume-spend-percent">
                        <h3>12%</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}