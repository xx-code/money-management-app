export default function matchSystemIcon(icon: string) {
    if (icon === 'transfert') 
        return "fa-solid fa-right-left"

    if (icon === 'freeze')
        return "fa-solid fa-snowflake"

    if (icon === 'Saving')
        return "fa-solid fa-piggy-bank"

    return icon
}