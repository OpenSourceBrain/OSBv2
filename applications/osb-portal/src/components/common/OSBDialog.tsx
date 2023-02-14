import * as React from "react";

//components
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

//icons
import CloseIcon from "@mui/icons-material/Close";

//style
import {

  drawerText,
} from "../../theme";

interface DialogProps {
  open: boolean;
  title: string | React.ReactNode;
  subTitle?: string | React.ReactNode;
  maxWidth?: false | "xs" | "sm" | "md" | "lg" | "xl";
  actions?: React.ReactElement;
  closeAction: () => void;
  className?: string;
  sx?: any
}

export const OSBDialog: React.FunctionComponent<DialogProps> = ({
  closeAction,
  open,
  title,
  children,
  actions,
  maxWidth,
  sx,
  subTitle,
}) => {
  const handleClose = () => {
    if (closeAction) {
      closeAction();
    } else {
      console.debug("closeAction not defined on OSBDialog");
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth={false}
      maxWidth={maxWidth}
      sx={sx}
    >
      <DialogTitle>
        <Typography component="h3" variant="h6" sx={{m: 0}}>
          {title}
          <Typography
            component="p"
            variant="subtitle1"
          >
            {subTitle}
          </Typography>
        </Typography>

        <IconButton sx={{p: 0, fontSize: "1rem"}} onClick={handleClose}>
          <CloseIcon fontSize="inherit" sx={{ color: drawerText }} />
        </IconButton>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      {actions ? <DialogActions>{actions}</DialogActions> : null}
    </Dialog>
  );
};

export default OSBDialog;
