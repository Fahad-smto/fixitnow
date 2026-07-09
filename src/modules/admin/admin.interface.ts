export type UserStatus = 'active' | 'banned';

export interface UpdateUserStatusDto {
  status: UserStatus;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}
