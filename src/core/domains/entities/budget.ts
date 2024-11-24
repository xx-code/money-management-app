import EntityError from "@/core/errors/entityError";
import { Period } from "../constants";
import { DateParser, Money } from "../helpers";
import { Record } from "./transaction";

export class Budget {
    id: string = '';
    is_archived: boolean = false 
    title: string = ''
    target: Money = new Money()
    date_start: DateParser = DateParser.now()
    categories: Array<string> = []
    tags: Array<string> = []
    date_update: DateParser = DateParser.now()
    period: Period | null = null
    period_time: number = 0 
    date_end: DateParser|null = null

    __add_event_tag: string[] = []
    __delete_event_tag: string[] = []

    __add_event_category: string[] = []
    __delete_event_category: string[] = []

    computeCurrentSpend(records: Record[]): Money {
        let price_records = records.map(record => record.price);
        let current_spend = price_records.reduce((accumulator, current_value) => accumulator + current_value.getAmount(), 0);
        
        let to_money = new Money(current_spend)

        return to_money;
    }
    
    addTag(tag: string) {
        if (this.tags.includes(tag))
            throw new EntityError('Tag already exist, in Budget. Not duplicate allow.')
        this.__add_event_tag.push(tag)
        if (this.__delete_event_tag.includes(tag)) {
            let index_add_tag = this.__add_event_tag.indexOf(tag)
            this.__add_event_tag.splice(index_add_tag, 1)
        }
        this.tags.push(tag)
    }

    deleteTag(tag: string) {
        let index_tag = this.tags.indexOf(tag)
        if (index_tag < 0)
            throw new EntityError('Tag do not exist, in Budget.')

        this.__delete_event_tag.push(tag)
        if (this.__delete_event_tag.includes(tag)) {
            let index_del_tag = this.__delete_event_tag.indexOf(tag)
            this.__delete_event_tag.splice(index_del_tag, 1)
        }
        this.tags.splice(index_tag, 1)
    }
    
    addCategory(category: string) {
        if (this.categories.includes(category))
            throw new EntityError('Category already exist, in Budget. Not duplicate allow.')

        this.__add_event_category.push(category)
        if (this.__delete_event_category.includes(category)) {
            let index_add_category = this.__add_event_category.indexOf(category)
            this.__add_event_category.splice(index_add_category, 1)
        }

        this.categories.push(category)
    }

    deleteCategory(category: string) {
        let index_category = this.categories.indexOf(category)

        if (index_category < 0)
            throw new EntityError('Tag do not exist, in Budget.')

        this.__delete_event_category.push(category)
        if (this.__delete_event_category.includes(category)) {
            let index_del_category = this.__delete_event_category.indexOf(category)
            this.__delete_event_category.splice(index_del_category, 1)
        }
        this.categories.splice(index_category, 1)
    }
}

export interface IBudgetBuilder {
    reset(): void
    setId(id: string): void
    setTitle(title: string): void
    setTarget(target: Money): void
    setIsArchived(is_archived: boolean): void
    setDateStart(date_start: DateParser): void
    setDateUpdate(date_update: DateParser): void
    setDateEnd(date_end: DateParser): void
    setPeriod(period: Period): void
    setPeriodTime(period_time: number): void
    setCategories(category: Array<string>): void
    setTags(tags: Array<string>): void
}

export class BudgetBuilder implements IBudgetBuilder {
    budget: Budget | null = null

    constructor() {
        this.budget = new Budget()
    }

    reset(): void {
        this.budget = null
    }
    setId(id: string): void {
        if (this.budget)
            this.budget.id = id 
    }
    setIsArchived(is_archived: boolean): void {
        if (this.budget)
            this.budget.is_archived = is_archived
    }
    setTitle(title: string): void {
        if (this.budget)
            this.budget.title = title
    }
    setTarget(target: Money): void {
        if (this.budget)
            this.budget.target = target
    }
    setDateStart(date_start: DateParser): void {
        if (this.budget)
            this.budget.date_start = date_start
    }
    setDateUpdate(date_update: DateParser): void {
        if (this.budget)
            this.budget.date_update = date_update
    }
    setDateEnd(date_end: DateParser): void {
        if (this.budget)
            this.budget.date_end = date_end
    }
    setPeriod(period: Period): void {
        if (this.budget)
            this.budget.period = period
    }
    setPeriodTime(period_time: number): void {
        if (this.budget)
            this.budget.period_time = period_time
    }
    setCategories(categories: Array<string>): void {
        if (this.budget)
            this.budget.categories = categories
    }
    setTags(tags: Array<string>): void {
        if (this.budget)
            this.budget.tags = tags
    }
    
    getBudget(): Budget | null {
        let budget = this.budget
        this.reset()
        return budget
    }
}

