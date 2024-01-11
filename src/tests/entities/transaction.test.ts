import { Category } from '../../entities/category';
import { Account } from '../../entities/account';
import { DebitTransaction, CreditTransaction, Transaction } from '../../entities/transaction';

describe('Test Transaction module', () => {
    let account_title = "Perso";
    let account_credit_value = 1500;
    let account:Account = { title: account_title, credit_value: account_credit_value, limit_credit: 0};
    
    test('Add a new transaction Gains', () => {
        let price_transaction = 1000;
        let date_transaction = new Date("2019-01-16");
        let desc_transaction = 'First payment';

        let cash_category:Category = { title: 'Cash', icon: 'Ico' };

        let type_transaction = new DebitTransaction(cash_category);
        
        let transaction = new Transaction(account, type_transaction, desc_transaction, price_transaction, date_transaction);

        expect(transaction.get_account().title).toBe(account_title);
        expect(transaction.get_price()).toBe(price_transaction);
        expect(transaction.get_date()).toBe(date_transaction);
    })
    test('Add new transaction spend', () => {
        let price_transaction = 500;
        let date_transaction = new Date('2019-02-16');
        let desc_transaction = 'First spend';

        let home_category: Category = { title: 'Housing', icon: 'Ico'}
        let type_transaction = new CreditTransaction(home_category);

        let transaction = new Transaction(account, type_transaction, desc_transaction, price_transaction, date_transaction);
        
        expect(transaction.get_category().title).toBe('Housing');
        expect(transaction.get_price()).toBe(-price_transaction);
    })
})