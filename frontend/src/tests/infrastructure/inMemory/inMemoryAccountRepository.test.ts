import { TransactionType } from "../../../entities/transaction";
import { InMemoryAccountRepository } from "../../../infrastructure/inMemory/inMemoryAccountRepository";
import { InMemoryCategoryRepository } from "../../../infrastructure/inMemory/inMemoryCategoryRepository";
import { InMemoryTagRepository } from "../../../infrastructure/inMemory/inMemoryTagRepository";
import { InMemoryTransactionRepository } from "../../../infrastructure/inMemory/inMemoryTransactionRepository";
import { dbAccount, dbAccountResponse, dbAccountUpdate } from "../../../interactions/repositories/accountRepository";

describe('Account repository', () => {
    let transaction_repo = new InMemoryTransactionRepository(new InMemoryCategoryRepository(), new InMemoryTagRepository());
    let accountRepo = new InMemoryAccountRepository(transaction_repo);

    it('Test Creation account ', () => {
        let request: dbAccount = {
            id: 'id-value-15',
            title: 'title',
            credit_limit: 1250,
            credit_value: 6600
        };

        let true_response = 'id-value-15';

        let response = accountRepo.save(request);

        expect(response).toBe(true_response);
    });

    it('Test Update account', () => {

        let request: dbAccountUpdate = {
            id: 'id-value-15',
            title: null,
            credit_limit: 150,
            credit_value: 500
        };

        let true_response: dbAccountResponse = {
            id: 'id-value-15',
            title: 'title',
            credit_limit: 150,
            credit_value: 500,
            balance: 0
        };

        let response = accountRepo.updated(request);
        
        expect(response).toStrictEqual(true_response);
    });

    it('Test get account', () => {
        let response = accountRepo.get('id-value-15');

        let true_response: dbAccountResponse = {
            id: 'id-value-15',
            title: 'title',
            credit_limit: 150,
            credit_value: 500,
            balance: 0
        };

        expect(response).toStrictEqual(true_response);
    });

    it('Test get All account', () => {
        let response = accountRepo.get_all();

        expect(response.length).toBe(1);
    });

    it('Test delete account', () => {
        let response = accountRepo.delete('id-value-15');

        expect(response).toBe(true);
        expect(accountRepo.get_all().length).toBe(0);
    });
});


describe('Test sequence Account with transactions', () => {
    let transaction_repo = new InMemoryTransactionRepository(new InMemoryCategoryRepository(), new InMemoryTagRepository());
    let accountRepo = new InMemoryAccountRepository(transaction_repo);

    it('Test account', () => {
        accountRepo.save({
            id: 'id-value-15',
            title: 'title',
            credit_limit: 1250,
            credit_value: 6600
        });

        transaction_repo.save({
            id: 'id-transaction',
            account_ref: 'id-value-15',
            category_ref: 'Wage',
            tag_ref: 'tag',
            type: TransactionType['Debit'].toString(),
            date: new Date('2024-01-17'),
            description: 'Init',
            price: 2937.16
        });

        transaction_repo.save({
            id: 'id-transaction-2',
            account_ref: 'id-value-15',
            category_ref: 'Food',
            tag_ref: 'tag',
            type: TransactionType['Credit'].toString(),
            date: new Date('2024-01-17'),
            description: 'Init',
            price: 200
        });

        let response = accountRepo.get('id-value-15');

        expect(response?.balance).toBe(2737.16);
    });
});