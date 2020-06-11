import * as React from 'react';
import Keycloak from 'keycloak-js';

import { makeStyles } from '@material-ui/core/styles';
import { Toolbar, Box, Typography, Button, IconButton } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import SearchIcon from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import { MainMenu } from '../menu/MainMenu';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    backgroundColor: `${theme.palette.background.paper}`,
    borderBottom: `1px solid ${theme.palette.background.default}`
  },
  toolbarTitle: {
    flex: 1,
  },
  toolbarSecondary: {
    justifyContent: 'space-between',
    overflowX: 'auto',
  },
  toolbarLink: {
    padding: theme.spacing(1),
    flexShrink: 0,
  },
  wrapIcon: {
    verticalAlign: 'middle',
    display: 'inline-flex'
  },
  paper: {
    marginRight: theme.spacing(2)
  }
}));

export const Header = (props: any) => {
  const classes = useStyles();

  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuAnchorRef = React.useRef(null);

  const handleMenuToggle = () => {
    setMenuOpen((prevOpen) => !prevOpen);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const user = props.user;
  const keycloak = props.keycloak;

  const handleUserLogin = () => {
      keycloak.login();
    }
  const handleUserLogout = () => {
    keycloak.logout();
    props.onUserLogout();
  }
  const handleToggleDrawer = () => props.onToggleDrawer();

  const headerText = (user === null)
    ? <Button size="large" onClick={handleUserLogin}>Sign in</Button>
    : <Box alignItems="center" display="flex">
      <Popper open={Boolean(menuOpen)} anchorEl={menuAnchorRef.current}>
      <Paper>
      <ClickAwayListener onClickAway={handleMenuClose}>
      <MenuList autoFocusItem={menuOpen} id="user-menu">
        <MenuItem>My account</MenuItem>
        <MenuItem>Settings</MenuItem>
        <MenuItem onClick={handleUserLogout}>Logout</MenuItem>
      </MenuList>
      </ClickAwayListener>
      </Paper>
      </Popper>
      <Button
        size="large"
        ref={menuAnchorRef}
        aria-controls={menuOpen ? 'user-menu' : undefined}
        aria-haspopup="true"
        onClick={handleMenuToggle}
        startIcon={<PersonIcon fontSize="large"/>}
      >
        {user.firstName}
      </Button>
      </Box>

  const title = "Open Source Brain"

  return (
    <React.Fragment>
      <Toolbar className={classes.toolbar}>
        <IconButton onClick={handleToggleDrawer}>
          <img src="./images/osb-logo.png" alt={title} height="25" width="25" />
        </IconButton>
        <Typography
          component="h2"
          variant="h5"
          color="inherit"
          align="left"
          noWrap={true}
          className={classes.toolbarTitle}
        >
          {title}
        </Typography>
        <IconButton>
          <SearchIcon />
        </IconButton>
        {headerText}
      </Toolbar>
      <MainMenu />
    </React.Fragment>
  )
}
