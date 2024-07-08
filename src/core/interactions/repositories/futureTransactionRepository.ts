import { FutureTransaction } from "@/core/entities/future_transaction";
import DateParser from "../../entities/date_parser";

export type dbFutureTransaction = {
    id: string;
    account_ref: string;
    is_archived: boolean;
    category_ref: string;
    tag_ref: string[];
    record_ref: string;
    period: string;
    period_time: number;
    repeat: number|null;
    date_start: DateParser,
    date_update: DateParser,
    date_end: DateParser|null;
}

export interface FutureTransactionRepository {
    save(futureTransaction: dbFutureTransaction): Promise<string>;
    update(request: dbFutureTransaction): Promise<FutureTransaction>;
    get(id: string): Promise<FutureTransaction|null>;
    get_all(): Promise<FutureTransaction[]>;
    delete(id: string): Promise<boolean>;
    archive(id: string): Promise<boolean>;
} 