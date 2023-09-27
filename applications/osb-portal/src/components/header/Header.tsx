import * as React from "react";
import { useNavigate } from "react-router-dom";

import { Toolbar, Box, Button, Paper, Popper, MenuItem, MenuList, ClickAwayListener, Link, CircularProgress } from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import {BetaIcon, OSBLogo} from "../icons";

import {
  headerBg,
  secondaryColor
} from "../../theme";

const styles = ({
  toolbar: {
    backgroundColor: headerBg,
    justifyContent: "space-between",
    borderBottom: '1px solid #434343',
    minHeight: '2.5rem !important',
    height: '2.5rem !important',
    p: 0,

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
    height: '32px',
    overflow: 'hidden',
  },
  logoChip: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "2px",
    fontSize: "9px",
    px: "5px",
    py: "2px",
    mt: "4px",
    lineHeight: 1.4,
    fontWeight: 700,
  },
});

export const Header = (props: any) => {

  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuAnchorRef = React.useRef(null);
  const navigate = useNavigate();

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
    navigate(`/user/${user.username}`);
    setMenuOpen(false);
  };
  const handleAccountHelp = () => {
    window.open("https://docs.opensourcebrain.org/OSBv2/User_Accounts.html");
    setMenuOpen(false);
  };

  const headerText =
    user === undefined ? (
      <CircularProgress size={20} />
    ) : 
    (user === null ? (
      <Button sx={styles.button} onClick={handleUserLogin} className={`sign-in`}>
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
          sx={styles.button}
          className={`user-menu-btn`}
        >
          {user.username}
        </Button>
      </Box>
    ));

  const handleToggleDrawer = (e: any) => {
    if (props.drawerEnabled) {
      e.preventDefault();
      props.onToggleDrawer();
    }
  };

  // @ts-ignore
  return (
    <React.Fragment>
      <Toolbar sx={styles.toolbar}>
        <Box display="flex" sx={{height: "100%", overflow: "hidden", alignItems: "center"}}>
        <Link href="/" onClick={handleToggleDrawer}  sx={styles.logoContainer}>
          <OSBLogo sx={{mr: "0.4rem", fontSize: "12rem"}}  />
          
        </Link>
        <Box component="sup" sx={styles.logoChip}>v2.0</Box>
        </Box>
        <Box>
          {headerText}
        </Box>
      </Toolbar>
    </React.Fragment>
  );
};
