import { Account } from "../domains/entities/account";

export type AccountDto = {
    id: string;
    title: string;
    is_saving: boolean
} 

export class AccountMapper {
    static to_domain(dto: AccountDto): Account {
        let account = new Account(dto.id, dto.title)
        account.is_saving = dto.is_saving
        return account
    }

    static to_persistence(entity: Account): AccountDto {
        return {
            id: entity.id,
            title: entity.title,
            is_saving: entity.is_saving
        }
    }
}