import { Tag } from "../domains/entities/tag"

export type TagDto = {
    id: string
    value: string
    color: string|null
}

export class TagMapper {
    static to_domain(dto: TagDto): Tag {
        let tag = new Tag(dto.id, dto.value, dto.color)
        
        return tag
    }

    static to_persistence(tag: Tag): TagDto {
        return {
            id: tag.id,
            value: tag.getValue(),
            color: tag.color
        }
    }
} 