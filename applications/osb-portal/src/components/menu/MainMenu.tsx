import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { MainMenuItem } from "./MainMenuItem";

const useStyles = makeStyles((theme) => ({
  button: {
    textTransform: "inherit",
    minWidth: "auto",
    width: "auto",
    marginRight: "3em",
    lineHeight: 1.4,
    fontWeight: 400,
  },
  firstButton: {
    fontWeight: 600,
  },
}));

export const MainMenu = () => {
  const classes = useStyles();

  return (
    <Box display="flex" p={0} bgcolor="background.paper">
      <MainMenuItem
        title="OSB"
        className={classes.button + ' ' + classes.firstButton}
        
      />
      <MainMenuItem title="File" className={classes.button} />
      <MainMenuItem title="View" className={classes.button} />
      <MainMenuItem title="Model" className={classes.button} />
      <MainMenuItem title="Help" className={classes.button} />
    </Box>
  );
};
