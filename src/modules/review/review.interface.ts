export interface CreateReviewDto {
  bookingId: string;
  rating: number;
  comment?: string;
}

export interface ReviewDto {
  id: string;
  bookingId: string;
  customerId: string;
  technicianId: string;
  rating: number;
  comment: string | null;
}
