<<<<<<< HEAD
import Title from "../../components/title";
=======
'use client';

import Title from "@/app/components/title";
>>>>>>> e8c6855c8dc72db4ee8d4c5d395eead794367332
import CardResumeHome from "./cardResumeHome";
import { CardResumeSpend } from "./cardResumeSpend";
import CardStat from "./cardStats";
import Button from "../../components/button";
import ListTransaction from "./listTransaction";
import { ElementRef, useRef } from "react";

import Link from 'next/link';
import TransactionEditorPage from "./transactionPage/[id]/page";

export default function Home() {
    const dialogRef = useRef<ElementRef<'dialog'>>(null);

    function openModal() {
        dialogRef.current?.showModal();
        console.log('34');
    }

    function closeModal() {
        dialogRef.current?.close()
    }

    return (
        <>
            <div className="flex">
                <div>
                    <CardResumeHome onClickAddAccount={openModal} />
                    <CardStat /> 
                </div>
                <div style={{marginLeft: '2rem'}}>
                    <div style={{marginTop: '2em'}}>
                        <Title value="Resume" />
                        <div className="flex">
                            <CardResumeSpend title="Total depense" last_month="885.00" current_month="885.12"/>
                            <CardResumeSpend title="Total gains"/>
                        </div> 

                        <div style={{marginTop: '2em'}}>
                            <div className="flex justify-between items-center">
                                <Title value="Historique de transactions" />
                                <Button title="Voir tout" onClick={() => {}} backgroundColor="#6755D7" colorText="white"  />  
                            </div>
                            <ListTransaction transactions={[1]} />
                        </div>
                    </div>
                </div>
            </div>
            <dialog ref={dialogRef} onClose={closeModal}>
                <h3>00000000</h3>
                <button onClick={closeModal} className="close-button" />
            </dialog>
        </>
    );
}