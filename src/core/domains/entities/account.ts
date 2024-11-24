export class Account {
    id: string = '';
    title: string = '';
    is_saving: boolean = false

    constructor(id: string, title: string) {
        this.id = id
        this.title = title
    }
}
