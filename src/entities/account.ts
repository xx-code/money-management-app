import { CreditOperation, Transaction } from "./transaction";

export class Account {
    private title: string;
    private credit_value: number;
    private transactions: Array<Transaction> = [];

    constructor(title: string, credit_value: number) {
        this.title = title;
        this.credit_value = credit_value;
    }

    add_transaction(transaction: Transaction) {
        this.transactions.push(transaction);
    }

    get_title(): string {
        return this.title;
    }

    get_credit_value(): number {
        return this.credit_value;
    }

    get_balance(): number {
        let price = 0;
        for(let transaction of this.transactions) {
            price += transaction.get_price();
        }
        return price;
    }
}
