import CardBudget from "@/app/components/cardBudget";

export default function ListBudget({budgets}: {budgets: any[]}) {
    return (
        <div>
            {
                budgets.map((key, budget) => <CardBudget />)
            }
        </div>
    )
}
