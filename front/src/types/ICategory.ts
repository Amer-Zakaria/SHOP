export interface ICategory {
  name: string;
  nameAr?: string;
  isSelected: boolean;
}

export type ICategoryWithId = ICategory & { _id: string };
