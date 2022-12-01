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
import {
    ListItem,
    ListItemIcon,
    List,
    ListItemText,
    Toolbar,
    Drawer,
    Typography,
    IconButton,
    ListSubheader,
    Box,
    Button,
} from "@mui/material";

//icons
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import PublicIcon from '@mui/icons-material/Public'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

//types
import { UserInfo } from "../../types/user";
import clsx from "clsx";
import {useHistory} from "react-router-dom";

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
        justifyContent: 'space-between'
    },
    helloText: {
        fontWeight: 700,
        fontSize: '14px'
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
}));

export const MainDrawer = ({ user }: { user: UserInfo }) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const [open, setOpen] = React.useState(false);
    const history = useHistory();

    console.log(history)
    const text= user ? `Welcome back, ${user.firstName}` :  "Lets do some science!"

    const toggleDrawer = event => {
        if (
            event.type === "keydown" &&
            (event.key === "Tab" || event.key === "Shift")
        ) {
            return;
        }

        setOpen(!open);
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
                    <ListItem button component='a' href='/' selected={history.location.pathname === '/' || history.location.pathname.includes('workspaces')}>
                        <ListItemIcon>
                            <FolderOpenIcon />
                        </ListItemIcon>
                        <ListItemText primary='Workspaces' />
                    </ListItem>
                    <ListItem button component='a' href='/repositories' selected={history.location.pathname.includes('repositories')}>
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
                    <ListItem button>
                        <ListItemIcon>
                            <InfoOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary='Learn more about OSB' />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <DescriptionOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary='What’s new in OSB' />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <HelpOutlineOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary='Help Center' />
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
