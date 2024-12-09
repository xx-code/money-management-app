import EntityError from "../errors/entityError"
import { TransactionType } from "./entities/transaction"

export enum Period {
    YEAR = 'Year',
    MONTH = 'Month',
    WEEK = 'Week',
    DAY = 'Day'
}

export function mapperPeriod(value: string): Period {
    value = value.toLocaleUpperCase()
    if (!(value in Period))
        throw new EntityError('Error while map Period')
   
    if (value === Period.YEAR)
        return Period.YEAR
 
 
    if (value === Period.MONTH)
        return Period.MONTH
 
 
    if (value === Period.WEEK)
        return Period.WEEK
 
 
    if (value == Period.DAY)
        return Period.DAY
   
    return Period.DAY
}

export function mapperTransactionType(value: string): TransactionType {
    if (!(value in TransactionType))
        throw new EntityError('error while map transaction')

    if (value === "CREDIT")
        return TransactionType.CREDIT

    return TransactionType.DEBIT
}
 

export const FREEZE_CATEGORY_ID = 'category-freeze'

export const SAVING_CATEGORY_ID = 'category-saving'

export const TRANSFERT_CATEGORY_ID = 'category-transfert'

export type typePeriod = keyof typeof Period
