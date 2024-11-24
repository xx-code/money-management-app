import { Record } from '../domains/entities/transaction';

export interface RecordRepository {
    save(request: Record): Promise<boolean>;
    get(id: string): Promise<Record|null>;
    get_all(): Promise<Record[]>;
    get_many_by_id(ids: string[]): Promise<Record[]>;
    delete(id: string): Promise<boolean>;
    update(request: Record): Promise<Record>;
}