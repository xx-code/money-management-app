import { AccountRepository } from '../../repositories/accountRepository';
import { CryptoService } from '../../adapters/libs';
import ValidationError from '@/core/errors/validationError';
import { isEmpty } from '@/core/domains/helpers';
import { Account } from '@/core/domains/entities/account';

export type RequestCreationAccountUseCase = {
  title: string;
}

interface ICreationAccountUseCase {
  execute(request: RequestCreationAccountUseCase): void;
}

export interface ICreationAccountUseCaseResponse {
  success(is_deleted: boolean): void;
  fail(err: Error): void;
}

export class CreationAccountUseCase implements ICreationAccountUseCase {
  private repository: AccountRepository;
  private crypto: CryptoService;
  private presenter: ICreationAccountUseCaseResponse;

  constructor(repo: AccountRepository, crypto: CryptoService, presenter: ICreationAccountUseCaseResponse) {
    this.repository = repo;
    this.crypto = crypto;
    this.presenter = presenter;
  }

  async execute(request: RequestCreationAccountUseCase): Promise<void> {
    try {
      let id = this.crypto.generate_uuid_to_string();

      if (isEmpty(request.title)) {
        throw new ValidationError('Title of account is empty');
      }

      if (await this.repository.exist(request.title)) {
        throw new ValidationError('Account name already exist')
      }

      let new_account = new Account(id, request.title)

      let is_saved = await this.repository.save(new_account)

      if (!is_saved) {
        throw new Error('Account not saved');
      }

      this.presenter.success(is_saved);
    } catch (err) {
      this.presenter.fail(err as Error);
    }
  }
}
