import { Record } from '../../entities/transaction';

export interface RecordRepository {
    save(request: Record): string;
    get(id: string): Record|null;
    get_all(): Record[];
    get_many_by_id(ids: string[]): Record[];
    delete(id: string): boolean;
    update(request: Record): Record;
}