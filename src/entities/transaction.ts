export enum Category {
    Debit,
    Credit
}

export type Transaction = {
    account_ref: string;
    type: Category;
    price: number;
    date: Date;
    description: string;
}
