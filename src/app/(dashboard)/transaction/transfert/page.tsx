'use client'

import { useEffect } from "react"
import { useAccountsFetching } from "../../hooks/accounts"
import FreezeTransactionForm from "@/app/components/forms/freezeTransactionForm"
import { useRouter } from "next/navigation"
import TransfertTransactionForm from "@/app/components/forms/transfertTransactionForm"

export default function TransfertPage() {
    const accountHook = useAccountsFetching(false)
    const router = useRouter()

    const renderForm = () => {
        if (accountHook.loading) {
            return (
                <div>Loading..</div>
            )
        }

        return (
            <TransfertTransactionForm 
                accounts={accountHook.accounts} 
                onSubmit={() => router.back()}            
            />
        )
    }

    useEffect(() => {
        accountHook.fetchAllAccounts()
    }, [])

    return (
        <div>
            {
                renderForm()
            }
        </div>
    )
}