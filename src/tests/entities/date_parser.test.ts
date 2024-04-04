import DateParser from '../../core/entities/date_parser';

describe('Date test parser', () => {
    test('Test date month max ', () => {
        try {
            new DateParser(2024, 13, 1);
        } catch (err) {
            expect( err).not.toBeNull();
        }
        
    });

    test('Test date date max ', () => {
        try {
            new DateParser(2024, 2, 32);
        } catch (err) {
            expect( err).not.toBeNull();
        }
    });

    test('Test date greater than 0 ', () => {
        try {
            new DateParser(0, 12, 1);
        } catch (err) {
            expect( err).not.toBeNull();
        }

        try {
            new DateParser(12, 0, 1);
        } catch (err) {
            expect( err).not.toBeNull();
        }

        try {
            new DateParser(-1, 12, 1);
        } catch (err) {
            expect( err).not.toBeNull();
        }

        try {
            new DateParser(-1, 12, 1);
        } catch (err) {
            expect( err).not.toBeNull();
        }

        try {
            new DateParser(12, -1, 1);
        } catch (err) {
            expect( err).not.toBeNull();
        }
    });

    test('Test date febary ', () => {
        try {
            new DateParser(2024, 2, 30);
        } catch (err) {
            expect( err).not.toBeNull();
        }
    });

    test('Date to string', () => {
        expect(new DateParser(2024, 4, 1).toString()).toBe('2024-04-01');

        expect(new DateParser(2024, 12, 15).toString()).toBe('2024-12-15');
    });
})