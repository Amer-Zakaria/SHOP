import React, { useState } from "react";
import {
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	TextField,
} from "@mui/material";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import type { ICategory } from "../types/ICategory";

const baseCategory = { name: "", isSelected: false, nameAr: "" };

export default function Categories({
	categories,
	isLoading,
	isError,
	pass,
	isSuccess,
	onSelectCategory,
}) {
	const [formData, setFormData] = useState(baseCategory);

	const addCategory = async (category: ICategory) => {
		const response = await axios.post("/categories", category, {
			headers: { "x-auth-pass": pass },
		});
		return response.data;
	};

	const useAddCategory = () => {
		const queryClient = useQueryClient();

		return useMutation({
			mutationFn: addCategory,
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: ["categories"],
				});

				setFormData(baseCategory);
				setOpen(false);
			},
		});
	};
	const mutation = useAddCategory();

	const [open, setOpen] = useState(false);
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		mutation.mutate(formData);
	};
	const handleClose = () => {
		setOpen(false);
		setFormData(baseCategory);
	};

	// DELETE
	const deleteProduct = async (id: string) => {
		const response = await axios.delete(`/categories/${id}`, {
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
					queryKey: ["categories"],
				});
			},
		});
	};
	const deleteMutation = useDeleteProduct();
	const handleDelete = (id: string) => {
		deleteMutation.mutate(id);
	};

	const [isAllCategory, setIsAllCategory] = useState<boolean>(false);

	return (
		<>
			<Box
				sx={{
					display: "flex",
					mt: 1,
					mx: 3,
					flexWrap: "wrap",
					alignItems: "center",
				}}
			>
				{(isSuccess || categories?.length >= 1) && (
					<>
						<Chip
							key="All"
							variant={isAllCategory ? "filled" : "outlined"}
							label="All"
							onClick={() => {
								if (!isAllCategory) {
									// Upon Selecting
									onSelectCategory("XXX"); // FALSIFY THE REST
									setIsAllCategory(true);
								} else {
									//Upon Deselecting
									onSelectCategory(categories[0]._id);
									setIsAllCategory(false);
								}
							}}
							sx={{
								mr: 1,
								textAlign: "center",
								verticalAlign: "middle",
								display: "inline-block",
								py: 0.6,
								my: 0.5,
								wordWrap: "break-word",
							}}
						/>
						{categories.map((category) => (
							<Chip
								key={category.name}
								variant={category.isSelected ? "filled" : "outlined"}
								label={category.name}
								onClick={() => {
									setIsAllCategory(false);
									onSelectCategory(category._id);
								}}
								sx={{
									mr: 1,
									textAlign: "center",
									verticalAlign: "middle",
									display: "inline-block",
									py: 0.6,
									my: 0.5,
									wordWrap: "break-word",
								}}
								// onDelete={() => {
								// 	handleDelete(category._id);
								// }}
							/>
						))}
					</>
				)}
				{pass && (
					<IconButton onClick={() => setOpen(true)}>
						<AddIcon />
					</IconButton>
				)}
			</Box>
			<CreateCategoryDialog
				formData={formData}
				open={open}
				onClose={handleClose}
				handleChange={handleChange}
				handleSubmit={handleSubmit}
			/>
		</>
	);
}

function CreateCategoryDialog({
	open,
	onClose,
	handleSubmit,
	formData,
	handleChange,
}) {
	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>Add Category</DialogTitle>
			<DialogContent>
				<form onSubmit={handleSubmit}>
					<TextField
						fullWidth
						label="Name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						margin="dense"
					/>
					<TextField
						fullWidth
						label="Name in Arabic"
						name="nameAr"
						value={formData.nameAr}
						onChange={handleChange}
						margin="dense"
					/>
				</form>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="secondary">
					Cancel
				</Button>
				<Button onClick={handleSubmit} color="primary" variant="contained">
					Add Category
				</Button>
			</DialogActions>
		</Dialog>
	);
}
