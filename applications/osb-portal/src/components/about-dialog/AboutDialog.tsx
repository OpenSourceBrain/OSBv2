import React from "react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export const AboutDialog = (props: any) => {
    return (<Dialog
        open={props.aboutDialog}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
    >
        <DialogTitle id="dialog-title">{"About"}</DialogTitle>
        <DialogContent>
            <strong id="dialog-description">Some text for the time being</strong>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.closeDialog} color="primary" autoFocus={true}>
                Close
            </Button>
        </DialogActions>
    </Dialog>);
};

export default AboutDialog;
