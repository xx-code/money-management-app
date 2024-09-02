import { isValidDateTime, isValidDateTimeRegex } from "./libs";

export default class DateParser {
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

    static from_date(date: Date): DateParser {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day_date = date.getDate();

        return new DateParser(year, month, day_date)
    }


    static from_string(date_format: string): DateParser {
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