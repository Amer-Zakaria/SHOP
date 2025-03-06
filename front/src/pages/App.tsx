import React, { type ReactNode, Suspense, useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Container, TextField, FormControl } from "@mui/material";

import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import type { ICategoryWithId } from "../types/ICategory";
import type { IProduct, IProductWithId } from "../types/IProduct";

import { Masonry } from "@mui/lab";
import Categories from "../components/Categories";
import "../axiosConfig";
import CreateProductDialog from "../components/CreateProductDialog";
import UpdateProductDialog from "../components/UpdateProductDialog";
import smartSearch from "../utils/smartSearch";
import Product from "../components/Product";
import useStore from "./../store/sessions/index";

const baseProduct = { name: "", price: 0, category: "" };

const App = (): ReactNode => {
	// Define the fetch function
	const fetchProducts = async () => {
		const { data } = await axios.get("/products");
		return data;
	};

	const {
		data: initProducts,
		isLoading,
		isError,
		isSuccess,
	} = useQuery<IProductWithId[]>({
		queryKey: ["products"],
		queryFn: fetchProducts,
	});
	const { products, setProducts, categories, setCategories } = useStore();
	useEffect(() => {
		if (isSuccess) {
			setProducts(initProducts);
		}
	}, [isSuccess, initProducts, setProducts]);

	const [formData, setFormData] = useState(baseProduct);

	const addProduct = async (product: IProduct) => {
		const response = await axios.post("/products", product);
		return response.data;
	};

	const useAddProduct = () => {
		const queryClient = useQueryClient();

		return useMutation({
			mutationFn: addProduct,
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: ["products"],
				});

				setFormData(baseProduct);
				setOpen(false);
			},
		});
	};
	const mutation = useAddProduct();

	const [open, setOpen] = useState(false);
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		mutation.mutate(formData);
	};
	const onClose = () => {
		setOpen(false);
	};

	// UPDATE
	const [updateFormData, setUpdateFormData] = useState<IProductWithId | null>(
		null,
	);
	const [updateOpen, setUpdateOpen] = useState(false);
	const handleUpdateChange = (e) => {
		const { name, value } = e.target;
		setUpdateFormData({
			...(updateFormData as IProductWithId),
			[name]: value,
		});
	};
	const updateProduct = async (product: IProductWithId) => {
		const response = await axios.put(`/products/${product._id}`, product);
		return response.data;
	};

	const useUpdateProduct = () => {
		const queryClient = useQueryClient();

		return useMutation({
			mutationFn: updateProduct,
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: ["products"],
				});

				handleUpdateClose();
			},
		});
	};
	function handleUpdateClose() {
		setUpdateFormData(null);
		setUpdateOpen(false);
	}

	const updateMutation = useUpdateProduct();

	const handleUpdateSubmit = (e) => {
		e.preventDefault();
		updateMutation.mutate(updateFormData as IProductWithId);
	};

	// DELETE
	const deleteProduct = async (id: string) => {
		const response = await axios.delete(`/products/${id}`);
		return response.data;
	};
	const useDeleteProduct = () => {
		const queryClient = useQueryClient();

		return useMutation({
			mutationFn: deleteProduct,
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: ["products"],
				});
			},
		});
	};
	const deleteMutation = useDeleteProduct();
	const handleDelete = (id: string) => {
		deleteMutation.mutate(id);
	};

	// CATEGORY
	const fetchCategories = async () => {
		const { data } = await axios.get("/categories");
		return data;
	};
	const {
		data: initCategories,
		isLoading: categoryIsLoading,
		isError: categoryIsError,
		isSuccess: categoryIsSuccess,
	} = useQuery<ICategoryWithId[]>({
		queryKey: ["categories"],
		queryFn: fetchCategories,
	});
	useEffect(() => {
		if (categoryIsSuccess) {
			setCategories((old) =>
				initCategories.map((c, i) => ({
					...c,
					isSelected:
						categories.length === 0 && i === 0
							? true
							: (old.find((category) => category._id === c._id)?.isSelected ??
								false),
				})),
			);
		}
	}, [categoryIsSuccess, initCategories, categories.length, setCategories]);
	const handleSelectCategory = (id: string) => {
		const falsifyCateories = categories.map((c) => ({
			...c,
			isSelected: false,
		}));
		return setCategories(
			falsifyCateories.map((c) =>
				c._id === id ? { ...c, isSelected: true } : c,
			),
		);
	};
	const selectedCategoryId = categories.find((c) => c.isSelected)?._id;
	const productsFilteredByCategory = selectedCategoryId
		? (products?.filter((p) => p.category === selectedCategoryId) ?? [])
		: (products ?? []);

	// SEARCH
	const [searchQuery, setSearchQuery] = useState<string>("");
	const productsSearched =
		searchQuery && productsFilteredByCategory
			? smartSearch(productsFilteredByCategory, searchQuery)
			: null;

	return (
		<Suspense fallback={<AppLoading />}>
			<FormControl fullWidth sx={{ mb: 1 }}>
				<TextField
					sx={{
						borderRadius: 0,
					}}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					id="filled-search"
					label="Search field"
					type="search"
					variant="filled"
				/>
			</FormControl>
			<Categories
				categories={categories}
				isLoading={categoryIsLoading}
				isError={categoryIsError}
				isSuccess={categoryIsSuccess}
				onSelectCategory={handleSelectCategory}
			/>

			<CreateProductDialog
				formData={formData}
				handleSubmit={handleSubmit}
				onClose={onClose}
				open={open}
				handleChange={handleChange}
				categories={categories}
				categoryIsError={categoryIsError}
				categoryIsLoading={categoryIsLoading}
				categoryIsSuccess={categoryIsSuccess}
				setFormData={setFormData}
			/>
			{updateFormData && (
				<UpdateProductDialog
					product={updateFormData}
					handleSubmit={handleUpdateSubmit}
					open={updateOpen}
					onClose={handleUpdateClose}
					handleChange={handleUpdateChange}
					setUpdateFormData={setUpdateFormData}
					categories={categories}
					categoryIsError={categoryIsError}
					categoryIsLoading={categoryIsLoading}
					categoryIsSuccess={categoryIsSuccess}
				/>
			)}

			<Container maxWidth="sm">
				{isLoading && <p>Loading...</p>}
				{isError && products.length >= 1 && <p>Offline mode (just search)</p>}
				{(isSuccess || products.length >= 1) && (
					<Masonry
						columns={{ xs: 2, sm: 3, lg: 1 }}
						style={{
							listStyle: "none",
							margin: "0 auto",
						}}
					>
						{productsSearched
							? productsSearched.map(({ product: p, ...searchParams }) => (
									<Product
										key={p._id}
										product={p}
										searchParams={searchParams}
										onEditOpen={() => {
											setUpdateFormData(p);
											setUpdateOpen(true);
										}}
										onDeleteClose={() => handleDelete(p._id)}
									/>
								))
							: productsFilteredByCategory.map((p) => (
									<Product
										key={p._id}
										product={p}
										searchParams={null}
										onEditOpen={() => {
											setUpdateFormData(p);
											setUpdateOpen(true);
										}}
										onDeleteClose={() => handleDelete(p._id)}
									/>
								))}
					</Masonry>
				)}
			</Container>
			<Fab
				onClick={() => setOpen(true)}
				color="primary"
				aria-label="add"
				sx={{
					position: "fixed",
					bottom: 16,
					left: 16,
				}}
			>
				<AddIcon />
			</Fab>
		</Suspense>
	);
};

const AppLoading = (): ReactNode => (
	<span className="text-red-600">AppLoading</span>
);

export default App;
