import { Transaction, Record, TransactionType } from '../domains/entities/transaction'
import { DateParser, Money } from '../domains/helpers'
import { TransactionPaginationResponse } from '../domains/metaData/transaction'
import EntityError from '../errors/entityError'

export type RecordDto = {
    id: string 
    price: number 
    date: string
    description: string
    type: string
}

export type TransactionDto = {
    id: string
    record: string
    account_ref: string;
    tags: string[];
    category_ref: string;
}

export type TransactionPaginationDto = {
    transactions: TransactionDto[],
    max_page: number,
    num_items: number
}

export function mapperTransactionType(value: string): TransactionType {
    
    if (value === TransactionType.CREDIT)
        return TransactionType.CREDIT

    if (value === TransactionType.DEBIT)
        return TransactionType.DEBIT


}

export class RecordMapper {
    static to_domain(dto: RecordDto): Record {
        let record = new Record(dto.id, new Money(dto.price), DateParser.fromString(dto.date), mapperTransactionType(dto.type.toUpperCase()))
        record.type = mapperTransactionType(dto.type)
        record.description = dto.description

        return record
    }

    static to_persistence(entity: Record): RecordDto {
        return {
            id: entity.id,
            date: entity.date.toString('datetime'),
            description: entity.description,
            price: entity.amount.getAmount(),
            type: entity.type
        }
    }
}

export class TransactionMapper {
    static to_domain(dto: TransactionDto): Transaction {
        let transaction = new Transaction(dto.id, dto.account_ref, dto.record, dto.category_ref)
        transaction.setTags(dto.tags)

        return transaction
    }

    static to_persistence(entity: Transaction): TransactionDto {
        return {
            id: entity.id,
            account_ref: entity.account_ref,
            category_ref: entity.category_ref,
            record: entity.record_ref,
            tags: entity.getTags()
        }
    }
}

export class TransactionPaginationMapper {
    static to_domain(dto: TransactionPaginationDto): TransactionPaginationResponse {
        return {
            transactions: dto.transactions.map(trans => TransactionMapper.to_domain(trans)),
            max_page: dto.max_page,
            current_page: 0
        }
    }
}