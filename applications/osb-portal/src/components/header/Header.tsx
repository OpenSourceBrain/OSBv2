import * as React from "react";
import { useHistory } from "react-router-dom";

import { Toolbar, Box, Button, Paper, Popper, MenuItem, MenuList, ClickAwayListener } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import PersonIcon from "@mui/icons-material/Person";

import {
  headerBg,
  secondaryColor
} from "../../theme";

const title = "Open Source Brain";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    backgroundColor: headerBg,
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    justifyContent: "space-between",
    minHeight: '30px',
    height: '30px'
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: "space-between",
    overflowX: "auto",
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
  wrapIcon: {
    verticalAlign: "middle",
    display: "inline-flex",
  },
  button: {
    textTransform: "none",
    color: secondaryColor,
    padding: 0
  },
  logoChip: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    textTransform: "uppercase",
    fontSize: 9,
    padding: 3,
    lineHeight: "1em",
    marginTop: 3,
    fontWeight: 700,
    marginLeft: "1em",
    alignSelf: "flex-start",
  },
  logoContainer: {
    display: 'flex'
  }
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
                {/* <MenuItem>Settings</MenuItem> */}
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

  return (
    <React.Fragment>
      <Toolbar className={classes.toolbar}>
        <Box display="flex">
          <a href="/" onClick={handleToggleDrawer} className={classes.logoContainer}>
            <img
              src="/images/osb-logo-full.png"
              alt={title}
              title={title}
              height="20"
            />
          </a>
          <sup className={classes.logoChip}>beta</sup>
        </Box>
        <Box>
          {headerText}
        </Box>
      </Toolbar>
    </React.Fragment>
  );
};
