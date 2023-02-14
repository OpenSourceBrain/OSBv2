import * as React from "react";
import { useHistory, useParams } from "react-router";

//theme
import { styled } from "@mui/styles";
import {
  paragraph,
  secondaryColor as white,
  chipBg,
  bgLightest,
  bgDarkest,
  bgDark,
  lightWhite,
} from "../theme";

//components
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { PageSider } from "../components";
import { WorkspaceEditor } from "../components";
import { OSBSplitButton } from "../components/common/OSBSplitButton";
import { WorkspaceActionsMenu } from "../components";

import WorkspaceDetailsInfo from "../components/workspace/WorkspaceDetailsInfo";

//services
import { canEditWorkspace } from "../service/UserService";

//types
import { Workspace, OSBApplication } from "../types/workspace";

//icons
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import WorkspaceResourceBrowser from "../components/workspace/drawer/WorkspaceResourceBrowser";


const NavbarButton = styled(Button)(({ theme }) => ({
  fontSize: "12px",
  textTransform: "none",
  borderRadius: "6px",
  minHeight: "32px",
  fontWeight: 600,
  "&:hover": {
    backgroundColor: "transparent",
  },
}));

export const WorkspacePage = (props: any) => {
  const history = useHistory();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const workspace: Workspace = props.workspace;
  const user = props.user;
  const [editWorkspaceOpen, setEditWorkspaceOpen] = React.useState(false);
  const [error, setError] = React.useState<any>(null);
  const [anchorElmoreVert, setAnchorElmoreVert] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isWorkspaceOpen = Boolean(anchorElmoreVert);

  if (!workspace) {
    props.selectWorkspace(workspaceId);
  }

  if (error) {
    throw error;
  }

  const handleCloseEditWorkspace = () => {
    props.refreshWorkspace(workspaceId);
    setEditWorkspaceOpen(false);
  };

  const openWithApp = (selectedOption: OSBApplication) => {
    history.push(`/workspace/open/${workspaceId}/${selectedOption.code}`);
  };

  const canEdit = canEditWorkspace(props.user, workspace);

  return workspace ? (
    <>
      <div id="workspace-details" className="verticalFit">
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Grid
              container={true}
              alignItems="center"
              className="verticalFill"
              spacing={1}
              sx={{ background: bgDarkest }}
            >
              <Grid
                item={true}
                xs={12}
                sm={12}
                md={7}
                lg={7}
                className="verticalFill"
              >
                <NavbarButton
                  variant="text"
                  startIcon={<ChevronLeftIcon />}
                  onClick={() => history.push("/")}
                  sx={{ color: paragraph, padding: "16px 24px" }}
                >
                  All workspaces
                </NavbarButton>
              </Grid>
              <Grid
                item={true}
                gap={1}
                xs={12}
                sm={8}
                md={5}
                lg={5}
                justifyContent="end"
                padding={"0 16px"}
              >
                {canEdit && (
                  <NavbarButton
                    onClick={() => setEditWorkspaceOpen(true)}
                    sx={{
                      color: white,
                      border: `1px solid ${white}`,
                      "&:hover": {
                        border: `1px solid ${white}`,
                      },
                    }}
                  >
                    Edit
                  </NavbarButton>
                )}

                <OSBSplitButton
                  defaultSelected={workspace?.defaultApplication}
                  handleClick={openWithApp}
                />
                <NavbarButton
                  id="workspace-actions-menu"
                  size="small"
                  variant="contained"
                  aria-label="more"
                  onClick={(event) => setAnchorElmoreVert(event.currentTarget)}
                  sx={{
                    background: chipBg,
                    boxShadow: "none",
                    minWidth: "32px",
                  }}
                >
                  <MoreVertIcon fontSize="small" />
                </NavbarButton>
                <WorkspaceActionsMenu
                  workspace={workspace}
                  user={user}
                  isWorkspaceOpen={isWorkspaceOpen}
                  anchorEl={anchorElmoreVert}
                  setAnchorEl={(anchorEl) => setAnchorElmoreVert(anchorEl)}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
        {!workspace ? (
          <Box
            flex={1}
            px={2}
            py={2}
            display="flex"
            alignContent="center"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box
            id="workspace-detail-container"
            className="verticalFit"
            width={1}
            height={1}
            sx={{ overflowY: "hidden", backgroundColor: bgDark }}
          >
            <Box
              id="workspace-detail-top"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4.5rem",
                gap: "1rem",
              }}
            >
              {!canEdit && (
                <Tooltip
                  style={{ marginLeft: "0.3em" }}
                  title="You do not have permissions to modify this workspace."
                >
                  <LockOutlinedIcon sx={{ color: paragraph }} />
                </Tooltip>
              )}
              <Typography
                className="workspace-name"
                variant="h1"
                component="h1"
              >
                {workspace?.name}
              </Typography>
            </Box>
            <Box
              className="verticalFit"
              height={1}
              sx={{ background: "rgba(0, 0, 0, 0.25)" }}
            >
              <Grid container height={1} spacing={2} className="verticalFill">
                <Grid
                  id="workspace-detail-sidebar"
                  className="verticalFill"
                  item
                  xs={12}
                  sm={3}
                  lg={2}
                  sx={{
                    borderRight: `1px solid ${bgLightest}`,
                  }}
                >
                  <WorkspaceResourceBrowser
                    workspace={workspace}
                    user={user}
                    refreshWorkspace={props.refreshWorkspace}
                    openResourceAction={(resource) =>
                      history.push(
                        `/workspace/open/${workspaceId}/${resource.type.application.code}`
                      )
                    }
                    currentResource={
                      workspace.lastOpen || workspace.resources[0]
                    }
                  />
                </Grid>
                <Grid
                  item
                  justifyContent={workspace?.thumbnail ? "center" : "start"}
                  xs={12}
                  sm={6}
                  lg={8}
                  id="workspace-detail-content"
                  className="verticalFit"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    flexDirection="column"
                    className="scrollbar"
                  >
                    <Stack
                      spacing={4}
                      sx={{
                        py: "24px",
                        maxWidth: {
                          xs: "100%",
                          sm: "100%",
                          lg: "600px",
                          xl: "800px",
                        },
                      }}
                    >
                      <Box className="imageContainer" display="flex">
                        {workspace?.thumbnail && (
                          <img
                            width={"100%"}
                            src={
                              "/proxy/workspaces/" +
                              workspace.thumbnail +
                              "?v=" +
                              workspace.timestampUpdated.getMilliseconds()
                            }
                            title={workspace.name}
                            alt={workspace.name}
                          />
                        )}
                      </Box>
                      {workspace?.thumbnail && <Divider />}
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: lightWhite,
                          letterSpacing: "0.01em",
                          lineHeight: "24px",
                        }}
                      >
                        {workspace?.description}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3} lg={2}>
                  <WorkspaceDetailsInfo workspace={workspace} />
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </div>

      {canEdit && editWorkspaceOpen && (
        <WorkspaceEditor
          open={editWorkspaceOpen}
          title={"Edit workspace: " + workspace.name}
          closeHandler={handleCloseEditWorkspace}
          workspace={workspace}
          onLoadWorkspace={handleCloseEditWorkspace}
          user={user}
        />
      )}
    </>
  ) : (
    <Backdrop open={true}><CircularProgress /></Backdrop>
  );
};
export default WorkspacePage;
