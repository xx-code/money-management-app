import { ApiGetBudget } from "@/app/api/budget/[id]/route";
import { BudgetOutput } from "@/core/interactions/budgets/getAllBudgetUseCase";
import { useState } from "react";

export function useBudgetsFetching() {
    const [budgets, setBudgets] = useState<BudgetOutput>() 
}