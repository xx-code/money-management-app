export enum Period {
    YEAR = 'Year',
    MONTH = 'Month',
    WEEK = 'Week',
    DAY = 'Day'
}

export const FREEZE_CATEGORY_ID = 'category-freeze'

export const SAVING_CATEGORY_ID = 'category-saving'

export const TRANSFERT_CATEGORY_ID = 'category-transfert'

export type typePeriod = keyof typeof Period
