import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { MainMenuItem } from "./MainMenuItem";

const useStyles = makeStyles(() => ({
  button: {
    textTransform: "inherit",
    minWidth: "auto",
    width: "auto",
    marginRight: "3em",
    lineHeight: 1,
    fontWeight: 400,
  },
  firstButton: {
    fontWeight: 600,
  },
}));

export const MainMenu = () => {
  const classes = useStyles();

  return (
    <Box display="flex" flexWrap="wrap" p={0} bgcolor="background.paper">
      <MainMenuItem
        title="OSB"
        className={classes.button + " " + classes.firstButton}
        items={[]}
      />
      <MainMenuItem title="File" className={classes.button} items={[]} />
      <MainMenuItem title="View" className={classes.button} items={[]} />
      <MainMenuItem title="Model" className={classes.button} items={[]} />
      <MainMenuItem title="Help" className={classes.button} items={[]} />
    </Box>
  );
};

export default MainMenu;
