export interface ServiceFilterQuery {
  type?: string;      // maps to categoryId or category name
  location?: string;
  rating?: string;
  minPrice?: string;
  maxPrice?: string;
}

export interface ServiceDto {
  id: string;
  title: string;
  description: string | null;
  price: number;
  location: string | null;
  categoryId: string;
  technicianId: string;
}
