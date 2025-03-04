export interface ICategory {
  name: string;
  isSelected: boolean;
}

export type ICategoryWithId = ICategory & { _id: string };
