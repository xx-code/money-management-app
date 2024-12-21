'use client'

import { SaveGoalModel } from "@/app/api/models/save-goal";
import SaveGoalForm from "@/app/components/forms/saveGoalForm";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SaveGoalPage({params: {id}}: { params: {id: string}}) {
    const [saveGoal, setSaveGoal] = useState<SaveGoalModel>()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function getSaveGoal() {
        setLoading(true)
        try {
            if (id !== 'new-save-goal') {
                let response = await axios.get(`/api/save-goal/${id}`)
                let saveGoalResp: SaveGoalModel = response.data
                setSaveGoal(saveGoalResp)
            }
        } catch(err: any) {
            alert(err)
        }
        setLoading(false)
    }

    const renderSavingForm = () => {

        if (loading) {
            return (
                <div>Loading...</div>
            )
        }

        return (
            <SaveGoalForm 
                saveGoal={saveGoal} 
                onSubmit={() => router.back()}             
            />
        ) 
    }

    useEffect(() => {
        getSaveGoal()
    }, [])

    return (
        <div>
            {renderSavingForm()}
        </div>
    )
}