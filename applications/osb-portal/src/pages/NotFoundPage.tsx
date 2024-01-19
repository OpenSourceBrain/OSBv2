import React from 'react'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { getCleanPath } from '../utils'

const NotFoundPage = () => {
	const [message, setMessage] = React.useState("")
	const pathParts = getCleanPath(window.location.pathname)
	React.useEffect(() => {
		setMessage("This path doesn't exist")
	}, [pathParts])
	return (
		<>
			<Dialog open={true}>
				<DialogTitle id="alert-dialog-title" title="Error" />
				<DialogContent>
					<Alert severity="error" key={1}>
						<div className="errorAlertDiv" key={"div-1"}>
							{message}
						</div>
					</Alert>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => window.history.back()}
					>
						Go back
					</Button>
					<Button
						variant="outlined"
						color="primary"
						onClick={() => window.open("/", "_self")}
					>
						Return to homepage
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)


}

export default NotFoundPage