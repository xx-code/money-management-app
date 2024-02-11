import Dropdown from "@/app/components/dropdown";
import ListTransaction from "../home/listTransaction";
import Button from "@/app/components/button";
import CardInfoResume from "./cardInfoResume";

import './page.css';

export default function Transactions() {
    return (
        <div className="transactions">
            <div className="top-info">
                <Dropdown values={['Perso', 'Epargne', 'Voiture']} customClassName="dropdown-account" backgroundColor="#313343" color="white" />
                <div className="list-info"> 
                    <CardInfoResume total_spend={null} total_earning={null} /> 
                    <div>
                        <Dropdown values={['Prix decroissant', 'Prix croissant']} customClassName="" backgroundColor="white" color="#6755D7" />
                    </div>
                </div>
            </div>
            <div className="transactions-content">
                <div className="left-content">
                    <div className="list">
                        <ListTransaction transactions={[1, 3, 4, 5]} />
                        <div className="list-button">
                            <Button backgroundColor="#1E3050" colorText="white" title="Precedent" />
                            <Button backgroundColor="#6755D7" colorText="white" title="Suivant"/>
                        </div>
                    </div>
                </div>
                <div className="right-content">
                    <div className="filter-part">
                        <div className="filter-part-content">
                            <div className="filter-title-content">
                                <h3>Filtrage</h3>
                                <Button backgroundColor="transparent" colorText="#6755D7" title="reintialise"/>
                            </div>
                            <div className="filter-dropdown-content">
                                <Dropdown values={['Category', 'blabla', 'un autre blabla']} customClassName="" backgroundColor="#E6E6E6" color="#7E7E7E;"/>
                                <div className="tags">
                                    <span> content selectionner </span>
                                    <span> content selectionner </span>
                                    <span> content selectionner </span>
                                </div>
                            </div>
                            <div className="filter-dropdown-content">
                                <Dropdown values={['Tag', 'blabla', 'un autre blabla']} customClassName="" backgroundColor="#E6E6E6" color="#7E7E7E;"/>
                                <div className="tags">
                                    content selectionner
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}