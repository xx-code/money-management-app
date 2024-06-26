import { ValidationError } from "../errors/validationError";
import { Period } from "./budget";
import DateParser from "./date_parser";
import { is_empty } from "./verify_empty_value";

export function search_in_array(value: string, array: string[]) : string[] {
    let results = array.filter(value_arr => value_arr.toLowerCase().search(value.toLowerCase()) !== -1);
    return results;
}
