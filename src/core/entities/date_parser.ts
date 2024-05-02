export default class DateParser {
    private year: number = 0;
    private month: number = 0;
    private day: number = 0;

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
    }

    constructor(year: number, month: number, day: number) {
        this.year = year;
        this.month = month;
        this.day = day;

        this.verify_date();
    }

    public toString(): string {
        let month: string = this.month.toString();
        let day: string = this.day.toString();

        if (this.month < 10) {
            month = '0'+this.month
        }

        if (this.day < 10) {
            day = '0'+this.day
        }
 
        return `${this.year}-${month}-${day}`;
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

        if (!date_format.includes('-')) {
            throw Error('No good format yyyy-mm-dd')
        }

        let [year, month, date] = date_format.split('-');

        return new DateParser(parseInt(year), parseInt(month), parseInt(date))
    }
}