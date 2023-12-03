import { Account } from './account';

export enum Category {
    Housing,
    Healthcare,
    Transportation,
    Food,
    Grocery,
    Transfert,
    Subscriptions,
    Debts,
    Divers,
    Gift,
    Salary,
    Cash,
}

interface TypeTransaction {
    get_price(price: number): number;
    get_category(): Category;
}

export class CreditOperation implements TypeTransaction {
    category: Category;
    constructor(category: Category) {
        this.category = category;
    }

    get_category(): Category {
        return this.category;
    }

    get_price(price: number): number {
        return -1*Math.abs(price);
    }
}

export class DebitOperation implements TypeTransaction {
    category: Category;
    constructor(category: Category) {
        this.category = category;
    }

    get_category(): Category {
        return this.category;
    }

    get_price(price: number): number {
        return Math.abs(price);
    }
}


export class Transaction {
    private account: Account;
    private type: TypeTransaction;
    private title: string;
    private description: string;
    private price: number;
    private date: Date;

    constructor(account: Account, title: string, type: TypeTransaction, description: string, price: number, date: Date) {
        this.account = account;
        this.title = title;
        this.type = type;
        this.description = description;
        this.price = price;
        this.date = date;
    }

    set_title(title: string): void {
        this.title = title;
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

    get_title(): string {
        return this.title;
    }

    get_description(): string {
        return this.description;
    }

    get_price(): number {
        return this.type.get_price(this.price);
    }

    get_category(): Category {
        return this.type.get_category();
    }

    get_date(): Date {
        return this.date;
    }
}