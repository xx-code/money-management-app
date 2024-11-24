import EntityError from "@/core/errors/entityError";
import { DateParser, Money } from "../helpers";

export enum TransactionType {
    DEBIT = 'Debit',
    CREDIT = 'Credit'
}

export type typeTransactionType = keyof typeof TransactionType 


export class Record {
    id: string = ''
    price: Money 
    date: DateParser
    description: string = ''
    type: TransactionType 

    constructor(id: string, price: Money, date: DateParser, type: TransactionType) {
        this.id = id
        this.price = price
        this.date = date
        this.type = type

    }
}

export class Transaction {
    id: string;
    account_ref: string;
    private tags: string[];
    category_ref: string;
    record_ref: string
    __add_event_tag: string[] = []
    __delete_event_tag: string[] = []

    constructor(id: string, account_ref: string, record_ref: string, category_ref: string) {
        this.id = id 
        this.account_ref = account_ref
        this.record_ref = record_ref
        this.tags = []
        this.category_ref = category_ref
    }

    setTags(tags: string[]) {
        this.tags = tags
    }
    
    addTag(tag: string) {
        if (this.tags.includes(tag))
            throw new EntityError('Tag already exist, in transaction. Not duplicate allow.')
        this.__add_event_tag.push(tag)
        if (this.__delete_event_tag.includes(tag)) {
            let index_add_tag = this.__add_event_tag.indexOf(tag)
            this.__add_event_tag.splice(index_add_tag, 1)
        }
        this.tags.push(tag)
    }

    deleteTag(tag: string) {
        let index_tag = this.tags.indexOf(tag)
        if (index_tag < 0)
            throw new EntityError('Tag do not exist, in Transaction.')

        this.__delete_event_tag.push(tag)
        if (this.__delete_event_tag.includes(tag)) {
            let index_del_tag = this.__delete_event_tag.indexOf(tag)
            this.__delete_event_tag.splice(index_del_tag, 1)
        }
        this.tags.splice(index_tag, 1)
    }

    getTags(): string[] {
        return this.tags
    }
}
