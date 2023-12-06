import React from 'react';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";

import { Button, Link } from "@mui/material";


const WorkspaceConfirmDialog = ({
	createdWorkspaceConfirmationContent,
	setChecked,
	workspaceLink,
	handleCloseConfirmationDialog,
}) => {
	const { title, content, isSuccess, } = createdWorkspaceConfirmationContent;

	return (
		<Dialog
			open={true}
			onClose={() => handleCloseConfirmationDialog()}
		>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>{content}</DialogContent>
			<DialogActions>
				<Button
					color="primary"
					onClick={() => {
						setChecked([]);
						handleCloseConfirmationDialog();
					}}
				>
					Close
				</Button>
				<Button color="primary" variant="contained" disabled={!isSuccess || !workspaceLink.length}>
					<Link
						href={workspaceLink}
						target="_blank"
						color="secondary"
						underline="none"
					>
						Go to workspace
					</Link>
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default WorkspaceConfirmDialog;