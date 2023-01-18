import * as React from 'react';
import PropTypes from 'prop-types';

//theme
import { styled } from '@mui/styles';

import {
    bgRegular as borderColor,
    paragraph,
    workspaceItemBg,
    orangeText,
} from '../../theme';

//components
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";

//icons
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
// import { AreaChartIcon, ViewInArIcon } from '../icons';

const SidebarBox = styled(Box)(({ theme }) => ({
    // height: 'calc(100%)',
    overflow: 'hidden',
    width: '100%',
    borderRight: `0.085rem solid ${borderColor}`
}));

const SidebarIconButton = styled(IconButton)(({ theme }) => ({
    padding: 0,
    '& .MuiSvgIcon-root': {
        color: paragraph,
    },
    '&:hover': {
        background: 'none'
    }
}))

const SidebarListItem = styled(ListItem)(({ theme }) => ({
    '&:hover': {
        "& .MuiListItemSecondaryAction-root .MuiIconButton-root": {
            visibility: 'inherit'
        }
    }
}))

const SidebarListItemButton = styled(ListItemButton)(({ theme }) => ({
    paddingLeft: "2.571rem",
    paddingTop: 0,
    paddingBottom: 0,
    '&:hover': {
        background: workspaceItemBg,
        '& .MuiTypography-root': {
            color: orangeText
        }
    },
}))

const SidebarListItemText = styled(ListItemText)(({ theme }) => ({
    '& .MuiTypography-root': {
        fontWeight: 400,
        fontSize: '0.75rem',
        paddingLeft: '0.286rem',
    }
}))

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const WorkspaceDetailsTabs = () => {

    const [tabValue, setTabValue] = React.useState(0);
    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };
    const handleTabChange = (e, newValue) => {
        setTabValue(newValue);
    }
    return (

        <SidebarBox>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} variant='fullWidth'>
                    <Tab label='Workspace' sx={{ pl: '0.75rem', pr: '0.75rem', fontSize: '0.75rem' }} />
                    <Tab label='User Assets' sx={{ pl: '0.75rem', pr: '0.75rem', fontSize: '0.75rem'}} />
                </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
                <ListItem component='div' disablePadding>
                    <ListItemButton>
                        <ListItemText
                            primary='Experiment shortcuts'
                            primaryTypographyProps={{
                                fontWeight: 600,
                                variant: 'body2',
                            }}
                        />
                        <Stack direction='row' spacing={1}>
                            <SidebarIconButton>
                                <InfoOutlinedIcon fontSize='small' />
                            </SidebarIconButton>
                            <SidebarIconButton>
                                <AddOutlinedIcon fontSize='small' />
                            </SidebarIconButton>
                        </Stack>
                    </ListItemButton>
                </ListItem>
                <ListItemButton onClick={handleClick}>
                    <SidebarIconButton>
                        {open ? <ExpandLess fontSize='small' /> : <ExpandMore fontSize='small' />}
                    </SidebarIconButton>
                    <ListItemText primary='Experiment Data' primaryTypographyProps={{
                        fontWeight: 600,
                        variant: 'body2',
                        pl: '0.286rem'
                    }} />
                </ListItemButton>
                {
                    open && [0, 1, 2, 3].map((item,index) => (
                        <SidebarListItem disablePadding key={index}
                            secondaryAction={
                                <SidebarIconButton edge='end' aria-label='delete' sx={{
                                    visibility: 'hidden',
                                }}>
                                    <DeleteOutlinedIcon fontSize='small' />
                                </SidebarIconButton>
                            }
                        >
                            <SidebarListItemButton key={item}>
                                <SidebarIconButton>
                                    {/* <AreaChartIcon fontSize='small' /> */}
                                </SidebarIconButton>
                                <SidebarListItemText primary={`Ferguson ${item}.nwb`} />
                            </SidebarListItemButton>
                        </SidebarListItem>
                    ))
                }
                <ListItemButton onClick={handleClick}>
                    <SidebarIconButton>
                        {open ? <ExpandLess fontSize='small'/> : <ExpandMore fontSize='small'/>}
                    </SidebarIconButton>
                    <ListItemText primary="Models" primaryTypographyProps={{
                        fontWeight: 600,
                        variant: 'body2',
                        pl: '0.286rem'
                    }} />
                </ListItemButton>
                {
                    open && [0, 1].map((item) => (
                        <SidebarListItem disablePadding sx={{
                            '&:hover': {
                                '& .MuiListItemSecondaryAction-root .MuiIconButton-root': {
                                    visibility: 'inherit'
                                }
                            }
                        }}
                            secondaryAction={
                                <SidebarIconButton edge='end' aria-label='delete' sx={{ visibility: 'hidden' }}>
                                    <DeleteOutlinedIcon fontSize='small' />
                                </SidebarIconButton>
                            }
                        >
                            <SidebarListItemButton key={item}>
                                <SidebarIconButton>
                                    {/* <ViewInArIcon fontSize='small' /> */}
                                </SidebarIconButton>
                                <SidebarListItemText primary='test.json' />
                            </SidebarListItemButton>
                        </SidebarListItem>
                    ))
                }
                <ListItemButton onClick={handleClick}>
                    <SidebarIconButton>
                        {open ? <ExpandLess fontSize='small' /> : <ExpandMore fontSize='small' />}
                    </SidebarIconButton>
                    <ListItemText primary='Notebooks' primaryTypographyProps={{
                        fontWeight: 600,
                        variant: 'body2',
                        pl: '0.286rem'
                    }} />
                </ListItemButton>
                {
                    open && [0, 1].map((item) => (
                        <SidebarListItem disablePadding
                            secondaryAction={
                                <SidebarIconButton edge='end' aria-label='delete' sx={{ visibility: 'hidden' }}>
                                    <DeleteOutlinedIcon fontSize='small' />
                                </SidebarIconButton>
                            }
                        >
                            <SidebarListItemButton key={item}>
                                <SidebarIconButton>
                                    <StickyNote2OutlinedIcon fontSize='small' />
                                </SidebarIconButton>
                                <SidebarListItemText primary='notebook-checkpoint.ipynb' />
                            </SidebarListItemButton>
                        </SidebarListItem>
                    ))
                }
            </TabPanel >
            <TabPanel value={tabValue} index={1}>
                Item Two
            </TabPanel>
        </SidebarBox>
    )
}
export default WorkspaceDetailsTabs;