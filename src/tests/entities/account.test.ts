import { Account } from '../../entities/account';

describe('Test Account module', () => {
    test('Creation Account', () => {
        let credit_value = 1000;
        let title = 'Perso';

        let account = new Account(title, credit_value);

        expect(account.get_title()).toBe(title);
        expect(account.get_credit_value()).toBe(credit_value)
    })
})