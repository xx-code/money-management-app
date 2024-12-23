'use client'

import { useAccountsFetching } from "@/app/(dashboard)/hooks/accounts";
import DeleteSaveGoalForm from "@/app/components/forms/deleteSaveGaolForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DelSaveGoalPage({params: {id}}: { params: {id: string}}) {
    const accountsHook = useAccountsFetching(false)
    const router = useRouter()

    const renderSavingForm = () => {

        if (accountsHook.loading) {
            return (
                <div>Loading...</div>
            )
        }

        return (
            <DeleteSaveGoalForm 
                accounts={accountsHook.accounts} 
                saveGoalId={id} 
                onSubmit={() => router.back()}            
            />
        ) 
    }

    useEffect(() => {
        accountsHook.fetchAllAccounts()
    }, [])

    return (
        <div>
            {renderSavingForm()}
        </div>
    )
}