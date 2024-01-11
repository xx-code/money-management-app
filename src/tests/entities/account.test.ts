import { Account } from '../../entities/account';

describe('Test Account module', () => {
    test('Creation Account', () => {
        let credit_value = 1000;
        let title = 'Perso';

        let account:Account = { title:title, credit_value:credit_value, limit_credit:0 };

        expect(account.title).toBe(title);
        expect(account.credit_value).toBe(credit_value)
    })
})