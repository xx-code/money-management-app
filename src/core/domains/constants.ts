import EntityError from "../errors/entityError"

export enum Period {
    YEAR = 'Year',
    MONTH = 'Month',
    WEEK = 'Week',
    DAY = 'Day'
}

export function mapperPeriod(value: string): Period {
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
 

export const FREEZE_CATEGORY_ID = 'category-freeze'

export const SAVING_CATEGORY_ID = 'category-saving'

export const TRANSFERT_CATEGORY_ID = 'category-transfert'

export type typePeriod = keyof typeof Period
