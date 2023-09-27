import * as React from "react";
import makeStyles from '@mui/styles/makeStyles';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import CheckIcon from "@mui/icons-material/Check";

const useStyles = makeStyles((theme) => ({
  popper: {
    zIndex: 10000,
  },
  checkIcon: {
    paddingRight: theme.spacing(1),
    marginLeft: "-1em",
  },
}));

export interface MenuItem {
  label: string;
  callback: (e: any) => void;
  checked?: boolean;
}

export type MenuItemProps = {
  title: string | React.ReactNode;
  className: string;
  items: MenuItem[];
  popperPlacement?: any;
};

export const MainMenuItem = (props: MenuItemProps) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((newPrevOpen) => !newPrevOpen);
  };

  const handleClose = (event: { target: any }) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: {
    key: string;
    preventDefault: () => void;
  }) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <Box display="flex" p={0} bgcolor="background.paper">
      <Box>
        <Button
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          className={props.className}
        >
          {props.title}
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          transition={true}
          disablePortal={true}
          className={classes.popper}
          placement={
            typeof props.popperPlacement === "undefined"
              ? "bottom-start"
              : props.popperPlacement
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow {...TransitionProps}>
              <Paper square={true}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    {props.items.map((item) => (
                      <MenuItem
                        key={item.label}
                        onClick={(e) => {
                          item.callback(e);
                          handleClose(e);
                        }}
                      >
                        {item.checked !== undefined && (
                          <CheckIcon
                            className={classes.checkIcon}
                            color={item.checked ? "primary" : "disabled"}
                          />
                        )}
                        {item.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    </Box>
  );
};
