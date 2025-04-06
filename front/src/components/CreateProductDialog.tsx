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

export default function CreateProductDialog({
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
					fullWidth
					label="Name In Arabic"
					name="nameAr"
					value={formData.nameAr}
					onChange={handleChange}
					margin="dense"
					sx={{ marginBottom: 2 }}
				/>
				<TextField
					fullWidth
					label="Image URL"
					name="imgUrl"
					value={formData.imgUrl}
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
				<TextField
					sx={{ marginBottom: 2 }}
					fullWidth
					label="Subcategory"
					name="subcategory"
					value={formData.subcategory}
					onChange={handleChange}
					type="string"
					margin="dense"
				/>
				<TextField
					sx={{ marginBottom: 2 }}
					fullWidth
					label="Subcategory in Arabic"
					name="subcategoryAr"
					value={formData.subcategoryAr}
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
					Add Product
				</Button>
			</DialogActions>
		</Dialog>
	);
}
