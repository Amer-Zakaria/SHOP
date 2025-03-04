import React, { type ReactNode, Suspense, useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Container,
	TextField,
	Card,
	CardContent,
	Typography,
	CardActions,
	Box,
	IconButton,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import type { ICategory, ICategoryWithId } from "../types/ICategory";

import { Masonry } from "@mui/lab";
import Categories from "../components/Categories";

interface IProduct {
	name: string;
	price: number;
	category: string;
}

type IProductWithId = IProduct & { _id: string };

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const baseProduct = { name: "", price: 0, category: "" };

const App = (): ReactNode => {
	// Define the fetch function
	const fetchProducts = async () => {
		const { data } = await axios.get("/products");
		return data;
	};

	const {
		data: initProducts,
		error,
		isLoading,
		isError,
		isSuccess,
	} = useQuery<IProductWithId[]>({
		queryKey: ["products"],
		queryFn: fetchProducts,
	});

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
	const [categories, setCategories] = useState<ICategoryWithId[]>([]);
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
	}, [categoryIsSuccess, initCategories, categories.length]);
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
	const products = selectedCategoryId
		? (initProducts?.filter((p) => p.category === selectedCategoryId) ?? [])
		: (initProducts ?? []);

	// SEARCH
	const [searchQuery, setSearchQuery] = useState<string>("");
	const productsSearched =
		searchQuery && products ? smartSearch(products, searchQuery) : null;

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
				{isError && <p>Error, Try again</p>}
				{isSuccess && (
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
							: products.map((p) => (
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

const Product = ({ product, onEditOpen, onDeleteClose, searchParams }) => {
	product.name = product.name.trim();
	return (
		<>
			<Card>
				<CardContent sx={{ pb: ".2rem !important", p: 1 }}>
					<Typography
						variant="body1"
						color="text.primary"
						style={{ wordWrap: "break-word", direction: "rtl" }}
					>
						{searchParams ? (
							<>
								{searchParams.startIndex >= 1 && // if it's 0 then it's already exsits in the heightling down there
									product.name.slice(0, searchParams.startIndex)}
								<span style={{ backgroundColor: "#FBC02D", padding: "0" }}>
									{product.name.slice(
										searchParams.startIndex,
										searchParams.endIndex + 1,
									)}
								</span>
								{product.name.slice(searchParams.endIndex + 1)}
							</>
						) : (
							product.name
						)}
					</Typography>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
					>
						<Typography
							variant="body1"
							color="primary"
							fontSize="large"
							component={"div"}
						>
							{product.price}
						</Typography>
						<CardActions sx={{ p: 0 }}>
							<IconButton size="small" onClick={onEditOpen}>
								<EditIcon fontSize="small" />
							</IconButton>
							<IconButton size="small" onClick={onDeleteClose}>
								<DeleteIcon fontSize="small" />
							</IconButton>
						</CardActions>
					</Box>
				</CardContent>
			</Card>
		</>
	);
};

function UpdateProductDialog({
	open,
	onClose,
	handleSubmit,
	product,
	handleChange,
	setUpdateFormData,
	categories,
	categoryIsLoading,
	categoryIsError,
	categoryIsSuccess,
}) {
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>Add Product</DialogTitle>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<TextField
						fullWidth
						label="Name"
						name="name"
						value={product.name}
						onChange={handleChange}
						margin="dense"
					/>
					<TextField
						fullWidth
						label="Price"
						name="price"
						value={product.price}
						onChange={handleChange}
						type="number"
						margin="dense"
					/>
					<FormControl
						margin="dense"
						sx={{ marginBottom: 2 }}
						fullWidth
						onSubmit={handleSubmit}
					>
						<InputLabel id="select-category">Category</InputLabel>
						<Select
							labelId="select-category"
							id="demo-simple-select"
							value={product.category}
							label="Category"
							onChange={(e) => {
								setUpdateFormData((old) => ({
									...old,
									category: e.target.value,
								}));
							}}
						>
							{categoryIsLoading && "Loading..."}
							{categoryIsError && "Error"}
							{categoryIsSuccess &&
								categories.map((category) => (
									<MenuItem key={category._id} value={category._id}>
										{category.name}
									</MenuItem>
								))}
						</Select>
					</FormControl>
				</form>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="secondary">
					Cancel
				</Button>
				<Button onClick={handleSubmit} color="primary" variant="contained">
					Update Product
				</Button>
			</DialogActions>
		</Dialog>
	);
}

function CreateProductDialog({
	open,
	onClose,
	handleSubmit,
	formData,
	handleChange,
	categoryIsLoading,
	categoryIsError,
	categoryIsSuccess,
	categories,
	setFormData,
}) {
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>Add Product</DialogTitle>
			<DialogContent>
				<TextField
					fullWidth
					label="Name"
					name="name"
					value={formData.name}
					onChange={handleChange}
					margin="dense"
					sx={{ marginBottom: 2 }}
				/>
				<TextField
					sx={{ marginBottom: 2 }}
					fullWidth
					label="Price"
					name="price"
					value={formData.price}
					onChange={handleChange}
					type="number"
					margin="dense"
				/>
				<FormControl
					margin="dense"
					sx={{ marginBottom: 2 }}
					fullWidth
					onSubmit={handleSubmit}
				>
					<InputLabel id="select-category">Category</InputLabel>
					<Select
						labelId="select-category"
						id="demo-simple-select"
						value={formData.category}
						label="Category"
						onChange={(e) => {
							setFormData((old) => ({ ...old, category: e.target.value }));
						}}
					>
						{categoryIsLoading && "Loading..."}
						{categoryIsError && "Error"}
						{categoryIsSuccess &&
							categories.map((category) => (
								<MenuItem key={category._id} value={category._id}>
									{category.name}
								</MenuItem>
							))}
					</Select>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="secondary">
					Cancel
				</Button>
				<Button onClick={handleSubmit} color="primary" variant="contained">
					Add Product
				</Button>
			</DialogActions>
		</Dialog>
	);
}

interface SearchResult {
	product: IProductWithId;
	score: number;
	startIndex?: number;
	endIndex?: number;
}

/**
 * Attempts a fuzzy match of `query` inside `str`.
 * It returns null if not all characters in the query can be found in order.
 * If a match is found, it returns the match's score, start index, and end index.
 */
function fuzzyMatch(
	str: string,
	query: string,
): { score: number; startIndex?: number; endIndex?: number } | null {
	const lowerStr = str.toLowerCase();
	const lowerQuery = query.toLowerCase();

	// If the query appears as a contiguous substring, return that match.
	const exactIndex = lowerStr.indexOf(lowerQuery);
	if (exactIndex !== -1) {
		return {
			// You can decide on a scoring strategy for exact matches.
			score: 1 + (exactIndex === 0 ? 0.5 : 0),
			startIndex: exactIndex,
			endIndex: exactIndex + lowerQuery.length - 1,
		};
	}

	// Otherwise, do a fuzzy match (matching characters in order).
	let startIndex = -1;
	let currentIndex = 0;
	let lastMatchIndex = -1;

	for (let i = 0; i < lowerQuery.length; i++) {
		const ch = lowerQuery[i];
		const foundIndex = lowerStr.indexOf(ch, currentIndex);
		if (foundIndex === -1) {
			return { score: 0 };
		}
		if (startIndex === -1) {
			startIndex = foundIndex;
		}
		lastMatchIndex = foundIndex;
		currentIndex = foundIndex + 1;
	}

	const span = lastMatchIndex - startIndex + 1;
	let score = lowerQuery.length / span;
	if (startIndex === 0) {
		score += 0.5;
	}

	return { score };
}

/**
 * smartSearch takes an array of strings and a search query.
 * It returns an array of SearchResult objects that include the item,
 * the matching score, and the start and end indices of the match.
 * The results are sorted from the highest score (best match) to lowest.
 */
function smartSearch(
	products: IProductWithId[],
	query: string,
): SearchResult[] {
	const results: SearchResult[] = [];

	for (const product of products) {
		const match = fuzzyMatch(product.name, query);
		if (match) {
			results.push({
				product,
				score: match.score,
				startIndex: match.startIndex,
				endIndex: match.endIndex,
			});
		}
	}

	// Sort results in descending order by score.
	results.sort((a, b) => b.score - a.score);

	return results;
}
