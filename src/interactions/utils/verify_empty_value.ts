export function is_empty(value: string):boolean {
    // Use trim() method to remove leading and trailing whitespaces
    const trimmedString = value.trim();

    // Check if the trimmed string is empty
    return !trimmedString.length;
}