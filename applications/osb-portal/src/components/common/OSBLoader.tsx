// Derived from https://raw.githubusercontent.com/MetaCell/geppetto-meta/master/geppetto.js/geppetto-ui/src/loader/Loader.js

import React, { ReactElement, Fragment } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { primaryColor } from "../../theme";

interface OSBLoaderProps {
  active: boolean;
  fullscreen?: boolean;
  handleClose: () => void;
  messages: string[];
  elapsed?: number;
  children?: ReactElement;
  className?: string;
  messagesInterval?: number;
}

export const OSBLoader = (props: OSBLoaderProps) => {
  const {
    active,
    fullscreen,
    handleClose,
    messages,
    elapsed,
    children,
    className,
    messagesInterval,
  } = props;

  const [messageIndex, setMessageIndex] = React.useState<number>(0);

  if (messagesInterval && messages.length) {
    setTimeout(() => {
      if (messages.length && active) {
        setMessageIndex((messageIndex + 1) % messages.length);
      }
    }, messagesInterval);
  }

  const message =
    messages.length > 0 ? messages[messageIndex % messages.length] : "";
  const progress = elapsed ? (
    <LinearProgress
      variant="determinate"
      value={elapsed * 100}
      style={{ width: "200px" }}
    />
  ) : (
    <CircularProgress color="inherit" variant="indeterminate" />
  );

  const typedMessage = className ? (
    <Typography
      className={className}
      display="block"
      variant="subtitle1"
      gutterBottom={true}
    >
      {message}
    </Typography>
  ) : (
    <Typography display="block" variant="subtitle1" gutterBottom={true}>
      {message}
    </Typography>
  );

  const content: ReactElement = children ? (
    children
  ) : (
    <Grid container={true} spacing={1}>
      <Grid container={true} item={true} spacing={3} xs={12} justifyContent="center">
        <Grid item={true}>{progress}</Grid>
      </Grid>
      <Grid container={true} item={true} spacing={3} xs={12} justifyContent="center">
        <Grid item={true}>{typedMessage}</Grid>
      </Grid>
    </Grid>
  );

  const backdropStyles = {
    zIndex: (theme: any) => theme.zIndex.drawer + 1,
    color: primaryColor,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  };

  const backdrop = fullscreen ? (
    <Fragment>
      <Backdrop
        sx={backdropStyles}
        open={active}
        onClick={handleClose}
      >
        {content}
      </Backdrop>
    </Fragment>
  ) : (
    <Fragment>
      <Backdrop
        open={active}
        onClick={handleClose}
        sx={{
          ...backdropStyles,
          position: "absolute",
          flex: "0 0 100%",
          alignSelf: "stretch",
        }}
      >
        {content}
      </Backdrop>
    </Fragment>
  );

  return backdrop;
};

export default OSBLoader;