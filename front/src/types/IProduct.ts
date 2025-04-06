export interface IProduct {
  name: string;
  price: number;
  category: string;
  subcategory: string;
  subcategoryAr: string;
  nameAr?: string;
  imgUrl?: string;
}

export type IProductWithId = IProduct & { _id: string };
