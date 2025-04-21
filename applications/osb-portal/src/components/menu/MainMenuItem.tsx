import * as React from "react";
import { useTheme } from '@mui/material/styles';
import { SxProps, Theme } from '@mui/material';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import CheckIcon from "@mui/icons-material/Check";


export interface MenuItem {
  label: string;
  callback: (e: any) => void;
  checked?: boolean;
}

export type MenuItemProps = {
  title: string | React.ReactNode;
  className?: string;
  items: MenuItem[];
  popperPlacement?: any;
  sx: SxProps<Theme>;
};

export const MainMenuItem = (props: MenuItemProps) => {
  const theme = useTheme()

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
          sx={props.sx}
        >
          {props.title}
        </Button>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          transition={true}
          disablePortal={true}
          placement={
            typeof props.popperPlacement === "undefined"
              ? "bottom-start"
              : props.popperPlacement
          }
          sx={{
            zIndex: 10000
          }}
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
                            color={item.checked ? "primary" : "disabled"}
                            sx={{
                              paddingRight: theme.spacing(1),
                              marginLeft: "-1em",
                            }}
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
