import Title from "@/app/components/title";
import CardResumeHome from "./cardResumeHome";
import { CardResumeSpend } from "./cardResumeSpend";
import CardStat from "./cardStats";

export default function Home() {
    return (
        <div className="flex">
            <div>
                <CardResumeHome />
                <CardStat /> 
            </div>
            <div style={{marginLeft: '2rem'}}>
                <div style={{marginTop: '2em'}}>
                    <Title value="Resume" />
                    <div className="flex">
                        <CardResumeSpend title="Total depense" last_month="885.00" current_month="885.12"/>
                        <CardResumeSpend title="Total gains"/>
                    </div> 
                </div>
            </div>
        </div>
        
    );
}