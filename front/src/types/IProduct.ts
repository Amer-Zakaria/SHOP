export interface IProduct {
  name: string;
  price: number;
  category: string;
  subcategory: string;
}

export type IProductWithId = IProduct & { _id: string };
