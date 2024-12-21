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

    async function deleteSaveGoal(id: string, accountId: string) {
        // try {
        //     let req: RequestDeleteSaveGoal = {
        //         account_tranfert_ref: accountId,
        //         save_goal_ref: id
        //     }
        //     // Have stack info
        //     await axios.post(`/api/save-goal/delete`, req)
        //     hookSaveGoals.fetchSaveGoal()
        // } catch(err: any) {
        //     alert(err.response.data)
        // }
    }

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
                    onDeleteSaveGoal={deleteSaveGoal} 
                    onTransfertSaveGoal={() => {}}                
                />
            </div>
        </>
    )
}