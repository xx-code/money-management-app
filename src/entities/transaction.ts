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
    get_price(): number;
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

    get_price(): number {
        return 0;
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

    get_price(): number {
        return 0;
    }
}


export class Transaction {
    constructor(account: Account, title: string, type: TypeTransaction, description: string, price: number, date: Date) {

    }

    set_title(title: string): void {
        
    }

    set_description(desc: string): void {
        
    }

    set_price(price: number): void {
        
    }


    set_date(date: Date): void {
        
    }

    get_account(): Account {
        return new Account('gd', 0);
    }

    get_title(): string {
        return '';
    }

    get_description(): string {
        return '';
    }

    get_price(): number {
        return 0;
    }

    get_category(): Category {
        return Category.Debts;
    }

    get_date(): Date {
        return new Date()
    }
}