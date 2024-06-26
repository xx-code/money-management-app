export function is_empty(value: string):boolean {
    if (value == undefined) {
        return true;
    }
    // Use trim() method to remove leading and trailing whitespaces
    const trimmedString = value.trim();

    // Check if the trimmed string is empty
    return !trimmedString.length;
}