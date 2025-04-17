import * as React from "react";
import { useNavigate } from "react-router-dom";
//components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { PageSider } from "../components";

export const SidebarPageLayout = (props: { children: any }) => {
  const navigate = useNavigate();
  const isWorkspacesPage =
    window.location.pathname === "/" ||
    window.location.pathname.includes("workspaces");
  const isRepositoriesPage = window.location.pathname.includes("repositories");

  return (
    <Box className="verticalFit">
      <Grid container className="verticalFill">
        <Grid
          size={{ xs: 12, sm: 12, md: 3, lg: 2 }}
          sx={{ flexDirection: "column" }}
          className="verticalFill"
        >
          <Box width={1} className="verticalFit">
            <PageSider isWorkspacesPage={isWorkspacesPage} isRepositoriesPage={isRepositoriesPage} />
          </Box>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 12, md: 9, lg: 10 }}
          alignItems="stretch"
          className="verticalFill"
        >
          <Box width={1} className="verticalFit">
            {props.children}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SidebarPageLayout;
