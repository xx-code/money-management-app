export type BudgetCategoryModel = {
    id: string
    title: string
    icon: string
    color: string|null
 }
 
 
 export type BudgetTagModel = {
    id: string
    title: string
    color: string|null
 }
 
 
 export type BudgetModel = {
    id: string,
    title: string,
    target: number,
    categories: BudgetCategoryModel[],
    tags: BudgetTagModel[]
    period: string|null
    periodTime: number
    currentBalance: number
    startDate: string
    updateDate: string
    endDate: string|null
 }