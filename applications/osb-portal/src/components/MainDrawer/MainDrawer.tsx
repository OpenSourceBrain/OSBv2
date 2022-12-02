import * as React from "react";
//theme
import {makeStyles, useTheme} from '@mui/styles';

import {
    bgRegular,
    bgDarkest,
    secondaryColor,
    drawerText,
    linkColor,
    selectedMenuItemBg,
    primaryColor
} from "../../theme";

//hooks
import useMediaQuery from '@mui/material/useMediaQuery';

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

//icons
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PublicIcon from '@mui/icons-material/Public'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

//types
import { UserInfo } from "../../types/user";
import clsx from "clsx";
import {useHistory} from "react-router-dom";
import {AboutDialog} from "../index";

const useStyles = makeStyles(theme => ({
    drawerContent: {
        width: '100%'
    },
    root: {
        display: "flex",
        '& .MuiListSubheader-root' : {
            backgroundColor: 'transparent',
            '& .MuiTypography-root': {
                textTransform: 'uppercase',
                fontWeight: 600,
                fontSize: '0.714rem'
            },
        },
        '& .MuiList-root': {
            '& .Mui-selected': {
                background: selectedMenuItemBg,
                borderLeft: `2px solid ${primaryColor}`
            },
            '& .MuiButtonBase-root': {
                '& .MuiListItemIcon-root' :{
                    minWidth: 'auto',
                    marginRight: '0.875rem',

                    '& .MuiSvgIcon-root' : {
                        fontSize: '1rem',
                        color: drawerText,
                    }
                } ,
                '& .MuiListItemText-root' :{
                    '& .MuiTypography-root' : {
                        fontSize: '0.857rem',
                        color: drawerText,
                        fontWeight: 500,
                    }
                },
                '& .MuiListItemSecondaryAction-root' :{
                    '& .MuiButtonBase-root': {
                        fontSize: '1rem',
                        color: drawerText,
                    }
                }
            }
        }
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up("md")]: {
            display: "none"
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px'
    },
    helloText: {
        fontWeight: 700,
        fontSize: '14px',
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
        backgroundColor: bgDarkest
    },
}));

export const MainDrawer = (props: any) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const [open, setOpen] = React.useState(false);
    const history = useHistory();

    const isWorkspacesPage = history.location.pathname === '/' || history.location.pathname.includes('workspaces')
    const isRepositoriesPage = history.location.pathname.includes('repositories')

    const text= props.user ? `Welcome back, ${props.user.username}` :  "Lets do some science!"

    const toggleDrawer = () => setOpen(!open);

    const handleDialogOpen = () => {
        props.openDialog();
    };

    return (
        <>
        {
        isMdUp ? null :
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
            <Typography className={classes.helloText} variant="body2" color={secondaryColor}>
                {text}
            </Typography>
         </Toolbar>
        }
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
                    <Typography className={classes.helloText} variant="body2" color={secondaryColor}>
                        {text}
                    </Typography>
                    {
                        !isMdUp ?
                        <IconButton onClick={toggleDrawer}>
                            <CloseIcon />
                        </IconButton> : null
                    }
                </Toolbar>
                <List subheader={
                    <ListSubheader>
                        <Typography mb={1} mt={2}>Dashboard</Typography>
                    </ListSubheader>}>
                    <ListItem
                        button
                        onClick={() => history.push('/')}
                        selected={isWorkspacesPage}
                        secondaryAction={
                            isWorkspacesPage ?
                                <IconButton edge="end" aria-label="arrow">
                                    <KeyboardArrowRightIcon />
                                </IconButton> : null
                        }
                    >
                        <ListItemIcon>
                            <FolderOpenIcon />
                        </ListItemIcon>
                        <ListItemText primary='Workspaces' />
                    </ListItem>
                    <ListItem
                        button
                        onClick={() => history.push('/repositories')}
                        selected={isRepositoriesPage}
                        secondaryAction={
                            isRepositoriesPage ?
                            <IconButton edge="end" aria-label="arrow">
                                <KeyboardArrowRightIcon />
                            </IconButton> : null
                        }
                    >
                        <ListItemIcon>
                            <PublicIcon />
                        </ListItemIcon>
                        <ListItemText primary='Repositories' />
                    </ListItem>
                </List>
                <List subheader={
                    <ListSubheader>
                        <Typography mb={1} mt={4}>Support</Typography>
                    </ListSubheader>}>
                    <ListItem button onClick={handleDialogOpen}>
                        <ListItemIcon>
                            <InfoOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary='About OSB' />
                    </ListItem>
                    <ListItem button component='a' href='https://docs.opensourcebrain.org/OSBv2/Overview.html' target='_blank'>
                        <ListItemIcon>
                            <DescriptionOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary='Documentation' />
                    </ListItem>
                    <ListItem button component='a' href='https://matrix.to/#/%23OpenSourceBrain_community:gitter.im?utm_source=gitter' target='_blank'>
                        <ListItemIcon>
                            <HelpOutlineOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary='Chat' />
                    </ListItem>
                </List>
            </div>
            <Toolbar className={classes.toolbar}>
                <Button
                  sx={{
                    width: '100%',
                    textTransform: 'none',
                    borderRadius: 2,
                    backgroundColor: linkColor,
                    fontWeight: 600,
                    fontSize: '0.857rem'
                  }}
                 variant="contained" endIcon={<ArrowDropDownIcon />}>Create new</Button>
            </Toolbar>
        </Drawer>
        </Box>
    </>
    );
};

export default MainDrawer
