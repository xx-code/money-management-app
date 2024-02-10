'use client'

import RangeSlider from "@/app/components/rangeSlider";
import Title from "../../components/title";
import Dropdown from "@/app/components/dropdown";
import Button from "@/app/components/button";

import './cardResumeHome.css';
import { useState } from "react";


export default function CardResumeHome({ onClickAddAccount }: { onClickAddAccount: any }) {
    const [range, setRange ] = useState(0);
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRange(parseInt(event.target.value));
    };

    return (
        <div className="card-resume-home">
            <Title value="Mon solde"/>
            <div className="card-resume-content">
                <div className="card-resume-dropdown"> 
                    <Dropdown values={['Tous les comptes', 'Perso', 'Voiture']} backgroundColor={null} color="white" />
                </div>
                <div className='card-resume-balance'>
                    <h6>$ 12502,00</h6>
                </div>
                <div className="card-resume-slider">
                    <p>Limite d'endettement</p>
                    <RangeSlider min={0} max={6600} value={range} onChange={handleInputChange}/>
                </div>
                <div className="card-resume-button">
                    <Button backgroundColor="#6755D7" onClick={onClickAddAccount} colorText="white" title="Ajouter compte"/>
                </div>
            </div>
        </div>
    )
}