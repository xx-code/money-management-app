import { TransactionDisplay, TransactionType } from "../../entities/transaction";
import { NotFoundError } from "../../errors/notFoundError";
import { ValidationError } from "../../errors/validationError";
import { TransactionRepository } from "../repositories/transactionRepository";
import { formatted, reverseFormatted } from "../../../lib/formatted";
import { is_empty } from "../../../lib/verify_empty_value";

export type RequestUpdateTransactionUseCase = {
    id: string;
    tag_ref: string|null;
    category_ref: string|null;
    type: string|null;
    description: string|null;
    date: Date|null;
    price: number|null;
}

interface IUpdateTransactionUseCase {
    execute(request: RequestUpdateTransactionUseCase): TransactionDisplay
}

export class UpdateTransactionUseCase implements IUpdateTransactionUseCase {
    private repository: TransactionRepository;

    constructor(repo: TransactionRepository) {
        this.repository = repo;
    }

    execute(request: RequestUpdateTransactionUseCase): TransactionDisplay {
        try {
            let transaction = this.repository.get(request.id);
            
            if (transaction == null) {
                throw new NotFoundError('Transaction not found');
            }

            if (request.description != null) {
                if (is_empty(request.description)) {
                    throw new ValidationError('Description ref field is emtpy');
                }
            }

            let category = null;
            if (request.category_ref != null) {
                category = formatted(request.category_ref);
                if (is_empty(request.category_ref)) {
                    throw new ValidationError('Category ref field is empty');
                }
            }

            let tag = null;
            if (request.tag_ref != null) {
                tag = formatted(request.tag_ref);
                if (is_empty(request.tag_ref)) {
                    throw new ValidationError('Tag ref field is empty');
                } 
            }

            if (request.price != null) {
                if (request.price < 0) {
                    throw new ValidationError('Price must be greather to 0');
                }
            }

            if (request.type != null) {
                if (formatted(request.type) != 'CREDIT' && formatted(request.type) != 'DEBIT') {
                    throw new ValidationError('Type must be Debit or Credit');
                }
            }

            let date = null;
            if (request.date != null) {
                date = new Date(request.date);
            }

            let response = this.repository.update({
                id: request.id,
                tag_ref: tag,
                category_ref: category,
                date:date,
                price: request.price,
                description: request.description,
                type: request.type
            });

            let responseTag = null;
            if (response.tag != null) {
                responseTag = reverseFormatted(response.tag)
            }
            return {
                id: response.id,
                tag: responseTag,
                category_title: reverseFormatted(response.category_title),
                category_icon: response.category_icon,
                account_ref: response.account_ref,
                date: response.date,
                price: response.price,
                description: response.description,
                type: response.type
            }
        } catch (err) {
            throw err;
        }
    }
}