export type Account = {
    id: string;
    title: string;
    is_saving: boolean;
}

export type AccountDisplay = Account & {
    balance: number
}