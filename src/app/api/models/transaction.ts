export type TransactionModel = {
    id: string
    accountId: string, 
    category: {
        categoryId: string,
        title: string,
        icon: string,
        color: string|null
    }
    date: string,
    tags: {tagId: string, value: string, color: string|null}[], 
    type: string, 
    amount: number, 
    description: string
}

