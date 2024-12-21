import ValidationError  from '../errors/validationError';
import { Period } from './constants';

// Todo: Refactor helpers 

export function formatted(value: string): string {
    let formattedValue = value.toUpperCase();
    formattedValue = formattedValue.trimStart();
    formattedValue = formattedValue.trimEnd();
    formattedValue = formattedValue.replaceAll(' ', '_');

    return formattedValue;
}

export function reverseFormatted(formattedValue: string): string {
    let value = formattedValue.replaceAll('_', ' ');
    value = value.toLowerCase();
    value = value[0].toUpperCase() + value.slice(1);
    
    return value;
}

export function isEmpty(value: any):boolean {
    if (value == undefined || value == null) {
        return true;
    }

    if (typeof value === 'string') {
        // Use trim() method to remove leading and trailing whitespaces
        const trimmedString = value.trim();

        // Check if the trimmed string is empty
        return !trimmedString.length;
    }
    
    return false
}

export function diffBetweenDateBy(dt2: Date, dt1: Date, period: Period): number {
    let diff =(dt2.getTime() - dt1.getTime()) / 1000;

    if (period === Period.YEAR) {
        diff /= (60 * 60 * 24 * 7 * 4 * 12);
        return Math.abs(Math.round(diff))
    }

    if (period === Period.MONTH) {
        diff /= (60 * 60 * 24 * 7 * 4);
        return Math.abs(Math.round(diff))
    }

    if (period === Period.WEEK) {
        diff /= (60 * 60 * 24 * 7);
        return Math.abs(Math.round(diff))
    }

    if (period === Period.DAY) {
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

export function determinedEndDateWith(date: Date, period: Period, period_time: number, repeat: number = 1): DateParser {
    let end_date = new Date(date);
    let period_repeat = (period_time * repeat)
    if (period === 'Year') {
        end_date.setFullYear(end_date.getFullYear() + period_repeat)
    } 
    else if (period === "Month") {
        end_date.setMonth(end_date.getMonth() + period_repeat)
    }
    else if (period === "Week") {
        end_date.setDate(end_date.getDate() + (7 * period_repeat))
    } 
    else if (period === "Day") {
        end_date.setDate(end_date.getDate() + period_repeat)
    } else {
        throw new ValidationError('There a error in field period');
    }
    return new DateParser(end_date.getFullYear(), end_date.getMonth() + 1, end_date.getDate());
}

export type CurrentDateBudget = {
    start_date: DateParser,
    end_date: DateParser
}
export function determinedStartEndDate(date: Date, period: Period, period_time: number): CurrentDateBudget {
    let start_date = null;
    let end_date = null;

    let today_year = date.getFullYear();
    let today_month = date.getMonth();
    let today_week_day = date.getDay();


    if (period === Period.YEAR) {
        let year = today_year * period_time
        start_date = new Date(year, 0, 1);
        end_date = new Date(year, 31, 11);
    } 
    else if (period === Period.MONTH) {
        let month = today_month + (11 * (period_time - 1))
        start_date = new Date(today_year, month, 1);
        let last_day_of_month = new Date(today_year, today_month + 1, 0).getDate();
        end_date = new Date(today_year, month, last_day_of_month);
    }
    else if (period === Period.WEEK) {
        let day = (date.getDate() + (6 * (period_time - 1)))
        let monday_date = day - today_week_day + (today_week_day === 0 ? -6 : 0);
        let sunday_date = day - (6-today_week_day);
        start_date = new Date(today_year, today_month, monday_date);
        end_date = new Date(today_year, today_month, sunday_date);
    } 
    else {
        throw new ValidationError('There a error in field period');
    }

    return {
        start_date: new DateParser(start_date.getFullYear(), start_date.getMonth() + 1, start_date.getDate()),
        end_date: new DateParser(end_date.getFullYear(), end_date.getMonth() + 1, end_date.getDate())
    };
}

export function determinedStartEndDateBudget(period: Period, period_time: number): CurrentDateBudget {
    let today = new Date();
    return determinedStartEndDate(today, period, period_time)
}

export function searchInArr(value: string, array: string[]) : string[] {
    let results = array.filter(value_arr => value_arr.toLowerCase().search(value.toLowerCase()) !== -1);
    return results;
}

export class DateParser {
    private year: number = 0;
    private month: number = 0;
    private day: number = 0;
    private hours: number = 0
    private minutes: number = 0
    private seconds: number = 0

    private verify_date() {
        if (this.year <= 0) {
            throw Error('Year must be greater than 0');
        }

        if (this.month <= 0 || this.month > 12) {
            throw Error('Month must between 1 to 12');
        }

        if (this.day <= 0 || this.day > 31) {
            throw Error('Day must between 1 to 31');
        }

        if (this.month == 2 && this.day > 29) {
            throw Error('Febrary have max 29 day');
        }

        if (this.hours < 0 || this.hours > 23) {
            throw Error('hours must between 0 to 23 hours: ' + this.hours);
        }

        if (this.minutes < 0 || this.minutes > 59) {
            throw Error('Minutes must between 0 to 60');
        }

        if (this.seconds < 0 || this.seconds > 59) {
            throw Error('Seconds must between 0 to 60');
        }
    }

    constructor(year: number, month: number, day: number, hours = 0, minutes = 0, seconds = 0) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.hours = hours
        this.minutes = minutes
        this.seconds = seconds

        this.verify_date();
    }

    static formatTime(time: number): string{
        return ('0' + time).slice(-2)
    }

    public toString(format: 'date'|'datetime' = 'date'): string {
        let month: string = this.month.toString();
        let day: string = this.day.toString();

        if (this.month < 10) {
            month = '0'+this.month
        }

        if (this.day < 10) {
            day = '0'+this.day
        }

        if (format === 'datetime') {
            console.log(`${DateParser.formatTime(this.hours)}:${DateParser.formatTime(this.minutes)}:${DateParser.formatTime(this.seconds)}`)
            return `${this.year}-${month}-${day} ${DateParser.formatTime(this.hours)}:${DateParser.formatTime(this.minutes)}:${DateParser.formatTime(this.seconds)}`
        }
 
        return `${this.year}-${month}-${day}`;
    }

    public toDate(): Date {
        return new Date(this.year, this.month - 1, this.day, this.hours, this.minutes, this.seconds)
    }

    public compare(date: DateParser) {
        // -1 this inferior at date
        // 1 this supperior at date
        if (this.getYear() < date.getYear()) {
            return -1
        } else if (this.getYear() > date.getYear()) {
            return 1
        }

        if (this.getMonth() < date.getMonth()) {
            return -1
        } else if (this.getMonth() > date.getMonth()) {
            return 1
        }

        if (this.getDay() < date.getDay()) {
            return -1
        } else if (this.getDay() > date.getDay()) {
            return 1
        }

        if (this.getHours() < date.getHours()) {
            return -1
        } else if (this.getHours() > date.getHours()) {
            return 1
        }

        if (this.getMinutes() < date.getMinutes()) {
            return -1
        } else if (this.getMinutes() > date.getMinutes()) {
            return 1
        }

        if (this.getSeconds() < date.getSeconds()) {
            return -1
        } else if (this.getSeconds() > date.getSeconds()) {
            return 1
        }

        return 0
    }

    public getYear(): number {
        return this.year;
    }

    public getMonth(): number {
        return this.month;
    }

    public getDay(): number {
        return this.day;
    }

    public getHours(): number {
        return this.hours
    }

    public getMinutes(): number {
        return this.minutes
    }

    public getSeconds(): number {
        return this.seconds
    }

    public setYear(year: number) {
        this.year = year;
        this.verify_date()
    }

    public setMonth(month: number) {
        this.month = month;
        this.verify_date()
    }

    public setDay(day: number) {
        this.day = day;
        this.verify_date()
    }

    public setHours(hours: number) {
        this.hours = hours
        this.verify_date()
    }

    public setMinutes(minutes: number) {
        this.minutes = minutes
        this.verify_date()
    }

    public setSeconds(seconds: number) {
        this.seconds = seconds
        this.verify_date()
    }

    static now(): DateParser {
        let date = new Date();
        return new DateParser(date.getFullYear(), date.getMonth()+1, date.getDate());
    }

    static fromDate(date: Date): DateParser {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day_date = date.getDate();

        return new DateParser(year, month, day_date)
    }


    static fromString(date_format: string): DateParser {
        // TODO add machter to respect yyyy-mm-dd format

        if (!isValidDateTimeRegex(date_format)) {
            throw Error('No good format yyyy-mm-dd or hh:mm:ss format: ' + date_format )
        }

        let [year, month, date] = date_format.split('-');

        if (date.length == 2) {
            return new DateParser(Number(year), Number(month), Number(date))
        } 
        
        let new_date = date.slice(0, 2)
        let times = date.slice(3)

        let [hours, minutes, seconds] = times.split(':');
        
        return new DateParser(Number(year), Number(month), Number(new_date), Number(hours), Number(minutes), Number(seconds))
    }
}

export class Money {
    private amount: number;
    private currency: string;


    constructor(amount: number = 0, currency: string = 'CAD') {
        if (amount < 0) {
            throw new Error("Amount cannot be negative.");
        }
        this.amount = amount;
        this.currency = currency.toUpperCase();
    }

    // Getter pour obtenir la valeur de l'argent
    getAmount(): number {
        return this.amount;
    }

    // Getter pour obtenir la devise
    getCurrency(): string {
        return this.currency;
    }

    // Ajouter de l'argent (même devise)
    add(money: Money): Money {
        if (this.currency !== money.getCurrency()) {
            throw new Error("Currencies must match to add amounts.");
        }
        return new Money(this.amount + money.getAmount(), this.currency);
    }

    // Soustraire de l'argent (même devise)
    subtract(money: Money): Money {
        if (this.currency !== money.getCurrency()) {
            throw new Error("Currencies must match to subtract amounts.");
        }
        const result = this.amount - money.getAmount();
        if (result < 0) {
            throw new Error("Resulting amount cannot be negative.");
        }
        return new Money(result, this.currency);
    }

    // Convertir la devise
    convertTo(newCurrency: string, conversionRate: number): Money {
        if (conversionRate <= 0) {
            throw new Error("Conversion rate must be greater than 0.");
        }
        const convertedAmount = this.amount * conversionRate;
        return new Money(convertedAmount, newCurrency.toUpperCase());
    }

    // Affichage formaté
    toString(): string {
        return `${this.amount.toFixed(2)} ${this.currency}`;
    }
}
 