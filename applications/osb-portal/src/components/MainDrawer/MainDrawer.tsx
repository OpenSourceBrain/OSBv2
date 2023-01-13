import * as React from "react";
import { useHistory } from "react-router-dom";

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

const useStyles = makeStyles((theme) => ({
  drawerContent: {
    width: "100%",
  },
  root: {
    display: "flex",
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
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
  },
  drawer: {
    flexShrink: 0,
    whiteSpace: "nowrap",
    display: "flex",
  },
  drawerOpen: {
    top: "initial",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    top: "initial",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: "100%",
    "& .verticalFit": {
      display: "block",
    },
  },

  drawerPaper: {
    position: "static",
    flex: 1,
    display: "flex",
    bottom: 0,
    paddingTop: theme.spacing(1),
    justifyContent: "space-between",
    borderRight: `1px solid ${bgRegular}`,
    backgroundColor: bgDarkest,
  },
  createMenu: {
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
  },
}));

export const MainDrawer = (props: any) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = React.useState(false);
  const [openWorkspaceDialog, setOpenWorkspaceDialog] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [askLoginOpen, setAskLoginOpen] = React.useState(false);

  const openCreatMenu = Boolean(anchorEl);

  const history = useHistory();

  const isWorkspacesPage =
    history.location.pathname === "/" ||
    history.location.pathname.includes("workspaces");
  const isRepositoriesPage = history.location.pathname.includes("repositories");

  const text = props.user
    ? `Welcome back, ${props.user.username}`
    : "Lets do some science!";

  const handleOpenDialog = (type) => {
    if (!props.user) {
      setAskLoginOpen(true);
    } else {
      type === "workspace" ? setOpenWorkspaceDialog(true) : null;
      setAnchorEl(null);
    }
  };

  const handleCloseWorkspaceDialog = () => setOpenWorkspaceDialog(false);

  const handleClickCreatMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseCreatMenu = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = () => setOpen(!open);

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
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "0.857rem",
            }}
            variant="body2"
            color={secondaryColor}
          >
            {text}
          </Typography>
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
          open={open}
          className={clsx(classes.drawer, classes.root, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx(classes.drawerPaper, classes.root, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={`${open ? classes.drawerContent : ""} verticalFit`}>
            <Toolbar className={classes.toolbar}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "0.857rem",
                }}
                variant="body2"
                color={secondaryColor}
              >
                {text}
              </Typography>
              {!isMdUp ? (
                <IconButton onClick={toggleDrawer}>
                  <CloseIcon />
                </IconButton>
              ) : null}
            </Toolbar>
            <List
              subheader={
                <ListSubheader>
                  <Typography mb={1} mt={2}>
                    Dashboard
                  </Typography>
                </ListSubheader>
              }
            >
              <ListItem
                button
                onClick={() => history.push("/")}
                selected={isWorkspacesPage}
                secondaryAction={
                  isWorkspacesPage ? (
                    <IconButton edge="end" aria-label="arrow">
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  ) : null
                }
              >
                <ListItemIcon>
                  <FolderOpenIcon />
                </ListItemIcon>
                <ListItemText primary="Workspaces" />
              </ListItem>
              <ListItem
                button
                onClick={() => history.push("/repositories")}
                selected={isRepositoriesPage}
                secondaryAction={
                  isRepositoriesPage ? (
                    <IconButton edge="end" aria-label="arrow">
                      <KeyboardArrowRightIcon />
                    </IconButton>
                  ) : null
                }
              >
                <ListItemIcon>
                  <PublicIcon />
                </ListItemIcon>
                <ListItemText primary="Repositories" />
              </ListItem>
            </List>
            <List
              subheader={
                <ListSubheader>
                  <Typography mb={1} mt={4}>
                    Support
                  </Typography>
                </ListSubheader>
              }
            >
              <ListItem button onClick={handleAboutDialogOpen}>
                <ListItemIcon>
                  <InfoOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="About OSB" />
              </ListItem>
              <ListItem
                button
                component="a"
                href="https://docs.opensourcebrain.org/OSBv2/Overview.html"
                target="_blank"
              >
                <ListItemIcon>
                  <DescriptionOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Documentation" />
              </ListItem>
              <ListItem
                button
                component="a"
                href="https://matrix.to/#/%23OpenSourceBrain_community:gitter.im?utm_source=gitter"
                target="_blank"
              >
                <ListItemIcon>
                  <HelpOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Chat" />
              </ListItem>
            </List>
          </div>
          <Toolbar className={classes.toolbar}>
            <Button
              id="demo-positioned-button"
              aria-controls={open ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
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
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              open={openCreatMenu}
              onClose={handleCloseCreatMenu}
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
              PaperProps={{
                className: classes.createMenu,
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
      <CreateWorkspaceDialog
        dialogOpen={openWorkspaceDialog}
        handleClose={handleCloseWorkspaceDialog}
      />

      <OSBDialog
        title="Create new workspace"
        open={askLoginOpen}
        closeAction={closeAskLogin}
      >
        <NewWorkspaceAskUser />
      </OSBDialog>
    </>
  );
};

export default MainDrawer;
