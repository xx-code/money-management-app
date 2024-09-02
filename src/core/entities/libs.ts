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

export function isValidDateTimeRegex(value: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}(?:\s+\d{2}:\d{2}:\d{2})?$/;
    return regex.test(value.trim());
}

export function isValidDateTime(value: string): boolean {
    // Trim any leading or trailing spaces
    value = value.trim();

    // Split the string into date and time parts
    const [datePart, timePart] = value.split(' ');

    // Validate the date part
    if (!isValidDate(datePart)) {
        return false;
    }

    // If there's no time part, it's a valid yyyy-mm-dd format
    if (!timePart) {
        return true;
    }

    // Validate the time part
    return isValidTime(timePart);
}

function isValidDate(dateStr: string): boolean {
    const dateParts = dateStr.split('-');
    if (dateParts.length !== 3) {
        return false;
    }

    const [year, month, day] = dateParts.map(Number);

    // Check if year, month, and day are numbers and within valid ranges
    if (year < 1000 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) {
        return false;
    }

    // Check if the day is valid for the given month
    const daysInMonth = new Date(year, month, 0).getDate();
    return day <= daysInMonth;
}

function isValidTime(timeStr: string): boolean {
    const timeParts = timeStr.split(':');
    if (timeParts.length !== 3) {
        return false;
    }

    const [hour, minute, second] = timeParts.map(Number);

    // Check if hour, minute, and second are within valid ranges
    return hour >= 0 && hour < 24 && minute >= 0 && minute < 60 && second >= 0 && second < 60;
}

    

export const periodsFrench = {Day: 'Jour', Month: 'Mois', Week: 'Semaine', Year: 'Année'}