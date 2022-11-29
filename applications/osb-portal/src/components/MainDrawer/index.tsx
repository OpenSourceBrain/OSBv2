import * as React from "react";
//theme
import {makeStyles, useTheme} from '@mui/styles';

import {
    bgRegular,
    bgDarkest,
    secondaryColor
} from "../../theme";

//hooks
import useMediaQuery from '@mui/material/useMediaQuery';

//components
import {
    ListItem,
    ListItemIcon,
    List,
    Divider,
    ListItemText,
    Toolbar,
    Drawer,
    Typography,
    IconButton,
    ListSubheader,
    Avatar
} from "@mui/material";

//icons
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import EmailIcon from "@mui/icons-material/Email";
import MenuIcon from '@mui/icons-material/Menu';
import icons from '../../assets/icons'
const {Test} = icons

//types
import { UserInfo } from "../../types/user";

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        '& .MuiDrawer-paper' : {
            top: 'initial',
            width: '15rem',
            borderRight: `1px solid ${bgRegular}`,
            backgroundColor: bgDarkest
        },
        '& .MuiListSubheader-root' : {
            backgroundColor: 'transparent',
            '& .MuiTypography-root': {
                textTransform: 'uppercase',
                fontWeight: 600,
                fontSize: '12px'
            },
        },
        '& .MuiList-root': {
            '& .MuiButtonBase-root': {
                '& .MuiListItemIcon-root' :{
                    width: 'auto',
                    marginRight: '0.875rem',

                    '& .MuiSvgIcon-root' : {
                        fontSize: '14px'
                    }
                } ,
                '& .MuiListItemText-root' :{
                    '& .MuiTypography-root' : {
                        fontSize: '14px'
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
        ...theme.mixins.toolbar,
        [theme.breakpoints.down("sm")]: {
            display: "none"
        }
    },
    helloText: {
        fontWeight: 700,
        fontSize: '14px'
    },
}));

export const MainDrawer = ({ user }: { user: UserInfo }) => {
    const classes = useStyles();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
    const [open, setOpen] = React.useState(false);

    const text= user ? `Welcome back ${user.firstName}` :  "Lets do some science!"

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
        <Drawer
            variant={isMdUp ? "permanent" : "temporary"}
            anchor="left"
            open={open}
            onClose={toggleDrawer}
            className={classes.root}
        >
            <Toolbar>
                <Typography className={classes.helloText} variant="body2" color={secondaryColor}>
                 {text}
                </Typography>
            </Toolbar>
            <List subheader={
                <ListSubheader>
                 <Typography mb={1}  component="p" variant="h5">Dashboard</Typography>
                </ListSubheader>}>
                <ListItem button component='a' href='/'>
                    <ListItemIcon>
                        <Avatar src={Test} variant={"square"} />
                    </ListItemIcon>
                    <ListItemText primary='Workspaces' />
                </ListItem>
                <ListItem button component='a' href='/repositories'>
                    <ListItemIcon>
                        <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary='Repositories' />
                </ListItem>
            </List>
            <List subheader={
                <ListSubheader>
                    <Typography mb={1}  component="p" variant="h5">Support</Typography>
                </ListSubheader>}>
                <ListItem button>
                    <ListItemIcon>
                        <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary='Learn more about OSB' />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary='What’s new in OSB' />
                </ListItem>
                <ListItem button>
                    <ListItemIcon>
                        <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary='Help Center' />
                </ListItem>
            </List>
        </Drawer>
    </>
    );
};

export default MainDrawer
