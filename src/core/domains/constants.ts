import EntityError from "../errors/entityError"
import ValidationError from "../errors/validationError"
import { TransactionType } from "./entities/transaction"

export enum Period {
    YEAR = 'Year',
    MONTH = 'Month',
    WEEK = 'Week',
    DAY = 'Day'
}

export const periodsSystem = [
    {
        name: 'Jour',
        value: Period.DAY
    },
    {
        name: 'Semaine',
        value: Period.WEEK
    },
    {
        name: 'Mois',
        value: Period.MONTH
    },
    {
        name: 'Année',
        value: Period.YEAR
    }
]

export const periodsBudget = [
    {
        name: 'Semaine',
        value: Period.WEEK
    },
    {
        name: 'Mois',
        value: Period.MONTH
    },
    {
        name: 'Année',
        value: Period.YEAR
    }
]

export function mapperPeriod(value: string): Period {
    if (value === Period.YEAR)
        return Period.YEAR
 
 
    if (value === Period.MONTH)
        return Period.MONTH
 
 
    if (value === Period.WEEK)
        return Period.WEEK
 
 
    if (value == Period.DAY)
        return Period.DAY
   
    throw new ValidationError('Impossible to mapp period')
}

export function mapperTransactionType(value: string): TransactionType {
    if (value === TransactionType.CREDIT)
        return TransactionType.CREDIT

    return TransactionType.DEBIT
}
 

export const FREEZE_CATEGORY_ID = 'category-freeze'

export const SAVING_CATEGORY_ID = 'category-saving'

export const TRANSFERT_CATEGORY_ID = 'category-transfert'

export type typePeriod = keyof typeof Period
