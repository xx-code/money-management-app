'use client'

import TopNav from "../topNav";
import { useEffect, useState } from "react";
import axios from "axios";
import { RequestDeleteSaveGoal } from "@/core/interactions/saveGoal/deleteSaveGoal";
import { useSaveGoals } from "../hooks/saveGoal";
import ListSavingGoal from "./components/listSavingGoal";
import Button from "@/app/components/button";
import { useRouter } from "next/navigation";

export default function Saving() {
    const hookSaveGoals = useSaveGoals()
    const router = useRouter()

    useEffect(() => {
        hookSaveGoals.fetchSaveGoal()
    }, [])

    return (
        <>
            <TopNav title="But d'epargne" />
            <div style={{ marginTop: '2rem' }}>
                <div style={{display: 'flex'}}>
                    <Button title={"Ajouter un but"} backgroundColor={"#6755D7"} colorText={"white"} onClick={() => router.push('/saving/new-save-goal')} />
                </div>
                <ListSavingGoal 
                    saveGoals={hookSaveGoals.saveGoals} 
                    onUpdateSaveGoals={(id: string) => router.push(`/saving/${id}`)} 
                    onIncreaseSaveGoal={(id: string) => router.push(`/saving/add/${id}`)} 
                    onDeleteSaveGoal={(id: string) => router.push(`/saving/delete/${id}`)} 
                    onTransfertSaveGoal={() => {}}                
                />
            </div>
        </>
    )
}