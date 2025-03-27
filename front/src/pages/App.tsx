import React, {
	type ReactNode,
	Suspense,
	useEffect,
	useRef,
	useState,
} from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
	Container,
	TextField,
	FormControl,
	Box,
	Typography,
} from "@mui/material";

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
import CollapsibleSideMenu from "../components/sideMenu";

const baseProduct = { name: "", price: 0, category: "", subcategory: "" };

const App = (): ReactNode => {
	const searchFieldRef = useRef<HTMLInputElement>(null);

	// GET
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

	const {
		products,
		setProducts,
		categories,
		setCategories,
		exchange,
		changeExchange,
		pass,
		changePass,
	} = useStore();
	useEffect(() => {
		if (isSuccess) {
			setProducts(initProducts);
		}
	}, [isSuccess, initProducts, setProducts]);

	// CREATE
	const [formData, setFormData] = useState(baseProduct);

	const addProduct = async (product: IProduct) => {
		const response = await axios.post("/products", product, {
			headers: { "x-auth-pass": pass },
		});
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
		const response = await axios.put(`/products/${product._id}`, product, {
			headers: { "x-auth-pass": pass },
		});
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
		const response = await axios.delete(`/products/${id}`, {
			headers: { "x-auth-pass": pass },
		});
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
		setCategories(
			falsifyCateories.map((c) =>
				c._id === id ? { ...c, isSelected: true } : c,
			),
		);
		searchFieldRef.current?.focus();
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
	useEffect(() => {
		searchFieldRef.current?.focus();
	}, []);

	// SUBCATEGORIES
	// extract subcategories
	const subcategories: string[] = [];
	// biome-ignore lint/complexity/noForEach: <explanation>
	productsFilteredByCategory.forEach((p) => {
		if (!subcategories.some((c2) => c2 === p.subcategory)) {
			subcategories.push(p.subcategory);
		}
	});

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
					inputRef={searchFieldRef}
				/>
			</FormControl>
			<Categories
				pass={pass}
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
					<>
						<Typography variant="overline" textAlign="right" display="block">
							{productsFilteredByCategory.length}
						</Typography>
						{productsSearched ? (
							<Masonry
								columns={{ xs: 2, sm: 3, lg: 1 }}
								style={{
									listStyle: "none",
									margin: "0 auto",
								}}
							>
								{productsSearched.map(({ product: p, ...searchParams }) => (
									<Product
										pass={pass}
										key={p._id}
										product={p}
										searchParams={searchParams}
										onEditOpen={() => {
											setUpdateFormData(p);
											setUpdateOpen(true);
										}}
										onDeleteClose={() => handleDelete(p._id)}
									/>
								))}
							</Masonry>
						) : (
							<>
								{subcategories.map((c) => (
									<div key={c} id={c}>
										<Box id={c} mb={0.6} className="or" color="white">
											{c}
										</Box>
										<Masonry
											columns={{ xs: 2, sm: 3, lg: 1 }}
											style={{
												listStyle: "none",
												margin: "0 auto",
											}}
										>
											{productsFilteredByCategory
												.filter((p) => p.subcategory === c)
												.sort((a, b) =>
													a.name
														.toLowerCase()
														.localeCompare(b.name.toLowerCase()),
												)
												.map((p) => (
													<Product
														pass={pass}
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
									</div>
								))}
							</>
						)}
					</>
				)}
				<Box m={2} textAlign="right">
					<TextField
						id="outlined-string"
						label="Pass"
						value={pass}
						onChange={(e) => changePass(e.target.value.trim())}
						type="string"
						slotProps={{
							inputLabel: {
								shrink: true,
							},
						}}
						sx={{ mb: 2 }}
					/>
					<TextField
						id="outlined-number"
						label="Current Exchange"
						value={exchange}
						onChange={(e) => changeExchange(+e.target.value)}
						type="number"
						slotProps={{
							inputLabel: {
								shrink: true,
							},
						}}
					/>
				</Box>
			</Container>
			{pass && (
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
			)}

			{!searchQuery && <CollapsibleSideMenu subcategories={subcategories} />}
		</Suspense>
	);
};

const AppLoading = (): ReactNode => (
	<span className="text-red-600">AppLoading</span>
);

export default App;
