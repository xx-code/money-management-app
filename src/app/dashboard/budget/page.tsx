import Button from "@/app/components/button";
import ListBudget from "./listBudget";

import './page.css';

export default function Budget() {
    return (
        <div className="budgets">
            <div>
                <div>
                    <Button backgroundColor="white" colorText="#6755D7" title="Ajouter Budget Categorie"/>
                    <Button backgroundColor="white" colorText="#6755D7" title="Ajouter Budget Tag"/>
                </div>
            </div>
            <div className="list">
                <ListBudget budgets={[1, 3, ]} />
                <div className="list-button">
                    <Button backgroundColor="#1E3050" colorText="white" title="Precedent" />
                    <Button backgroundColor="#6755D7" colorText="white" title="Suivant"/>
                </div>
            </div>
        </div>
    )
}