import * as React from 'react';
import PropTypes from 'prop-types';

//theme
import { styled } from '@mui/styles';

import {
    bgRegular,
    bgDarkest,
    secondaryColor,
    drawerText,
    linkColor,
    selectedMenuItemBg,
    primaryColor
} from "../../theme";

//components
import Drawer from "@mui/material/Drawer";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import ListSubheader from "@mui/material/ListSubheader";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

//icons


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const WorkspaceDetailsInfo = () => {

    const [tabValue, setTabValue] = React.useState(0);
    const handleTabChange = (e, newValue) => {
        setTabValue(newValue);
    }
    return (

        <Box sx={{ height: 'calc(100%)', overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Workspace" {...a11yProps(0)} />
                    <Tab label="User Assets" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
                Item One
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                Item Two
            </TabPanel>
        </Box>
    )
}
export default WorkspaceDetailsInfo;