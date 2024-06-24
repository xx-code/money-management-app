import { FutureTransaction } from "@/core/entities/future_transaction";
import DateParser from "../../entities/date_parser";

export type dbFutureTransaction = {
    id: string;
    category_ref: string;
    tag_ref: string[];
    record_ref: string;
    period: string|null;
    period_time: number|null;
    date_end: DateParser;
}

export interface FutureTransactionRepository {
    save(futureTransaction: dbFutureTransaction): Promise<boolean>;
    get(id: string): Promise<FutureTransaction|null>;
    get_all(): Promise<FutureTransaction[]>;
    delete(id: string): Promise<boolean>;
} 