import CardBudget from "@/app/components/cardWithProgressBar";
import { BudgetOutput } from "@/core/interactions/budgets/getAllBudgetUseCase";

export default function ListBudget({budgets, onUpdate, onDelete}: {budgets: Array<BudgetOutput>, onUpdate: any, onDelete: any}) {
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
                            currentPrice={budget.currentBalance} 
                            onUpdate={() => onUpdate(budget.id)} 
                            onDelete={() => onDelete(budget.id)}
                        />
                    )
                } )
            }
        </div>
    )
}
