import { BudgetModel } from "@/app/api/models/budgets";
import axios from "axios";
import { useState } from "react";

export function useBudgetsFetching() {
    const [budgets, setBudgets] = useState<BudgetModel[]>([]) 
    const [errorBudget, setErrorBudget] = useState<any|null>(null)
    const [loading, setLoading] = useState(true)

    const fetchBudgets = async () => {
        setLoading(true)
        try {
            let response = await axios.get('/api/budget')
            let budgets = response.data
            setBudgets(budgets)
        } catch(error:any) {
            if (error.response) {
                setErrorBudget(error.response.data)
            } else if (error.request) {
                setErrorBudget(error.request)
            } else {
                let unknowError = {message: 'Error unknowType', error}
                setErrorBudget(unknowError)
            }
        }
        setLoading(false)
    }

    return {budgets, errorBudget, loading, fetchBudgets}
}