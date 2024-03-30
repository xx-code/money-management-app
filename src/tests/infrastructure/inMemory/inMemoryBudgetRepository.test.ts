import { Period } from "../../../entities/budget";
import { InMemoryBudgetCategory, InMemoryBudgetTag } from "../../../infrastructure/inMemory/inMemoryBudgetRepository";
import { InMemoryCategoryRepository } from "../../../infrastructure/inMemory/inMemoryCategoryRepository";
import { InMemoryTagRepository } from "../../../infrastructure/inMemory/inMemoryTagRepository";
import { BudgetCategoryRepository, dbBudgetCategoryResponse, dbBudgetTagResponse } from "../../../interactions/repositories/budgetRepository";

describe('Test Tag Budget', () => {
    let budgetRepository = new InMemoryBudgetTag();

    it('Creation tag', () => {
        let response = budgetRepository.save({
            id: 'tag-1',
            title: 'dx',
            date_end: new Date('02-02-2022'),
            date_start: new Date('01-02-2022'),
            target: 2000,
            tags: []
        });

        expect(response).toBe('tag-1');
    });

    it('get tag,', () => {
        let response = budgetRepository.get('tag-1');
        
        let true_response: dbBudgetTagResponse = {
            id: 'tag-1',
            title: 'dx',
            date_end: new Date('02-02-2022'),
            date_start: new Date('01-02-2022'),
            target: 2000,
            tags: [],
            current: 0
        };

        expect(response).toStrictEqual(true_response);
    });

    it('get all tags,', () => {
        let resposne = budgetRepository.get_all();

        expect(resposne.length).toBe(1);
    });

    it('update tag', () => {
        budgetRepository.update({
            id: 'tag-1',
            date_end: new Date('03-02-2022'),
            target: 1500,
            tags: ['tag'],
            title: 'dff',
            date_start: null,
        });

        let value =  budgetRepository.get('tag-1');

        expect(value?.date_end).toStrictEqual(new Date('03-02-2022'));
        expect(value?.target).toBe(1500);
        expect(value?.tags).toStrictEqual(['tag']);
        expect(value?.title).toBe('dff');
    });

    it('delete tag', () => {
        let response = budgetRepository.delete('tag-1');

        expect(response).toBe(true);
    });
});

describe('Test Category Budget', () => {
    let budgetRepository = new InMemoryBudgetCategory();

    it('Creation category', () => {
        let response = budgetRepository.save({
            id: 'tag-1',
            title: 'dx',
            period:  Period[Period.Month].toString(),
            period_time: 1,
            target: 2000,
            categories: []
        });

        expect(response).toBe('tag-1');
    });

    it('get category,', () => {
        let response = budgetRepository.get('tag-1');
        
        let true_response: dbBudgetCategoryResponse = {
            id: 'tag-1',
            title: 'dx',
            period:  Period[Period.Month].toString(),
            period_time: 1,
            target: 2000,
            categories: [],
            current: 0
        };

        expect(response).toStrictEqual(true_response);
    });

    it('get all categorys,', () => {
        let resposne = budgetRepository.get_all();

        expect(resposne.length).toBe(1);
    });

    it('update category', () => {
        budgetRepository.update({
            id: 'tag-1',
            period_time: 2,
            target: 1500,
            categories: ['cat'],
            title: 'dff',
            period: null,
        });

        let value =  budgetRepository.get('tag-1');

        expect(value?.period_time).toStrictEqual(2);
        expect(value?.target).toBe(1500);
        expect(value?.categories).toStrictEqual(['cat']);
        expect(value?.title).toBe('dff');
    });

    it('delete category', () => {

    });
});