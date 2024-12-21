import EntityError from "@/core/errors/entityError";
import { DateParser, Money } from "../helpers";

export enum TransactionType {
    DEBIT = 'Debit',
    CREDIT = 'Credit'
}

export type typeTransactionType = keyof typeof TransactionType 


export class Record {
    id: string = ''
    amount: Money 
    date: DateParser
    description: string = ''
    type: TransactionType 

    constructor(id: string, amount: Money, date: DateParser, type: TransactionType) {
        this.id = id
        this.amount = amount
        this.date = date
        this.type = type

        this.date.setHours(date.getHours())
        this.date.setMinutes(date.getMinutes())
        this.date.setSeconds(date.getSeconds())
    }
}

export class Transaction {
    id: string;
    account_ref: string;
    private tags_ref: string[];
    category_ref: string;
    record_ref: string
    __add_event_tag: string[] = []
    __delete_event_tag: string[] = []

    constructor(id: string, account_ref: string, record_ref: string, category_ref: string) {
        this.id = id 
        this.account_ref = account_ref
        this.record_ref = record_ref
        this.tags_ref = []
        this.category_ref = category_ref
    }

    setTags(tags_ref: string[]) {
        this.tags_ref = tags_ref
    }
    
    addTag(tag: string) {
        if (this.tags_ref.includes(tag))
            throw new EntityError('Tag already exist, in transaction. Not duplicate allow.')
        this.__add_event_tag.push(tag)
        if (this.__delete_event_tag.includes(tag)) {
            let index_add_tag = this.__add_event_tag.indexOf(tag)
            this.__add_event_tag.splice(index_add_tag, 1)
        }
        this.tags_ref.push(tag)
    }

    deleteTag(tag: string) {
        let index_tag = this.tags_ref.indexOf(tag)
        if (index_tag < 0)
            throw new EntityError('Tag do not exist, in Transaction.')

        this.__delete_event_tag.push(tag)
        if (this.__delete_event_tag.includes(tag)) {
            let index_del_tag = this.__delete_event_tag.indexOf(tag)
            this.__delete_event_tag.splice(index_del_tag, 1)
        }
        this.tags_ref.splice(index_tag, 1)
    }

    getTags(): string[] {
        return this.tags_ref
    }
}
