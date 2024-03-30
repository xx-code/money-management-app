import { BudgetCategoryRepository, BudgetTagRepository, dbBudgetCategory, dbBudgetTag } from "../../core/interactions/repositories/budgetRepository";

export class InMemoryBudgetCategory implements BudgetCategoryRepository {
    private db: Map<string, dbBudgetCategory> = new Map();

    save(request: dbBudgetCategory): string {
        this.db.set(request.id, {
            id: request.id,
            categories: request.categories,
            target: request.target,
            title: request.title,
            period: request.period,
            period_time: request.period_time
        });

        return request.id;
    }
    get(id: string): dbBudgetCategoryResponse | null {
        let response = this.db.get(id);
        
        if (response == undefined) {
            return null;
        }

        return {
            id: response.id,
            period: response.period,
            period_time: response.period_time,
            current: 0,
            target: response.target,
            title: response.title,
            categories: response.categories
        };
    }
    get_all(): dbBudgetCategoryResponse[] {
        let budgets = this.db.values();

        let responses: dbBudgetCategoryResponse[] = [];

        for(let budget of budgets) {
            responses.push({
                id: budget.id,
                period: budget.period,
                period_time: budget.period_time,
                current: 0,
                target: budget.target,
                title: budget.title,
                categories: budget.categories
            });
        }
        return responses;
    }
    delete(id: string): boolean {
        return this.db.delete(id);
    }
    update(request: dbBudgetCategoryUpdate): dbBudgetCategoryResponse {
        let budget = this.db.get(request.id);

        if (request.title !== null) {
            budget!.title = request.title;
        }

        if (request.categories !== null) {
            budget!.categories = request.categories;
        }

        if (request.period !== null) {
            budget!.period = request.period;
        }

        if (request.period_time !== null) {
            budget!.period_time = request.period_time;
        }

        if (request.target !== null) {
            budget!.target = request.target;
        }

        this.db = this.db.set(request.id, budget!);

        return {
            id: budget!.id,
            period: budget!.period,
            period_time: budget!.period_time,
            current: 0,
            target: budget!.target,
            title: budget!.title,
            categories: budget!.categories
        }
    }
}

export class InMemoryBudgetTag implements BudgetTagRepository{
    private db: Map<string, dbBudgetTag> = new Map();

    save(request: dbBudgetTag): string {
        this.db.set(request.id, {
            id: request.id,
            tags: request.tags,
            target: request.target,
            title: request.title,
            date_start: request.date_start,
            date_end: request.date_end
        });

        return request.id;
    }
    get(id: string): dbBudgetTagResponse | null {
        let response = this.db.get(id);
        
        if (response == undefined) {
            return null;
        }

        return {
            id: response.id,
            date_start: response.date_start,
            date_end: response.date_end,
            current: 0,
            target: response.target,
            title: response.title,
            tags: response.tags
        };
    }
    get_all(): dbBudgetTagResponse[] {
        let budgets = this.db.values();

        let responses: dbBudgetTagResponse[] = [];

        for(let budget of budgets) {
            responses.push({
                id: budget.id,
                date_start: budget.date_start,
                date_end: budget.date_end,
                current: 0,
                target: budget.target,
                title: budget.title,
                tags: budget.tags
            });
        }
        return responses;
    }
    delete(id: string): boolean {
        return this.db.delete(id);
    }
    update(request: dbBudgetTagUpdate): dbBudgetTagResponse {
        let budget = this.db.get(request.id);

        if (request.title !== null) {
            budget!.title = request.title;
        }

        if (request.target != null) {
            budget!.target = request.target;
        }

        if (request.tags !== null) {
            budget!.tags = request.tags;
        }

        if (request.date_start !== null) {
            budget!.date_start = request.date_start;
        }

        if (request.date_end !== null) {
            budget!.date_end = request.date_end;
        }

        this.db = this.db.set(request.id, budget!);

        return {
            id: budget!.id,
            date_end: budget!.date_end,
            date_start: budget!.date_start,
            current: 0,
            target: budget!.target,
            title: budget!.title,
            tags: budget!.tags
        }
    }
}

