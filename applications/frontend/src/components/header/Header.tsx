import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';


import { makeStyles } from '@material-ui/core/styles';
import { Toolbar, Box, Typography, Button, IconButton } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import SearchIcon from '@material-ui/icons/Search';

import { toggleDrawer } from '../../store/reducers/drawer';
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
  }
}));

export const Header = (props: any) => {
  const classes = useStyles();

  const user = props.user;

  const handleUserLogin = () => props.onUserLogin({
      id: 1,
      firstName: 'Zoran',
      lastName: 'Sinnema',
      emailAddress: "zsinnema@gmail.com"
    });
  const handleUserLogout = () => props.onUserLogout();
  const handleToggleDrawer = () => props.onToggleDrawer();

  const headerText = (user === null)
    ? <Button size="large" onClick={handleUserLogin}>Sign in</Button>
    : <Box alignItems="center" display="flex">
      <Box>
        <PersonIcon fontSize="large" onClick={handleUserLogout} />
      </Box>
      <Box>
        <h4>{user.firstName}</h4>
      </Box>
    </Box>

  const title = "open source brain"

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
