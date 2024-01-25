import { Crypto } from "../../../interactions/utils/cryto";
import { v4 as uuidv4 } from 'uuid';

export class CrytoGraphie implements Crypto {
    generate_uuid_to_string(): string {
        return uuidv4();
    }
}