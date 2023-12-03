export class Account {
    title: string;
    credit_value: number;

    constructor(title: string, credit_value: number) {
        this.title = title;
        this.credit_value = credit_value;
    }

    get_title(): string {
        return this.title;
    }

    get_credit_value(): number {
        return this.credit_value;
    }
}
