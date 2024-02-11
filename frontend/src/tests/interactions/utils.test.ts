import { formatted, reverseFormatted } from '../../interactions/utils/formatted';
import { is_empty } from '../../interactions/utils/verify_empty_value';

test('Verify empty value', () => {
    let result = is_empty('   ');
    expect(result).toBe(true);

    result = is_empty('dffd');
    expect(result).toBe(false);
});

describe('Test formatted category value', () => {
    it('Formatted test', () => {
        let value = ' cateGory ';
        let true_value = 'CATEGORY';

        let result = formatted(value);
        expect(result).toBe(true_value);

        value = 'CATEGORY';
        true_value = 'Category'

        result = reverseFormatted(value);
        expect(result).toBe(true_value);

        value = 'Tag vaLue example';
        true_value = 'TAG_VALUE_EXAMPLE';
        result = formatted(value);
        expect(result).toBe(true_value);

        value = 'TAG_VALUE_EXAMPLE';
        true_value = 'Tag value example';
        result = reverseFormatted(value);
        expect(result).toBe(true_value);
    });
});