import React from "React";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
	Card,
	CardContent,
	Typography,
	CardActions,
	Box,
	IconButton,
} from "@mui/material";

export default ({ product, onEditOpen, onDeleteClose, searchParams }) => {
	product.name = product.name.trim();
	return (
		<Card>
			<CardContent sx={{ pb: ".2rem !important", p: 1 }}>
				<Typography
					variant="body1"
					color="text.primary"
					style={{ wordWrap: "break-word" /* direction: "rtl" */ }}
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
						<IconButton size="small" onClick={onDeleteClose}>
							<DeleteIcon fontSize="small" />
						</IconButton>
					</CardActions>
				</Box>
			</CardContent>
		</Card>
	);
};
