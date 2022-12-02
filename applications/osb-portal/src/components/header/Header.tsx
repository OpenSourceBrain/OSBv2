import * as React from "react";
import { useHistory } from "react-router-dom";

import { Toolbar, Box, Button, Paper, Popper, MenuItem, MenuList, ClickAwayListener } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import PersonIcon from "@mui/icons-material/Person";
import {BetaIcon, OSBLogo} from "../icons";

import {
  headerBg,
  secondaryColor
} from "../../theme";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    backgroundColor: headerBg,
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    justifyContent: "space-between",
    minHeight: '1.8rem',
    height: '1.8rem'
  },
  button: {
    textTransform: "none",
    color: secondaryColor,
    padding: 0
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'start',
    alignItems: 'center',

    '& .MuiSvgIcon-root': {
      fontSize: '10.5rem'
    }
  },
}));

export const Header = (props: any) => {
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuAnchorRef = React.useRef(null);
  const history = useHistory();

  const handleMenuToggle = () => {
    setMenuOpen((prevOpen) => !prevOpen);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const user = props.user;

  const handleUserLogin = () => {
    props.login();
  };
  const handleUserLogout = () => {
    props.logout();
  };

  const handleMyAccount = () => {
    history.push(`/user/${user.id}`);
    setMenuOpen(false);
  };
  const handleAccountHelp = () => {
    window.open("https://docs.opensourcebrain.org/OSBv2/User_Accounts.html");
    setMenuOpen(false);
  };

  const headerText =
    user === null ? (
      <Button onClick={handleUserLogin} className={`sign-in ${classes.button}`}>
        Sign in
      </Button>
    ) : (
      <Box alignItems="center" display="flex">
        <Popper open={Boolean(menuOpen)} anchorEl={menuAnchorRef.current}>
          <Paper>
            <ClickAwayListener onClickAway={handleMenuClose}>
              <MenuList autoFocusItem={menuOpen} className="user-menu">
                {
                  <MenuItem
                    className="my-account-menu-item"
                    onClick={handleMyAccount}
                  >
                    My account
                  </MenuItem>
                }
                {
                  <MenuItem
                    className="account-help-menu-item"
                    onClick={handleAccountHelp}
                  >
                    Account help
                  </MenuItem>
                }
                <MenuItem
                  className="logout-menu-item"
                  onClick={handleUserLogout}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>
        <Button
          size="large"
          ref={menuAnchorRef}
          aria-controls={menuOpen ? "user-menu" : undefined}
          aria-haspopup="true"
          onClick={handleMenuToggle}
          startIcon={<PersonIcon fontSize="large" />}
          className={`${classes.button} user-menu-btn`}
        >
          {user.username}
        </Button>
      </Box>
    );

  const handleToggleDrawer = (e: any) => {
    if (props.drawerEnabled) {
      e.preventDefault();
      props.onToggleDrawer();
    }
  };

  // @ts-ignore
  return (
    <React.Fragment>
      <Toolbar className={classes.toolbar}>
        <a href="/" onClick={handleToggleDrawer}  className={classes.logoContainer}>
          <OSBLogo />
          <BetaIcon />
        </a>
        <Box>
          {headerText}
        </Box>
      </Toolbar>
    </React.Fragment>
  );
};
