export function formatted(value: string): string {
    let formattedValue = value.toUpperCase();
    formattedValue = formattedValue.trimStart();
    formattedValue = formattedValue.trimEnd();
    formattedValue = formattedValue.replaceAll(' ', '_');

    return formattedValue;
}

export function reverseFormatted(formattedValue: string): string {
    let value = formattedValue.replaceAll('_', ' ');
    value = value.toLowerCase();
    value = value[0].toUpperCase() + value.slice(1);
    
    return value;
}