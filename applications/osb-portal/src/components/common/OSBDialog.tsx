import * as React from "react";
import makeStyles from '@mui/styles/makeStyles';
import Box from "@mui/material/Box";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

import * as Icons from "../icons";

import { checkBoxColor, bgDarker, secondaryColor, paragraph } from "../../theme";
import clsx from "clsx";

interface DialogProps {
  open: boolean;
  title: string | React.ReactNode;
  maxWidth?: false | "xs" | "sm" | "md" | "lg" | "xl";
  actions?: React.ReactElement;
  closeAction: () => void;
  className?: string
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
  createWorkspaceRepo: {
    '& .MuiDialogTitle-root': {
      padding: '3.429rem 3.429rem 1.714rem 3.429rem',
      textAlign: 'center',
      fontSize: '1.714rem',
      fontWeight: 400
    },
    '& .MuiSvgIcon-root':{
      marginBottom: theme.spacing(2)
    },
    '& .MuiTypography-caption':{
        color: paragraph,
        fontSize: '0.857rem'
    },
    '& .MuiButtonBase-root': {
      '&:hover': {
        backgroundColor: 'transparent'
      }
    }
  }
}));

export const OSBDialog: React.FunctionComponent<DialogProps> = ({
  closeAction,
  open,
  title,
  children,
  actions,
  maxWidth,
  className
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
      className={className ? clsx(classes.dialog, classes[className]) : classes.dialog}
      onClose={handleClose}
      open={open}
      fullWidth={true}
      maxWidth={maxWidth}
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      {actions ? <DialogActions>{actions}</DialogActions> : null}
    </Dialog>
  );
};

export default OSBDialog;
