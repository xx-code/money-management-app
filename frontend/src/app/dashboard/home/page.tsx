import CardResumeHome from "./cardResumeHome";
import { CardResumeSpend } from "./cardResumeSpend";
import CardStat from "./cardStats";

export default function Home() {
    return (
        <div>
            <div>
                <CardResumeHome />
                <CardStat /> 
            </div>
            <div>
                <div>
                    <CardResumeSpend />
                    <CardResumeSpend />
                </div> 
            </div>
        </div>
        
    );
}