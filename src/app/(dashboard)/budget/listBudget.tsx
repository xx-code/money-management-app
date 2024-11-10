import CardBudget from "@/app/components/cardWithProgressBar";
import { BudgetWithCategoryDisplay, BudgetWithTagDisplay } from "@/core/entities/budget";

export default function ListBudget({budgets, onUpdate, onDelete}: {budgets: Array<BudgetWithCategoryDisplay|BudgetWithTagDisplay>, onUpdate: any, onDelete: any}) {
    return (
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {
                budgets.map((budget, index) => {
                    return (
                        <CardBudget 
                            key={index}
                            title={budget.title}
                            description=""
                            targetPrice={budget.target} 
                            currentPrice={budget.current} 
                            onUpdate={() => onUpdate(budget.id)} 
                            onDelete={() => onDelete(budget.id)}
                        />
                    )
                } )
            }
        </div>
    )
}
