import * as React from "react";

//components
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

//icons
import CloseIcon from '@mui/icons-material/Close';

//style
import { makeStyles } from "@mui/styles";
import { bgDarker, secondaryColor, checkBoxColor, bgLight } from '../../theme'


const useStyles = makeStyles((theme) => ({
    dialog: {
        padding: 0,
        backgroundColor: bgDarker,
        backgroundImage: 'unset',
        borderRadius: '2px',

        "& .MuiDialogContent-root": {
            padding: 0,
        },
        "& .MuiDialogTitle-root": {
            padding: '0.75rem 1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `0.0625rem solid ${bgLight}`,
            '& .MuiTypography-root': {
                color: secondaryColor,
                fontWeight: 700
            },
            '& .MuiButtonBase-root': {
                alignSelf: 'end',
                padding: 0,
                '& .MuiSvgIcon-root': {
                    marginBottom: 0,
                    fill: checkBoxColor
                },
                '&:hover': {
                    backgroundColor: 'transparent'
                }
            }
        },
        "&. MuiDialogActions-root": {
            padding: '1rem',
        }
    },
    paper: {
        backgroundColor: bgDarker,
        backgroundImage: 'unset',
    }
}));

export default ({ dialogOpen, handleClose }: { dialogOpen: boolean, handleClose: (open: boolean) => any }) => {
    const classes = useStyles();

    return (
        <Dialog
            PaperProps={{
                className: classes.dialog
            }}
            fullWidth
            open={dialogOpen}
            onClose={handleClose}
        >
            <DialogTitle>
                <Typography>Add repository</Typography>
                <IconButton onClick={() => handleClose(false)}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Paper className={classes.paper}>

                </Paper>
            </DialogContent>
            <DialogActions>
                <Button variant="text">Cancel</Button>
                <Button variant="contained">Add</Button>
            </DialogActions>

        </Dialog>
    );
};
