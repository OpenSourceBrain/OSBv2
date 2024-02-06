import React from 'react';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import { Button } from "@mui/material";


const PrimaryDialog = ({
	open,
	setOpen,
	title,
	description,
	handleCallback,
	actionButtonText,
	cancelButtonText,
}) => {
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
					{cancelButtonText || "CANCEL"}
				</Button>
				<Button color="primary" variant="contained" onClick={handleCallback}>
					{actionButtonText || "DELETE"}
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default PrimaryDialog;