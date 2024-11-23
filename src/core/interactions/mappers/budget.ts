import { Budget, BudgetBuilder, Period } from "@/core/entities/budget";
import DateParser from "@/core/entities/date_parser";

export type BudgetDto = {
    id: string;
    title: string;
    target: number;
    is_archived: boolean
    period: string|null;
    period_time: number;
    date_start: string;
    date_update: string
    date_end: string|null;
    tags: Array<string>;
    categories: Array<string>;
}

export class MapperBudger {

    static to_domain(budget_dto: BudgetDto): Budget {
        const budget_builder = new BudgetBuilder()
        budget_builder.setId(budget_dto.id)
        budget_builder.setIsArchived(budget_dto.is_archived)
        budget_builder.setTitle(budget_dto.title)
        budget_builder.setTarget(budget_dto.target)
        budget_builder.setDateStart(DateParser.from_string(budget_dto.date_start))
        budget_builder.setDateUpdate(DateParser.from_string(budget_dto.date_update))
        budget_builder.setTags(budget_dto.tags)
        budget_builder.setCategories(budget_dto.categories)
        budget_builder.setPeriodTime(budget_dto.period_time)

        if (budget_dto.date_end !== null)
            budget_builder.setDateEnd(DateParser.from_string(budget_dto.date_end))

        if (budget_dto.period !== null)
            budget_builder.setPeriod(<Period>budget_dto.period)

        return budget_builder.getBudget()!
    }

    static to_persistence(budget: Budget): BudgetDto {
        return {
            id: budget.id,
            title: budget.title,
            is_archived: budget.is_archived,
            period: budget.period,
            period_time: budget.period_time,
            categories: budget.categories,
            date_start: budget.date_start.toString(),
            date_end: budget.date_end ? budget.date_end.toString() : '',
            date_update: budget.date_update.toString(),
            tags: budget.tags,
            target: budget.target
        }
    }
}