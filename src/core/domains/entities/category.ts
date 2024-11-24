import { formatted, reverseFormatted } from "../helpers"

export class Category {
    id: string = ''
    private title: string = ''
    icon: string = ''
    color: string|null = null 

    constructor(id: string, title: string, color: string|null) {
        this.id = id
        this.setTitle(title)
        this.color = color
    }

    setTitle(title: string) {
        this.title = formatted(title)
    }

    getTitle(): string {
        return reverseFormatted(this.title)
    }
}