import { ValidationError } from "../errors/validationError";
import { Period } from "./budget";
import DateParser from "./date_parser";
import { is_empty } from "./verify_empty_value";

export function search_in_array(value: string, array: string[]) : string[] {
    let results = array.filter(value_arr => value_arr.toLowerCase().search(value.toLowerCase()) !== -1);
    return results;
}

export function diff_between_date_by(dt2: Date, dt1: Date, period: Period): number {
    let diff =(dt2.getTime() - dt1.getTime()) / 1000;

    if (period === 'Year') {
        diff /= (60 * 60 * 24 * 7 * 4 * 12);
        return Math.abs(Math.round(diff))
    }

    if (period === 'Month') {
        diff /= (60 * 60 * 24 * 7 * 4);
        return Math.abs(Math.round(diff))
    }

    if (period === 'Week') {
        diff /= (60 * 60 * 24 * 7);
        return Math.abs(Math.round(diff))
    }

    if (period === 'Day') {
        diff /= (60 * 60 * 24);
        return Math.abs(Math.round(diff))
    }
    
    return -1;
  
 }

export const periodsFrench = {Month: 'Mois', Week: 'Semaine', Year: 'Année'}