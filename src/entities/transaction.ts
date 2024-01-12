export enum Type {
    Debit,
    Credit
}

export type Transaction = {
    account_ref: string;
    tag_ref: string|null;
    category_ref: string; 
    type: Type;
    price: number;
    date: Date;
    description: string;
}

export type TransactionDisplay = {
    id: string;
    account_ref: string;
    category_ref: string;
    tag_ref: string|null;
    type: string;
    price: number;
    date: Date;
    description: string;
}