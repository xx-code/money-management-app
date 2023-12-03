import { Account } from '../../entities/account';
import { DebitOperation, CreditOperation, Transaction, Category } from '../../entities/transaction';

describe('Test Transaction module', () => {
    let account_title = "Perso";
    let account_credit_value = 1500;
    let account = new Account(account_title, account_credit_value);

    test('Add a new transaction Gains', () => {
        let title_transaction = 'Papa';
        let price_transaction = 1000;
        let date_transaction = new Date("2019-01-16");
        let desc_transaction = 'First payment';

        let type_transaction = new DebitOperation(Category.Cash);
        
        let transaction = new Transaction(account, title_transaction, type_transaction, desc_transaction, price_transaction, date_transaction);

        expect(transaction.get_account().get_title()).toBe(account.get_title());
        expect(transaction.get_price()).toBe(transaction);
    })
    test('Add new transaction spend', () => {
        let title_transaction = 'Internet'
        let price_transaction = 500;
        let date_transaction = new Date('2019-02-16');
        let desc_transaction = 'First spend';

        let type_transaction = new CreditOperation(Category.Housing);

        let transaction = new Transaction(account, title_transaction, type_transaction, desc_transaction, price_transaction, date_transaction);
        
        expect(transaction.get_category()).toBe(Category.Housing);
        expect(transaction.get_price()).toBe(-price_transaction);
    })
})