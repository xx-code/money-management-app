import { Money } from "../domains/helpers";

export interface CryptoService {
    generate_uuid_to_string(): string;
}

export type ScrappingPriceRequest = {
    link: string
    html: string
}

export interface ScrappingPriceService {
    get_price(request: ScrappingPriceRequest): Promise<Money>
}