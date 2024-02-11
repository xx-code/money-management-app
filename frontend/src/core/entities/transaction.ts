export type TransactionType ='Debit' | 'Credit';

export type Transaction = {
    account_ref: string;
    tag_ref: string|null;
    category_ref: string; 
    type: TransactionType;
    price: number;
    date: Date;
    description: string;
}

export type TransactionDisplay = {
    id: string;
    account_ref: string;
    category_title: string;
    category_icon: string;
    tag: string|null;
    type: string;
    price: number;
    date: Date;
    description: string;
}