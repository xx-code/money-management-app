'use client'

import { useEffect, useState } from "react";
import { useCategories, useTags } from "../../hooks/system";
import BudgetForm from "../../../components/forms/budgetForm";
import axios from "axios";
import { useRouter } from "next/navigation";
import { BudgetModel } from "@/app/api/models/budgets";

export default function Page({params: {id}}: { params: {id: string}}) {
    const hookCategory = useCategories()
    const hookTag = useTags()
    const [budget, setBudget] = useState<BudgetModel>()
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    async function fetchBudget() {
        setLoading(true)
        try {
            if (id !== 'new-budget') {
                let response = await axios.get(`/api/budget/${id}`)
                let budgetRespone: BudgetModel = response.data

                setBudget(budgetRespone)
            }
        } catch(error: any) {
            if (error.response) {
                alert(error.response.data)
            } else if (error.request) {
                alert(error.request)
            } else {
                let unknowError = {message: 'Error unknowType', error}
                alert(unknowError)
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        hookCategory.fetchCategories()
        hookTag.fetchTags()
        fetchBudget()
    }, [])

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

        if (loading) {
            return (
                <div>Loading...</div>
            )
        }

        return (
            <BudgetForm 
                currentBudget={budget} 
                categories={hookCategory.categories} 
                tags={hookTag.tags} 
                onSave={() => router.back()}
            />
        ) 
    }

    return (
        <div>
            {
                renderBudgetForm()
            }
        </div>
    )
}