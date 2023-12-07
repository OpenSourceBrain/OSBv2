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
	workspace,
	handleDeleteWorkspace,
}) => {
	const navigate = useNavigate();

	const handleDelete = () => {
		handleDeleteWorkspace();
		if (window.location.pathname !== "/") {
			navigate("/");
		}
	}

	return (
		<Dialog
			open={open}
			onClose={() => setOpen(false)}
		>
			<DialogTitle>{'Delete Workspace ' + workspace.name}</DialogTitle>
			<DialogContent>{'You are about to delete Workspace ' + workspace.name + '. This action cannot be undone. Are you sure?'}</DialogContent>
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