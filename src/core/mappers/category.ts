import { Category } from "../domains/entities/category"

export type CategoryDto = {
    id: string
    title: string
    icon: string
    color: string|null
}

export class CategoryMapper {
    static to_domain(category_dto: CategoryDto): Category {
        let category = new Category(category_dto.id, category_dto.title, category_dto.color)
        category.color = category_dto.color
        
        return category
    }

    static to_persistence(category: Category): CategoryDto {
        return {
            id: category.id,
            title: category.getTitle(),
            icon: category.icon,
            color: category.color
        }
    }
} 