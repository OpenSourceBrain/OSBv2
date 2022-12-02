import * as React from "react";
import makeStyles from '@mui/styles/makeStyles';
import Box from "@mui/material/Box";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

import * as Icons from "../icons";

import { checkBoxColor, bgDarker, secondaryColor } from "../../theme";

interface DialogProps {
  open: boolean;
  title: string | React.ReactNode;
  maxWidth?: false | "xs" | "sm" | "md" | "lg" | "xl";
  actions?: React.ReactElement;
  closeAction: () => void;
}

const useStyles = makeStyles((theme) => ({
  dialog: {
    padding: 0,
    "& .MuiDialogContent-root": {
      padding: 0,
      backgroundColor: bgDarker,
    },
    "& .MuiDialogTitle-root": {
      backgroundColor: bgDarker,
      marginBottom: 0,
      color: secondaryColor,
    },
  },
  closeIcon: {
    color: checkBoxColor,
  },
}));

export const OSBDialog: React.FunctionComponent<DialogProps> = ({
  closeAction,
  open,
  title,
  children,
  actions,
  maxWidth,
}) => {
  const handleClose = () => {
    if (closeAction) {
      closeAction();
    } else {
      console.debug("closeAction not defined on OSBDialog");
    }
  };

  const classes = useStyles();

  return (
    <Dialog
      className={classes.dialog}
      onClose={handleClose}
      open={open}
      fullWidth={true}
      maxWidth={maxWidth}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between">
          {title}
          <IconButton
            className={classes.closeIcon}
            aria-label="close"
            onClick={handleClose}
            style={{ padding: 0 }}
            size="large">
            <Icons.CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>{children}</DialogContent>
      {actions ? <DialogActions>{actions}</DialogActions> : null}
    </Dialog>
  );
};

export default OSBDialog;
