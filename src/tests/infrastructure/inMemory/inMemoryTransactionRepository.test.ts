import { TransactionType } from "../../../entities/transaction";
import { PaginationError } from "../../../infrastructure/errors/PaginationError";
import { InMemoryCategoryRepository } from "../../../infrastructure/inMemory/inMemoryCategoryRepository";
import { InMemoryTagRepository } from "../../../infrastructure/inMemory/inMemoryTagRepository";
import { InMemoryTransactionRepository } from "../../../infrastructure/inMemory/inMemoryTransactionRepository";
import { dbTransaction, dbTransactionResponse, dbTransactionUpdateRequest } from "../../../interactions/repositories/transactionRepository";

describe('Transaction in memory', () => {
    let tag_repository = new InMemoryTagRepository();
    let category_repository = new InMemoryCategoryRepository();
    category_repository.save({title: 'Wage', icon: 'icon'});
    category_repository.save({title: 'Food', icon: 'icon'})
    tag_repository.save({title: 'tag'});
    let transactions_repository = new InMemoryTransactionRepository(category_repository, tag_repository);

    it('test creation transaction', () => {
        let response = transactions_repository.save({
            id: 'id-transaction',
            account_ref: 'id-perso-va',
            category_ref: 'Wage',
            tag_ref: 'tag',
            type: TransactionType['Debit'].toString(),
            date: new Date('2024-01-17'),
            description: 'Init',
            price: 2937.16
        });

        expect(response).toBe('id-transaction');
    });

    it('Get transaction', () => {
        let true_response: dbTransactionResponse = {
            id: 'id-transaction',
            account_ref: 'id-perso-va',
            category_icon: 'icon',
            category_title: 'Wage',
            tag: 'tag',
            type: 'Debit',
            date: new Date('2024-01-17'),
            description: 'Init',
            price: 2937.16
        };

        let response = transactions_repository.get('id-transaction');

        expect(response).toStrictEqual(true_response);
    });

    it('Verify if size is correct', () => {
        try {
            transactions_repository.get_paginations(2, 10, null, {accounts: [], categories: [], tags: []});
        } catch(err) {
            expect(err).toStrictEqual(new PaginationError('This page don\'t exist'));
        }
    });

    let value: dbTransaction = {
        id: 'id-transaction-2',
        account_ref: 'id-perso-va',
        category_ref: 'Food',
        tag_ref: 'tag',
        type: TransactionType['Credit'].toString(),
        date: new Date('2024-01-17'),
        description: 'Init',
        price: 200
    };

    it('test get paginations', () => {
        transactions_repository.save(value);
        let response = transactions_repository.get_paginations(1, 10, null, {accounts: [], categories: [], tags: []});

        expect(response.transactions.length).toBe(2);
    });

    it('test update', () => {
        let value: dbTransactionUpdateRequest = {
            id: 'id-transaction-2',
            description: 'achat poulet',
            category_ref: 'Wage',
            price: 16.2,
            type: null,
            date: null,
            tag_ref: null
        };

        let response = transactions_repository.update(value);

        expect(response.description).toBe('achat poulet');
        expect(response.category_title).toBe('Wage');
        expect(response.price).toBe(16.2);
    });

    it('delete value', () => {
        let respone = transactions_repository.delete('id-transaction-2');

        expect(respone).toBe(true);
        expect(transactions_repository.get_paginations(1, 10, null, {accounts: [], categories: [], tags: []}).transactions.length).toBe(1);
    });

    it('Verify pagination system', () => {
        transactions_repository.save(value);

        let response = transactions_repository.get_paginations(1, 1, null, {accounts: [], categories: [], tags: []});

        expect(response.current_page).toBe(1);
        expect(response.max_page).toBe(2);

        response = transactions_repository.get_paginations(2, 1, null, {accounts: [], categories: [], tags: []});

        expect(response.transactions[0].id).toBe('id-transaction-2');
    });

    it('test balance', () => {
        let response = transactions_repository.get_balance({accounts: ['id-perso-va'], categories: [], tags: []});

        expect(response).toBe(2737.16);
    });

    it('test filtering', () => {
        let response = transactions_repository.get_paginations(1, 10, null, {accounts: [], categories: ['Food'], tags: []});

        expect(response.transactions[0].id).toBe('id-transaction-2');

        transactions_repository.save({
            id: 'id-transaction-3',
            account_ref: 'id-perso-va',
            category_ref: 'Food',
            tag_ref: 'tag3',
            type: TransactionType['Debit'].toString(),
            date: new Date('2024-01-17'),
            description: 'Init',
            price: 2937.16
        });

        response = transactions_repository.get_paginations(1, 10, null, {accounts: [], categories: ['Food'], tags: ['tag']});

        expect(response.transactions.length).toBe(1);
    });

    // Make test 
});