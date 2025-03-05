export interface IProduct {
  name: string;
  price: number;
  category: string;
}

export type IProductWithId = IProduct & { _id: string };
