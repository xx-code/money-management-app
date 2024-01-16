import { is_empty } from '../../interactions/utils/verify_empty_value';

test('Verify empty value', () => {
    let result = is_empty('   ');
    expect(result).toBe(true);

    result = is_empty('dffd');
    expect(result).toBe(false);
});