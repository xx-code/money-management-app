import { Transaction } from "../entities/transaction";

export type TransactionPaginationResponse = {
    transactions: Transaction[];
    current_page: number;
    max_page: number;
}