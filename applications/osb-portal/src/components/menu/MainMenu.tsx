import * as React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import { MainMenuItem } from "./MainMenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const styles = {
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
    padding: "5px",
    fontSize: "0.75rem",
  },
};

export const MainMenu = (props: any) => {
  const navigate = useNavigate();

  const handleDialogOpen = () => {
    props.openDialog();
  };
  return (
    <Box
      display="flex"
      flexWrap="wrap"
      p={0}
      bgcolor="background.paper"
      justifyContent="space-between"
      className="main-menu"
    >
      <Box display="flex" flexWrap="wrap" p={0}>
        <MainMenuItem
          title="OSB"
          sx={{...styles.button, ...styles.firstButton}}
          items={[
            {
              label: "Documentation",
              callback: () =>
                window.open(
                  "https://docs.opensourcebrain.org/OSBv2/Overview.html"
                ),
            },
            {
              label: "Chat",
              callback: () =>
                window.open(
                  "https://matrix.to/#/%23OpenSourceBrain_community:gitter.im?utm_source=gitter"
                ),
            },
            { label: "About", callback: handleDialogOpen },
          ]}
        />
        <MainMenuItem
          title="View"
          sx={styles.button}
          items={[
            {
              label: "Repositories",
              callback: () => navigate("/repositories"),
              checked: navigate.location.pathname === "/repositories",
            },
            {
              label: "Workspaces",
              callback: () => navigate("/"),
              checked: navigate.location.pathname === "/",
            },
          ]}
        />
      </Box>
      {navigate.location.pathname === "/" ? (
        <MainMenuItem
          title={
            <>
              WORKSPACES <ExpandMoreIcon fontSize="small" />
            </>
          }
          sx={styles.flipButton}
          items={[
            {
              label: "Repositories",
              callback: () => navigate("/repositories"),
            },
          ]}
          popperPlacement="bottom-end"
        />
      ) : navigate.location.pathname === "/repositories" ? (
        <MainMenuItem
          title={
            <>
              REPOSITORIES <ExpandMoreIcon fontSize="small" />
            </>
          }
          sx={styles.flipButton}
          items={[{ label: "Workspaces", callback: () => navigate("/") }]}
          popperPlacement="bottom-end"
        />
      ) : null}
    </Box>
  );
};

export default MainMenu;
