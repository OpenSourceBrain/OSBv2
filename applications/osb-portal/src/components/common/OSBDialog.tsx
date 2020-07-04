import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Grid, Paper } from "@material-ui/core";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import Box from "@material-ui/core/Box";
import AppsOutlinedIcon from "@material-ui/icons/AppsOutlined";
import InsertChartOutlinedIcon from "@material-ui/icons/InsertChartOutlined";
import CodeOutlinedIcon from "@material-ui/icons/CodeOutlined";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";

import "react-markdown-editor-lite/lib/index.css";

import * as Icons from "../icons";

interface DialogProps {
  open: boolean;
  title: string;
  actions?: React.ReactElement;
  closeAction: () => void;
}

export const OSBDialog: React.FunctionComponent<DialogProps> = ({
  closeAction,
  open,
  title,
  children,
  actions,
}) => {
  const handleClose = () => {
    if (closeAction) {
      closeAction();
    } else {
      console.debug("closeAction not defined on OSBDialog");
    }
  };
  return (
    <Dialog onClose={handleClose} open={open} maxWidth={"md"} fullWidth={true}>
      <DialogTitle disableTypography={true}>
        <Box display="flex" justifyContent="space-between">
          {title}
          <IconButton aria-label="close" onClick={handleClose} style={{padding: 0}} >
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
