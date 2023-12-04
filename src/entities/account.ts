import { Transaction } from "./transaction";

export class Account {
    private title: string;
    private credit_value: number;

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
