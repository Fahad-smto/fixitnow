export interface CategoryDto {
  id: string;
  name: string;
  description: string | null;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}
