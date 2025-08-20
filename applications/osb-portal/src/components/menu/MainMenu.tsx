import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import { MainMenuItem } from "./MainMenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { openDialog } from "../../store/actions/aboutdialog";

const buttonStyles = {
  textTransform: "inherit",
  minWidth: "auto",
  width: "auto",
  marginRight: "3em",
  lineHeight: 1,
  fontWeight: 400,
};

const firstButtonStyles = {
  ...buttonStyles,
  fontWeight: 600,
};

const flipButtonStyles = {
  fontWeight: 700,
  textTransform: "uppercase",
  padding: "5px",
  fontSize: "0.75rem",
};

export const MainMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleDialogOpen = () => {
    dispatch(openDialog());
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
          sx={firstButtonStyles}
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
          sx={buttonStyles}
          items={[
            {
              label: "Repositories",
              callback: () => navigate("/repositories"),
              checked: location.pathname === "/repositories",
            },
            {
              label: "Workspaces",
              callback: () => navigate("/"),
              checked: location.pathname === "/",
            },
          ]}
        />
      </Box>
      {location.pathname === "/" ? (
        <MainMenuItem
          title={
            <>
              WORKSPACES <ExpandMoreIcon fontSize="small" />
            </>
          }
          sx={flipButtonStyles}
          items={[
            {
              label: "Repositories",
              callback: () => navigate("/repositories"),
            },
          ]}
          popperPlacement="bottom-end"
        />
      ) : location.pathname === "/repositories" ? (
        <MainMenuItem
          title={
            <>
              REPOSITORIES <ExpandMoreIcon fontSize="small" />
            </>
          }
          sx={flipButtonStyles}
          items={[{ label: "Workspaces", callback: () => navigate("/") }]}
          popperPlacement="bottom-end"
        />
      ) : null}
    </Box>
  );
};

export default MainMenu;
