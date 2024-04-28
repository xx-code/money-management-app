import { CryptoService } from '../core/adapter/libs';
import { v4 as uuidv4 } from 'uuid';

export default class UUIDMaker implements CryptoService {
    generate_uuid_to_string(): string {
        return uuidv4();
    }
}