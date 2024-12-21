import { BudgetModel } from "@/app/api/models/budgets";
import CardBudget from "@/app/components/cardWithProgressBar";
import { Money } from "@/core/domains/helpers";

type Props = {
    budgets: BudgetModel[],
    onDelete: (id: string) => void
    onUpdate: (id: string) => void
}

export default function ListBudget({budgets, onDelete, onUpdate}: Props) {
    return (
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {
                budgets.map((budget, index) => {
                    return (
                        <CardBudget 
                            key={index}
                            title={budget.title}
                            description=""
                            targetPrice={new Money(budget.target)} 
                            currentPrice={new Money(budget.currentBalance)} 
                            onUpdate={() => onUpdate(budget.id)} 
                            onDelete={() => onDelete(budget.id)}
                        />
                    )
                } )
            }
        </div>
    )
}
