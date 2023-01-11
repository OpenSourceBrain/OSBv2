import * as React from "react";

//theme
import { styled } from "@mui/styles";
import { bgLightest as lineColor, paragraph, secondaryColor as white, linkColor, chipBg, headerBg as hoverBg } from "../theme";

//components
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ButtonGroup from "@mui/material/ButtonGroup";
import Popper from "@mui/material/Popper";
import Paper from "@mui/material/Paper";
import Grow from "@mui/material/Grow";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Divider from '@mui/material/Divider';
import { HomePageSider } from "../components";
import WorkspaceDetails from "../components/workspace/WorkspaceDetailsTabs";
import WorkspaceDetailsInfo from "../components/workspace/WorkspaceDetailsInfo";

//icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const options = ["Open with Github", "Open with NWB Explorer", "Open with JupyterLab"];

const GoBackButton = styled(Button)(({ theme }) => ({
    color: paragraph,
    fontSize: '0.857rem',
    textTransform: 'none',
    "&:hover": {
        backgroundColor: 'transparent'
    }
}))

const EditButton = styled(Button)(({ theme }) => ({
    color: white,
    fontSize: '0.875rem',
    textTransform: 'none',
    borderRadius: '6px',
    border: `1px solid ${white}`,
    "&:hover": {
        border: `1px solid ${white}`,
        backgroundColor: 'transparent'
    }
}))

const OpenWithButtonGroup = styled(ButtonGroup)(({ theme }) => ({
    background: linkColor,
    border: `1px solid #000`,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: '6px',
    "& .MuiButton-root": {
        textTransform: 'none'
    }
}))

const ThreeDotButton = styled(Button)(({ theme }) => ({
    background: chipBg,
    minWidth: '32px',
    borderRadius: '6px',
    boxShadow: 'none',
    "&:hover": {
        background: 'transparent'
    }
}))

const WorkspacePage = () => {

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };
    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setOpen(false);
    };
    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    return (
        <>
            <Box className="verticalFit">
                <Grid container className="verticalFill">
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={3}
                        lg={2}
                        direction="column"
                        className="verticalFill"
                    >
                        <Box width={1} className="verticalFit">
                            <HomePageSider />
                        </Box>
                    </Grid>
                    <Grid
                        item={true}
                        xs={12}
                        sm={12}
                        md={9}
                        lg={10}
                        alignItems="stretch"
                        className="verticalFill"
                    >
                        <Box width={1} className="verticalFit">
                            <div id="workspace-details" className="verticalFit">
                                <Box borderBottom={`2px solid ${lineColor}`}>
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ padding: '8px 16px' }}
                                    >
                                        <GoBackButton variant="text" startIcon={<ChevronLeftIcon />}>All workspaces</GoBackButton>
                                        <Stack display="flex" direction="row" spacing={2}>
                                            <EditButton variant="outlined">Edit</EditButton>
                                            <OpenWithButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                                                <Button>{options[selectedIndex]}</Button>
                                                <Button
                                                    size="small"
                                                    aria-controls={open ? 'split-button-menu' : undefined}
                                                    aria-expanded={open ? 'true' : undefined}
                                                    aria-label="select merge strategy"
                                                    aria-haspopup="menu"
                                                    onClick={handleToggle}
                                                >
                                                    <KeyboardArrowDownIcon />
                                                </Button>
                                            </OpenWithButtonGroup>
                                            <Popper
                                                sx={{
                                                    zIndex: 1,
                                                }}
                                                open={open}
                                                anchorEl={anchorRef.current}
                                                role={undefined}
                                                transition
                                                disablePortal
                                            >
                                                {({ TransitionProps, placement }) => (
                                                    <Grow
                                                        {...TransitionProps}
                                                        style={{
                                                            transformOrigin:
                                                                placement === 'bottom' ? 'center top' : 'center bottom',
                                                        }}
                                                    >
                                                        <Paper>
                                                            <ClickAwayListener onClickAway={handleClose}>
                                                                <MenuList id="split-button-menu" autoFocusItem>
                                                                    {options.map((option, index) => (
                                                                        <MenuItem
                                                                            key={option}
                                                                            disabled={index === 2}
                                                                            selected={index === selectedIndex}
                                                                            onClick={(event) => handleMenuItemClick(event, index)}
                                                                        >
                                                                            {option}
                                                                        </MenuItem>
                                                                    ))}
                                                                </MenuList>
                                                            </ClickAwayListener>
                                                        </Paper>
                                                    </Grow>
                                                )}
                                            </Popper>
                                            <ThreeDotButton
                                                size="small"
                                                variant="contained"
                                                aria-label="more"
                                                id="threeDot-button"
                                            >
                                                <MoreVertIcon />
                                            </ThreeDotButton>

                                        </Stack>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '160px' }}>
                                    <LockOutlinedIcon />
                                    <Typography sx={{ fontSize: '1.714rem', ml: '1.143rem' }} >My Workspace</Typography>
                                </Box>
                                <Box className="verticalFit">
                                    <Grid container sx={{ height: 'calc(100%)', overflow: 'hidden', background: 'rgba(0, 0, 0, 0.25)'}}>
                                        <Grid item xs>
                                            <WorkspaceDetails />
                                        </Grid>
                                        <Grid item xs={7}>
                                            <Box sx={{ display: 'flex',flexDirection:"column", alignItems: 'center', justifyContent: 'center', height: 'calc(100%)', overflow: 'hidden' }}>
                                                <img src="/images/workspace-banner.png" alt="workspace img" />
                                                <Divider />
                                                <Typography>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                                    Maecenas vestibulum id tellus nec facilisis.
                                                    Nullam at feugiat diam. Vestibulum molestie lacinia dignissim.
                                                    Sed euismod augue magna. Morbi posuere vulputate viverra.
                                                    Proin nec risus quis nunc mollis fringilla quis sit amet ante.
                                                    Aliquam ut nibh consectetur, imperdiet mi et, euismod mi.
                                                    Vestibulum tristique vel arcu a facilisis.
                                                    Maecenas tristique felis et nunc elementum aliquam.
                                                    Etiam dictum nunc vel eros consectetur tincidunt.
                                                    Maecenas sed consequat metus.
                                                    Sed euismod augue magna.
                                                    Morbi posuere vulputate viverra.
                                                    Proin nec risus quis nunc mollis fringilla quis sit amet ante.
                                                    Aliquam ut nibh consectetur, imperdiet mi et, euismod mi.
                                                    Vestibulum tristique vel arcu a facilisis.
                                                    Maecenas tristique felis et nunc elementum aliquam.
                                                    Etiam dictum nunc vel eros consectetur tincidunt.
                                                    Maecenas sed consequat metus.
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid item xs>
                                            <WorkspaceDetailsInfo/>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </div>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default WorkspacePage;