'use client'

import './style.css'
import { useEffect, useReducer, useState } from "react";
import { TransactionType } from "@/core/domains/entities/transaction";
import Button from "@/app/components/button";
import { useAccountsFetching } from "../../hooks/accounts";
import { useCategories, useTags } from "../../hooks/system";
import axios from 'axios';
import { isEmpty } from '@/core/domains/helpers';
import TransactionForm from '@/app/components/forms/transactionForm';
import { useRouter } from 'next/navigation';
import { TransactionModel } from '@/app/api/models/transaction';

export default function TransactionEditorPage({params: {id}}: { params: {id: string}}) {
    const hookAccount = useAccountsFetching(false)
    const hookCategory = useCategories()
    const hookTag = useTags()
    const [transaction, setTransaction] = useState<TransactionModel>()
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    async function getTransaction() {
        setLoading(true)
        try {
            if (id !== 'new-transaction') {
                let response = await axios.get(`/api/transaction/${id}`)
                let transResponse: TransactionModel = response.data
                setTransaction(transResponse)
            }
        } catch(err: any) {
            alert(err)
        }
        setLoading(false)
    }

    const renderBudgetForm = () => {
        if (hookCategory.error) {
            return (
                <div>
                    Error Category: {hookCategory.error}
                </div>
            )
        }

        if (hookTag.error) {
            return (
                <div>
                    Error tag: {hookCategory.error}
                </div>
            )
        }

        if (loading || hookTag.loading || hookAccount.loading) {
            return (
                <div>Loading...</div>
            )
        }

        return (
            <TransactionForm 
                accounts={hookAccount.accounts} 
                categories={hookCategory.categories} 
                tags={hookTag.tags} 
                transaction={transaction} 
                onSubmit={() => router.back()}            
            />
        ) 
    }

    useEffect(() => {
        hookAccount.fetchAllAccounts()
        hookCategory.fetchCategories()
        hookTag.fetchTags()
        getTransaction()
    }, [])
    
    return (
        <div >
            {renderBudgetForm()}
        </div>
    )
}