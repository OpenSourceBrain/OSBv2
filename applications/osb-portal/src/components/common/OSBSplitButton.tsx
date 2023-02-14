import React, { useState, useRef, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import { OSBApplication, OSBApplications } from "../../types/workspace";
import { styled } from "@mui/styles";

interface OSBSplitButtonProps {
  defaultSelected: OSBApplication;
  handleClick: (selectedItem: OSBApplication) => void;
}

const StyledButtonGroup = styled(ButtonGroup)(()=>({
  borderRadius: '6px',
  border: `1px solid #000`,
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  '& .MuiButton-root': {
    textTransform: 'none'
  },
  '& .MuiButtonGroup-grouped:not(:last-of-type)': {
    borderColor: 'none',
    borderRight: '1px solid rgba(0, 0, 0, 0.2)'
  },
}))

export const OSBSplitButton = (props: OSBSplitButtonProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(
    props.defaultSelected ?? OSBApplications.jupyter
  );
  const anchorRef = useRef(null);

  useEffect(() => {
    props.defaultSelected && setSelected(props.defaultSelected);
  }, [props.defaultSelected]);

  const options = Object.values(OSBApplications);

  const handleItemClick = () => {
    props.handleClick(OSBApplications[selected.code]);
  };

  const handleMenuItemClick = (app: OSBApplication) => {
    setSelected(app);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: any) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <Grid direction="column" alignItems="center">
      <Grid item={true} xs={12}>
        <StyledButtonGroup
          variant="contained"
          color="primary"
          ref={anchorRef}
          aria-label="split button"
        >
          <Button className={`open-workspace`} onClick={handleItemClick}>Open with {selected.name}</Button>
          <Button
            color="primary"
            aria-controls={open ? "split-button-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            className="split-button-control"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </StyledButtonGroup>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition={true}
          disablePortal={true}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {options.map((option: OSBApplication, index: number) => (
                      <MenuItem
                        key={option.subdomain}
                        selected={option === selected}
                        onClick={() => {
                          handleMenuItemClick(option);
                        }}
                      >
                        Open with {option.name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
};
