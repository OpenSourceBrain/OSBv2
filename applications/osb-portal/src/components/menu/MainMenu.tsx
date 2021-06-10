import * as React from "react";
import { useHistory } from 'react-router-dom';
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
  const history = useHistory();
  return (
    <Box display="flex" flexWrap="wrap" p={0} bgcolor="background.paper">

      <MainMenuItem
        title="OSB"
        className={classes.button + " " + classes.firstButton}
        items={[
          { label: "About", callback: () => alert("Open Source Brain v2") },
        ]}
      />
      <MainMenuItem
        title="View"
        className={classes.button}
        items={[
          { label: "Repositories", callback: () => history.push("/repositories") },
          { label: "Workspaces", callback: () => history.push("/workspaces") },
        ]}
      />
    </Box>
  );
};

export default MainMenu;
