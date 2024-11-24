import { Record } from '../domains/entities/transaction';

export interface RecordRepository {
    save(request: Record): Promise<boolean>;
    get(id: string): Promise<Record|null>;
    getAll(): Promise<Record[]>;
    getManyById(ids: string[]): Promise<Record[]>;
    delete(id: string): Promise<boolean>;
    update(request: Record): Promise<boolean>;
}