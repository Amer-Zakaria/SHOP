export interface ICategory {
  name: string;
}

export type ICategoryWithId = ICategory & { _id: string };
