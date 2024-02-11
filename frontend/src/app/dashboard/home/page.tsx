import Title from "../../components/title";
import CardResumeHome from "./cardResumeHome";
import { CardResumeSpend } from "./cardResumeSpend";
import CardStat from "./cardStats";
import Button from "../../components/button";
import ListTransaction from "./listTransaction";

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
                        <CardResumeSpend title="Total gains" last_month={undefined} current_month={undefined} />
                    </div> 

                    <div style={{marginTop: '2em'}}>
                        <div className="flex justify-between items-center">
                            <Title value="Historique de transactions" />
                            <Button title="Voir tout" backgroundColor="#6755D7" colorText="white" />  
                        </div>
                        <ListTransaction transactions={[1]} />
                    </div>
                </div>
            </div>
        </div>
        
    );
}