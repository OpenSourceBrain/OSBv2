import React from 'react';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import {
	useNavigate,
} from "react-router-dom";
import { Button } from "@mui/material";


const DeleteDialog = ({
	open,
	setOpen,
	title,
	description,
	handleDeleteCallback,
	navigateToPath
}) => {
	const navigate = useNavigate();

	const handleDelete = () => {
		handleDeleteCallback();
		if (navigateToPath && window.location.pathname !== "/") {
			navigate(navigateToPath)
		}
	}

	return (
		<Dialog
			open={open}
			onClose={() => setOpen(false)}
		>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>{description}</DialogContent>
			<DialogActions>
				<Button
					color="primary"
					onClick={() => {
						setOpen(false);
					}}
				>
					CANCEL
				</Button>
				<Button color="primary" variant="contained" onClick={handleDelete}>
					DELETE
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default DeleteDialog;