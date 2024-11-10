import CardBudget from "@/app/components/cardBudget";
import { BudgetWithCategoryDisplay, BudgetWithTagDisplay } from "@/core/entities/budget";

export default function ListBudget({budgets, onUpdate, onDelete}: {budgets: Array<BudgetWithCategoryDisplay|BudgetWithTagDisplay>, onUpdate: any, onDelete: any}) {
    return (
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {
                budgets.map((budget, index) => <CardBudget key={index} budget={budget} onUpdate={onUpdate} onDelete={onDelete}/>)
            }
        </div>
    )
}
