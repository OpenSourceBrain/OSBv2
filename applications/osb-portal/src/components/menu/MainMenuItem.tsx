import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

const useStyles = makeStyles((theme) => ({
  popper: {
    zIndex: 10000,
  }
}));

export interface MenuItem {
  label: string;
  callback: (e: any) => void;
}

export type MenuItemProps = {
  title: string | React.ReactNode,
  className: string,
  items: MenuItem[],
  popperPlacement?: any,
}


export const MainMenuItem = (props: MenuItemProps) => {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((newPrevOpen) => !newPrevOpen);
  };

  const handleClose = (event: { target: any; }) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: { key: string; preventDefault: () => void; }) {
    if (event.key === 'Tab') {
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
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          className={props.className}
        >
          {props.title}
        </Button>
        <Popper open={open} anchorEl={anchorRef.current} transition={true} disablePortal={true} className={classes.popper} placement={typeof props.popperPlacement === "undefined" ? "bottom-start" : props.popperPlacement}>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
            >
              <Paper square={true}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    {
                      props.items.map(item =>
                        <MenuItem
                          key={item.label}
                          onClick={
                            (e) => {
                              item.callback(e);
                              handleClose(e);
                            }
                          }
                        >
                          {item.label}
                        </MenuItem>
                      )
                    }

                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    </Box>
  )
}