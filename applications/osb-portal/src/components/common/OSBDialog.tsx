import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";

import * as Icons from "../icons";

import { checkBoxColor, bgDarker } from "../../theme";

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
      <DialogTitle disableTypography={true}>
        <Box display="flex" justifyContent="space-between">
          {title}
          <IconButton
            className={classes.closeIcon}
            aria-label="close"
            onClick={handleClose}
            style={{ padding: 0 }}
          >
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
