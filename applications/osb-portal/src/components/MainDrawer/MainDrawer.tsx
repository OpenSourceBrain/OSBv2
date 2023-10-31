import * as React from "react";
import { useNavigate } from "react-router-dom";

//theme
import { makeStyles, useTheme } from "@mui/styles";
import clsx from "clsx";

import {
  bgRegular,
  bgDarkest,
  secondaryColor,
  drawerText,
  linkColor,
  selectedMenuItemBg,
  primaryColor,
} from "../../theme";

//hooks
import useMediaQuery from "@mui/material/useMediaQuery";

//components
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import ListItemIcon from "@mui/material/ListItemIcon";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ListSubheader from "@mui/material/ListSubheader";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CreateWorkspaceDialog from "../common/CreateWorkspaceDialog";
import { EditRepoDialog } from "..";
//icons
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import PublicIcon from "@mui/icons-material/Public";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import OSBDialog from "../common/OSBDialog";
import { NewWorkspaceAskUser } from "..";
import { UserInfo } from "../../types/user";
import TourIcon from '@mui/icons-material/Tour';
import HomeIcon from '@mui/icons-material/Home';

const styles = {
  drawerContent: {
    width: "100%",
  },
  root: (openDrawer) => (theme) => ({
    display: "flex",
    flexShrink: 0,
    whiteSpace: "nowrap",

    top: "initial",

    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: openDrawer
        ? theme.transitions.duration.enteringScreen
        : theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: "100%",

    "& .verticalFit": {
      display: "block",
    },

    "& .MuiListSubheader-root": {
      backgroundColor: "transparent",
      "& .MuiTypography-root": {
        textTransform: "uppercase",
        fontWeight: 600,
        fontSize: "0.714rem",
      },
    },
    "& .MuiList-root": {
      "& .Mui-selected": {
        background: selectedMenuItemBg,
        borderLeft: `2px solid ${primaryColor}`,

        "& .MuiListItemIcon-root": {
          "& .MuiSvgIcon-root": {
            color: secondaryColor,
          },
        },

        "& .MuiListItemText-root": {
          "& .MuiTypography-root": {
            color: secondaryColor,
          },
        },
      },
      "& .MuiButtonBase-root": {
        "& .MuiListItemIcon-root": {
          minWidth: "auto",
          marginRight: "0.875rem",

          "& .MuiSvgIcon-root": {
            fontSize: "1.143rem",
            color: drawerText,
          },
        },
        "& .MuiListItemText-root": {
          "& .MuiTypography-root": {
            fontSize: "0.857rem",
            color: drawerText,
            fontWeight: 500,
          },
        },
        "& .MuiListItemSecondaryAction-root": {
          "& .MuiButtonBase-root": {
            fontSize: "1rem",
            color: drawerText,
          },
        },
      },
    },
  }),
  menuButton: (theme) => ({
    marginRight: theme.spacing(2),
    display: {
      md: "none",
    },
  }),
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
  },

  drawerPaper: (theme) => ({
    position: "static",
    flex: 1,
    display: "flex",
    bottom: 0,
    paddingTop: theme.spacing(1),
    justifyContent: "space-between",
    borderRight: `1px solid ${bgRegular}`,
    backgroundColor: bgDarkest,
  }),
  createMenu: (theme) => ({
    minWidth: "14.62rem",
    backgroundColor: "#3C3C3C",
    borderRadius: "6px",

    "& .MuiList-root": {
      "& .MuiMenuItem-root": {
        paddingLeft: theme.spacing(3),
        fontSize: "0.857rem",
        color: drawerText,
        fontWeight: 500,

        "& .MuiSvgIcon-root": {
          marginRight: theme.spacing(2),
          fontSize: "1rem",
          color: drawerText,
        },

        "&:hover": {
          color: secondaryColor,
          "& .MuiSvgIcon-root": {
            color: secondaryColor,
          },
        },
      },
    },
  }),
};

export const MainDrawer = (props: {
  isWorkspacesPage: boolean;
  user: UserInfo;
  isRepositoriesPage: boolean;
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [openWorkspaceDialog, setOpenWorkspaceDialog] = React.useState(false);
  const [openRepoDialog, setOpenRepoDialog] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [askLoginOpen, setAskLoginOpen] = React.useState(false);
  const {isWorkspacesPage, isRepositoriesPage} = props;

  const openCreatMenu = Boolean(anchorEl);

  const navigate = useNavigate();

  
  const handleOpenDialog = (type) => {
    setOpenDrawer(false);
    if (!props.user) {
      setAskLoginOpen(true);
    } else {
      type === "workspace"
        ? setOpenWorkspaceDialog(true)
        : setOpenRepoDialog(true);
      setAnchorEl(null);
    }
  };

  const handleCloseDialog = (type) => {
    type === "workspace"
      ? setOpenWorkspaceDialog(false)
      : setOpenRepoDialog(false);
  };

  const handleClickCreatMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseCreatMenu = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  const handleAboutDialogOpen = () => {
    props.openDialog();
  };

  const closeAskLogin = () => setAskLoginOpen(false);

  return (
    <>
      {isMdUp ? null : (
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={styles.menuButton}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      )}
      <Box
        display="flex"
        alignItems="stretch"
        flex="1"
        className="verticalFill"
      >
        <Drawer
          variant={isMdUp ? "permanent" : "temporary"}
          anchor="left"
          onClose={toggleDrawer}
          elevation={0}
          open={openDrawer}
          sx={styles.root(openDrawer)}
          PaperProps={{
            sx: styles.drawerPaper,
          }}
        >
          <Box
            sx={openDrawer ? styles.drawerContent : {}}
            className={openDrawer ? "verticalFit" : ""}
          >
            {!isMdUp && <Toolbar sx={styles.toolbar}>
              
               
                <IconButton onClick={toggleDrawer}>
                  <CloseIcon />
                </IconButton>
              
            </Toolbar>
            }
            <List
              subheader={
                <ListSubheader>
                  <Typography mb={1} mt={2}>
                    Dashboard
                  </Typography>
                </ListSubheader>
              }
            >
              <ListItemButton
                onClick={() => navigate("/")}
                selected={isWorkspacesPage}
              >
                <ListItemIcon>
                  <FolderOpenIcon />
                </ListItemIcon>
                <ListItemText primary="Workspaces" />
                <ListItemSecondaryAction>
                  {isWorkspacesPage ? (
                    <IconButton edge="end" aria-label="arrow">
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  ) : null}
                </ListItemSecondaryAction>
              </ListItemButton>
              <ListItemButton
                onClick={() => navigate("/repositories")}
                selected={isRepositoriesPage}
              >
                <ListItemIcon>
                  <PublicIcon />
                </ListItemIcon>
                <ListItemText primary="Repositories" />
                <ListItemSecondaryAction>
                  {isRepositoriesPage ? (
                    <IconButton edge="end" aria-label="arrow">
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  ) : null}
                </ListItemSecondaryAction>
              </ListItemButton>
              
            </List>
            <List
              subheader={
                <ListSubheader>
                  <Typography mb={1} mt={4}>
                    Info & Support
                  </Typography>
                </ListSubheader>
              }
            >
            <ListItemButton
                
                component="a"
                href="https://www.opensourcebrain.org"
                target="_blank"
              >
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Main site" />
              </ListItemButton>

              <ListItemButton 
              onClick={handleAboutDialogOpen}>
                <ListItemIcon>
                  <InfoOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="About" />
              </ListItemButton>

              <ListItemButton
                
                component="a"
                href="https://docs.opensourcebrain.org/OSBv2/Guided_tour.html"
                target="_blank"
              >
                <ListItemIcon>
                  <TourIcon />
                </ListItemIcon>
                <ListItemText primary="Guided tour" />
              </ListItemButton>

              <ListItemButton
                
                component="a"
                href="https://docs.opensourcebrain.org/OSBv2/Overview.html"
                target="_blank"
              >
                <ListItemIcon>
                  <DescriptionOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Documentation" />
              </ListItemButton>
              <ListItemButton
                component="a"
                href="https://matrix.to/#/%23OpenSourceBrain_community:gitter.im?utm_source=gitter"
                target="_blank"
              >
                <ListItemIcon>
                  <HelpOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Chat" />
              </ListItemButton>
            </List>
          </Box>
          <Toolbar sx={styles.toolbar}>
            <Button
              id="create-new-workspace-repository"
              aria-controls={openDrawer ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openDrawer ? "true" : undefined}
              onClick={handleClickCreatMenu}
              sx={{
                width: "100%",
                textTransform: "none",
                borderRadius: 2,
                backgroundColor: linkColor,
                fontWeight: 600,
                fontSize: "0.857rem",
              }}
              variant="contained"
              endIcon={<ArrowDropDownIcon />}
            >
              Create new
            </Button>
            <Menu
              id="create-new-workspace-repository-menu"
              aria-labelledby="create-new-workspace-repository-menu"
              open={openCreatMenu}
              onClose={handleCloseCreatMenu}
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
              PaperProps={{
                sx: styles.createMenu,
              }}
            >
              <MenuItem onClick={() => handleOpenDialog("workspace")}>
                <FolderOpenIcon />
                Workspace
              </MenuItem>
              <MenuItem onClick={() => handleOpenDialog("repository")}>
                <PublicIcon />
                Repository
              </MenuItem>
            </Menu>
          </Toolbar>
        </Drawer>
      </Box>
      {openWorkspaceDialog && (
        <CreateWorkspaceDialog
          dialogOpen={openWorkspaceDialog}
          handleClose={() => handleCloseDialog("workspace")}
        />
      )}

      {openRepoDialog && (
        <EditRepoDialog
          dialogOpen={openRepoDialog}
          handleClose={() => handleCloseDialog("repository")}
          user={props.user}
          title="Add repository"
        />
      )}

      <OSBDialog
        title={
          openWorkspaceDialog ? "Create new workspace" : "Create new repository"
        }
        open={askLoginOpen}
        closeAction={closeAskLogin}
      >
        <NewWorkspaceAskUser
          type={openWorkspaceDialog ? "workspaces" : "repositories"}
        />
      </OSBDialog>
    </>
  );
};

export default MainDrawer;
