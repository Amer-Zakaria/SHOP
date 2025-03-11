import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IProductWithId } from "../../types/IProduct";
import type { ICategoryWithId } from "../../types/ICategory";

type store = {
	products: IProductWithId[];
	categories: ICategoryWithId[];
	exchange: number;
} & {
	setProducts: (
		change:
			| IProductWithId[]
			| ((oldProducts: IProductWithId[]) => IProductWithId[]),
	) => void;
	setCategories: (
		change:
			| ICategoryWithId[]
			| ((oldCategories: ICategoryWithId[]) => ICategoryWithId[]),
	) => void;
	changeExchange: (newExchangePrice: number) => void;
};

const useStore = create<store, [["zustand/persist", { playerName: string }]]>(
	persist(
		(set, get) => ({
			products: [] as IProductWithId[],
			categories: [] as ICategoryWithId[],
			exchange: 10000,

			changeExchange: (newExchangePrice: number) => {
				return set((old) => ({ ...old, exchange: newExchangePrice }));
			},

			setProducts: (
				change:
					| IProductWithId[]
					| ((oldProducts: IProductWithId[]) => IProductWithId[]),
			) => {
				const isArray = Array.isArray(change);
				let newProducts: IProductWithId[];
				if (isArray) {
					newProducts = change;
				} else {
					newProducts = change(get().products);
				}
				return set((old) => ({ ...old, products: newProducts }));
			},

			setCategories: (
				change:
					| ICategoryWithId[]
					| ((oldCategories: ICategoryWithId[]) => ICategoryWithId[]),
			) => {
				const isArray = Array.isArray(change);
				let newCategories: ICategoryWithId[];
				if (isArray) {
					newCategories = change;
				} else {
					newCategories = change(get().categories);
				}
				return set((old) => ({ ...old, categories: newCategories }));
			},
		}),
		{
			name: "store-storage", // name of the item in the storage (must be unique)
		},
	),
);

export default useStore;
