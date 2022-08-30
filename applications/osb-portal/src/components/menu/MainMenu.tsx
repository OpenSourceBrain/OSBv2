import * as React from "react";
import { useHistory } from 'react-router-dom';
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { MainMenuItem } from "./MainMenuItem";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


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
  flipButton: {
    fontWeight: 700,
    textTransform: "uppercase",
    padding: '5px',
    fontSize: '0.75rem',
  },
}));

export const MainMenu = (props: any) => {
  const classes = useStyles();
  const history = useHistory();

  const handleDialogOpen = () => {
    props.openDialog();
  };
  return (

    <Box display="flex" flexWrap="wrap" p={0} bgcolor="background.paper" justifyContent="space-between" id='main-menu'>
      <Box display="flex" flexWrap="wrap" p={0}>
        <MainMenuItem
          title="OSB"
          className={classes.button + " " + classes.firstButton}
          items={[
            { label: "Documentation", callback: () => window.open("https://docs.opensourcebrain.org/OSBv2/Overview.html") },
            { label: "Chat", callback: () => window.open("https://matrix.to/#/%23OpenSourceBrain_community:gitter.im?utm_source=gitter") },
            { label: "About", callback: handleDialogOpen },
          ]}
        />
        <MainMenuItem
          title="View"
          className={classes.button}
          items={[
            { label: "Repositories", callback: () => history.push("/repositories"), checked: history.location.pathname === "/repositories" },
            { label: "Workspaces", callback: () => history.push("/"), checked: history.location.pathname === '/' },
          ]}
        />
      </Box>
      {
        history.location.pathname === "/" ?
          <MainMenuItem
            title={<>WORKSPACES <ExpandMoreIcon fontSize="small" /></>}
            className={classes.flipButton}
            items={[
              { label: "Repositories", callback: () => history.push("/repositories") },
            ]}
            popperPlacement="bottom-end"
          />
          :
          history.location.pathname === "/repositories" ?
            <MainMenuItem
              title={<>REPOSITORIES <ExpandMoreIcon fontSize="small" /></>}
              className={classes.flipButton}
              items={[
                { label: "Workspaces", callback: () => history.push("/") },
              ]}
              popperPlacement="bottom-end"
            />
            : null
      }
    </Box>
  );
};

export default MainMenu;
