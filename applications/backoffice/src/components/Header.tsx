import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Paper,
  Popper,
  MenuItem,
  MenuList,
  ClickAwayListener,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

import { initUser, login, logout } from "../service/UserService";

const styles = {
  toolbar: {
    justifyContent: "space-between",
    minHeight: "3rem !important",
  },
  button: {
    textTransform: "none" as const,
    color: "inherit",
  },
};

export const Header = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuAnchorRef = React.useRef(null);

  // The gatekeeper writes the kc-access cookie on every request, so reading the
  // user synchronously from the token is enough here (no store needed).
  const user = initUser();

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);
  const handleMenuClose = () => setMenuOpen(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
  };

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar sx={styles.toolbar}>
        <Typography variant="h6" noWrap={true}>
          OSB Backoffice
        </Typography>

        {!user?.username ? (
          <Button sx={styles.button} onClick={() => login()} className="sign-in">
            Sign in
          </Button>
        ) : (
          <Box alignItems="center" display="flex">
            <Popper open={Boolean(menuOpen)} anchorEl={menuAnchorRef.current} placement="bottom-end">
              <Paper>
                <ClickAwayListener onClickAway={handleMenuClose}>
                  <MenuList autoFocusItem={menuOpen} className="user-menu">
                    <MenuItem className="logout-menu-item" onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Popper>
            <Button
              ref={menuAnchorRef}
              aria-controls={menuOpen ? "user-menu" : undefined}
              aria-haspopup="true"
              onClick={handleMenuToggle}
              startIcon={<PersonIcon />}
              sx={styles.button}
              className="user-menu-btn"
            >
              {user.username}
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
