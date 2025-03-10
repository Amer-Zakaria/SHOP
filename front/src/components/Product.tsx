import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
	Card,
	CardContent,
	Typography,
	CardActions,
	Box,
	IconButton,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	DialogContentText,
} from "@mui/material";

export default ({ product, onEditOpen, onDeleteClose, searchParams }) => {
	product.name = product.name.trim();

	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleAccept = () => {
		setOpen(false);
		onDeleteClose();
	};

	return (
		<Card>
			<ActionAlert
				productName={product?.name}
				open={open}
				setOpen={setOpen}
				handleAccept={handleAccept}
			/>
			<CardContent sx={{ pb: ".2rem !important", p: 1 }}>
				<Typography
					variant="body1"
					color="text.primary"
					style={{ wordWrap: "break-word" /* direction: "rtl" */ }}
				>
					{searchParams && (
						<Typography
							variant="body2"
							color="textSecondary"
							component="span"
							display="block"
						>
							{product.subcategory}
						</Typography>
					)}
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
				<Box display="flex" justifyContent="space-between" alignItems="center">
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
						<IconButton size="small" onClick={handleClickOpen}>
							<DeleteIcon fontSize="small" />
						</IconButton>
					</CardActions>
				</Box>
			</CardContent>
		</Card>
	);
};

function ActionAlert({ open, handleAccept, setOpen, productName }) {
	return (
		<Dialog
			open={open}
			onClose={() => setOpen(false)}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">Attention!</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					Are you sure you want to Delete "{productName}"?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => setOpen(false)}>Cancel</Button>
				<Button onClick={handleAccept} autoFocus>
					Delete!
				</Button>
			</DialogActions>
		</Dialog>
	);
}
