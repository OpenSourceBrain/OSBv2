import * as React from "react";

//components
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";

//icons
import CloseIcon from '@mui/icons-material/Close';

//style
import makeStyles from '@mui/styles/makeStyles';
import { checkBoxColor, bgDarker, secondaryColor, paragraph, lightText, drawerText } from "../../theme";
import clsx from "clsx";

interface DialogProps {
  open: boolean;
  title: string | React.ReactNode;
  subTitle?: string | React.ReactNode;
  maxWidth?: false | "xs" | "sm" | "md" | "lg" | "xl";
  actions?: React.ReactElement;
  closeAction: () => void;
  className?: string
}

const useStyles = makeStyles((theme) => ({
  dialog: {
    padding: '2rem',
    backgroundColor: bgDarker,
    backgroundImage: 'unset',
    borderRadius: '16px',

    "& .MuiDialogContent-root": {
      padding: 0,
    },
    "& .MuiDialogTitle-root": {
      marginBottom: '1.572rem',
      padding: 0,
      color: secondaryColor,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',

      '& .MuiButtonBase-root': {
        alignSelf: 'end',
        padding: 0,

        '& .MuiSvgIcon-root': {
          marginBottom: 0,
        }
      }

    },
  },
  closeIcon: {
    color: checkBoxColor,
  },
  createWorkspaceRepo: {
    '& .MuiSvgIcon-root':{
      marginBottom: theme.spacing(1)
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
  className,
  subTitle
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
      PaperProps={{
        className: className ? clsx(classes.dialog, classes[className]) : classes.dialog
      }}
      onClose={handleClose}
      open={open}
      fullWidth={true}
      maxWidth={maxWidth}
    >
      <DialogTitle>
        <IconButton onClick={handleClose}>
          <CloseIcon sx={{color: drawerText}} />
        </IconButton>
        <Typography component="h1" variant="h1" align='center' sx={{fontWeight: 400, marginBottom: '1.143rem'}} >
          {title}
        </Typography>
        <Typography
            component="h5"
            variant="h5"
            color={lightText}
            align='center'
            sx={{ fontWeight: 400, letterSpacing: '0.02rem', lineHeight: 1.8 }}>
          {subTitle}
        </Typography>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      {actions ? <DialogActions>{actions}</DialogActions> : null}
    </Dialog>
  );
};

export default OSBDialog;
