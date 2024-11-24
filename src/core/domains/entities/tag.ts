import { formatted } from "../helpers"

export class Tag {
    id: string = ''
    private value: string = ''
    color: string|null = null

    constructor(id: string, value: string, color: string|null) {
        this.id = id
        this.value = value
        this.color = color
    }

    setValue(value: string) {
        this.value = formatted(value)
    }

    getValue(): string {
        return formatted(this.value)
    }
}