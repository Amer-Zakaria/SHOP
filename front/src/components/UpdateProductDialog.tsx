import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";

export default function UpdateProductDialog({
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
					label="Name In Arabic"
					name="nameAr"
					value={product.nameAr}
					onChange={handleChange}
					margin="dense"
					sx={{ marginBottom: 2 }}
				/>
				<TextField
					fullWidth
					label="Image URL"
					name="imgUrl"
					value={product.imgUrl}
					onChange={handleChange}
					margin="dense"
					sx={{ marginBottom: 2 }}
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
				<TextField
					sx={{ marginBottom: 2 }}
					fullWidth
					label="Subcategory"
					name="subcategory"
					value={product.subcategory}
					onChange={handleChange}
					type="string"
					margin="dense"
				/>
				<TextField
					sx={{ marginBottom: 2 }}
					fullWidth
					label="Subcategory in Arabic"
					name="subcategoryAr"
					value={product.subcategoryAr}
					onChange={handleChange}
					type="string"
					margin="dense"
				/>
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
