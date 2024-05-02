export type Account = {
    id: string;
    title: string;
    credit_value: number;
    credit_limit: number;
}

export type AccountDisplay = Account & {
    balance: number
}