import DateParser from "./date_parser";
import { is_empty } from "./verify_empty_value";

export function search_in_array(value: string, array: string[]) : string[] {
    if (is_empty(value)) {
        return [];
    }
    let results = array.filter(value_arr => value_arr.toLowerCase().search(value.toLowerCase()) !== -1);
    return results;
}
