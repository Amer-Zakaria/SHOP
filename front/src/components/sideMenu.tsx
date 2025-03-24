import React, { useState } from "react";
import {
	Box,
	Collapse,
	IconButton,
	Paper,
	List,
	ListItemText,
	ListItemButton,
} from "@mui/material";
import { KeyboardArrowRight, KeyboardArrowLeft } from "@mui/icons-material";

export default function CollapsibleSideMenu({ subcategories }) {
	const [open, setOpen] = useState(false);

	const handleToggle = () => {
		setOpen((prev) => !prev);
	};

	return (
		<Paper
			elevation={3}
			sx={{
				direction: "rtl",
				position: "fixed",
				top: 135,
				right: 0,
				display: "inline-block",
				borderRadius: 1,
				overflow: "hidden",
			}}
		>
			<IconButton onClick={handleToggle} sx={{ p: 1 }}>
				{open ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
			</IconButton>
			<Collapse in={open} timeout="auto" unmountOnExit>
				<Box sx={{ p: 1 }}>
					<List disablePadding>
						{subcategories.map((c) => (
							<ListItemButton key={c} to={`#${c}`}>
								<ListItemText primary={c} />
							</ListItemButton>
						))}
					</List>
				</Box>
			</Collapse>
		</Paper>
	);
}
