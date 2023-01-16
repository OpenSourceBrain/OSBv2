import * as React from 'react';
import { useParams, useHistory } from 'react-router-dom';

//theme
import { styled } from '@mui/styles';
import { bgLightest as lineColor, paragraph, secondaryColor as white, linkColor, chipBg, headerBg as hoverBg, bgDarkest } from '../../theme';

//components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import ButtonGroup from '@mui/material/ButtonGroup';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import Grow from '@mui/material/Grow';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { canEditWorkspace } from "../../service/UserService";
import { WorkspaceEditor } from '..';

//types
import {
    Workspace,
    WorkspaceResource,
    OSBApplications,
    OSBApplication,
} from "../../types/workspace";

//icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const options = ["Open with Github", "Open with NWB Explorer", "Open with JupyterLab"];

const GoBackButton = styled(Button)(({ theme }) => ({
    color: paragraph,
    fontSize: '0.857rem',
    textTransform: 'none',
    "&:hover": {
        backgroundColor: 'transparent'
    }
}));

const EditButton = styled(Button)(({ theme }) => ({
    color: white,
    fontSize: '0.875rem',
    textTransform: 'none',
    borderRadius: '6px',
    border: `1px solid ${white}`,
    '&:hover': {
        border: `1px solid ${white}`,
        backgroundColor: 'transparent'
    }
}));

const OpenWithButtonGroup = styled(ButtonGroup)(({ theme }) => ({
    background: linkColor,
    border: `1px solid #000`,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: '6px',
    marginRight: '10px',
    '& .MuiButton-root': {
        textTransform: 'none'
    },
    '& .MuiButtonGroup-grouped:not(:last-of-type)': {
        borderColor: 'none',
        borderRight: '1px solid rgba(0, 0, 0, 0.2)'
    },
}));

const ThreeDotButton = styled(Button)(({ theme }) => ({
    background: chipBg,
    minWidth: '32px',
    borderRadius: '6px',
    boxShadow: 'none',
    '&:hover': {
        background: 'transparent'
    },
}));

const WorkspaceNavbar = (props: any) => {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [editWorkspaceOpen, setEditWorkspaceOpen] = React.useState(false);

    const history = useHistory();
    const workspace: Workspace = props.workspace;
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const user = props.user;
    const canEdit = canEditWorkspace(props.user, workspace);

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
    const handleCloseEditWorkspace = () => {
        props.refreshWorkspace(workspaceId);
        setEditWorkspaceOpen(false);
    };

    return (
        <Grid
            display='flex'
            container
            alignItems="center"
            className="verticalFill"
            sx={{ padding: '8px 16px', background: bgDarkest }}
        >
            <Grid
                item
                xs={12}
                sm={12}
                md={7}
                lg={7}
            >
                <GoBackButton variant="text" startIcon={<ChevronLeftIcon />} onClick={() => history.push('/')}>All workspaces</GoBackButton>
            </Grid>
            <Grid
                item
                xs={12}
                sm={8}
                md={5}
                lg={5}
                spacing={2}
                justifyContent='end'
            >
                {
                    canEdit && (
                        <EditButton
                            variant="outlined"
                            onClick={() => setEditWorkspaceOpen(true)}
                        >
                            Edit
                        </EditButton>
                    )
                }
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
                        <KeyboardArrowDownIcon fontSize='small' />
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
                    <MoreVertIcon fontSize='small' />
                </ThreeDotButton>
            </Grid>
            {canEdit && editWorkspaceOpen && (
                <WorkspaceEditor
                    open={editWorkspaceOpen}
                    title={"Edit workspace: " + workspace.name}
                    closeHandler={handleCloseEditWorkspace}
                    workspace={workspace}
                    onLoadWorkspace={handleCloseEditWorkspace}
                    user={user}
                />
            )}
        </Grid>
    )
}

export default WorkspaceNavbar;