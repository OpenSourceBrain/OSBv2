import * as React from "react";
import { useHistory } from "react-router-dom";

import {
  Toolbar,
  Box,
  Button,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  ClickAwayListener,
  makeStyles,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";

const title = "Open Source Brain";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    backgroundColor: theme.palette.background.paper,
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    justifyContent: "space-between",
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
  },
  logoChip: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    textTransform: 'uppercase',
    fontSize: 9,
    padding: 3,
    lineHeight: '1em',
    marginTop: 3,
    fontWeight: 700,
    marginLeft: '1em',
    alignSelf: 'flex-start'


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
  }
  const handleAccountHelp = () => {
    window.open("https://docs.opensourcebrain.org/OSBv2/User_Accounts.html")
    setMenuOpen(false);
  }

  const headerText =
    user === null ? (
      <Button onClick={handleUserLogin} className={classes.button}>
        Sign in
      </Button>
    ) : (
      <Box alignItems="center" display="flex">
        <Popper open={Boolean(menuOpen)} anchorEl={menuAnchorRef.current}>
          <Paper>
            <ClickAwayListener onClickAway={handleMenuClose}>
              <MenuList autoFocusItem={menuOpen} id="user-menu">
                {<MenuItem onClick={handleMyAccount}>My account</MenuItem>}
                {<MenuItem onClick={handleAccountHelp}>Account help</MenuItem>}
                {/* <MenuItem>Settings</MenuItem> */}
                <MenuItem onClick={handleUserLogout}>Logout</MenuItem>
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
          className={classes.button}
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
          <a href="/" onClick={handleToggleDrawer}>
            <img
              src="/images/osb-logo-full.png"
              alt={title}
              title={title}
              height="25"
            />

          </a>
          <sup className={classes.logoChip} >beta</sup>
        </Box>
        <Box>
          {/* <IconButton>
              <SearchIcon />
            </IconButton> */}
          {headerText}
        </Box>
      </Toolbar>
    </React.Fragment>
  );
};
