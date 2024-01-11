import { Account } from './account';
import { Category } from './category';

interface TypeTransaction {
    display_price_transaction(price: number): number;
    get_category(): Category;
}

export class CreditTransaction implements TypeTransaction {
    category: Category;
    constructor(category: Category) {
        this.category = category;
    }

    get_category(): Category {
        return this.category;
    }

    display_price_transaction(price: number): number {
        return -1*Math.abs(price);
    }
}

export class DebitTransaction implements TypeTransaction {
    category: Category;
    constructor(category: Category) {
        this.category = category;
    }

    get_category(): Category {
        return this.category;
    }

    display_price_transaction(price: number): number {
        return Math.abs(price);
    }
}


export class Transaction {
    private account: Account;
    private type: TypeTransaction;
    private description: string;
    private price: number;
    private date: Date;

    constructor(account: Account, type: TypeTransaction, description: string, price: number, date: Date) {
        this.account = account;
        this.type = type;
        this.description = description;
        this.price = price;
        this.date = date;
    }

    set_account(account: Account) {
        this.account = account;
    }

    set_type(type: TypeTransaction) {
        this.type = type;
    }

    set_description(desc: string): void {
        this.description = desc;
    }

    set_price(price: number): void {
        this.price = price;
    }

    set_date(date: Date): void {
        this.date = date;
    }

    get_account(): Account {
        return this.account;
    }

    get_description(): string {
        return this.description;
    }

    get_price(): number {
        return this.type.display_price_transaction(this.price);
    }

    get_category(): Category {
        return this.type.get_category();
    }

    get_date(): Date {
        return this.date;
    }
}