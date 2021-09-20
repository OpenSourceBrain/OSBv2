import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import MainMenu from "../components/menu/MainMenu";
import Box from "@material-ui/core/Box";
import AppsIcon from "@material-ui/Icons/Apps";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { OSBSplitButton } from "../components/common/OSBSpliButton";
import { bgLight } from "../theme";

const useStyles = makeStyles((theme) => ({
  workspaceToolbar: {
      backgroundColor: bgLight,
  },
}));

export const WorkspacePage = (props: any) => {

    const classes = useStyles();
    const history = useHistory();

    console.log('all props', props);

    const OPEN_NWB = 'OPEN WITH NWB EXPLORER';
    const OPEN_JUPYTER = 'OPEN WITH JUPYTER HUB';
    const OPEN_NETPYNE = 'OPEN WITH NETPYNE';
    const options = [OPEN_NWB, OPEN_JUPYTER, OPEN_NETPYNE];

    const openWithApp = (selectedOption: string) => {
        console.log('inside open with app, opening with', selectedOption);
    }

    return <>
        <MainMenu />
        <Box className={classes.workspaceToolbar}>
            <Box display="flex" alignItems="center">
              <AppsIcon color="primary" fontSize="small" onClick={() => history.goBack()} />
              <Typography component="h1" color="primary">
                <Typography component="span" onClick={history.goBack}>See all workspaces</Typography>
              </Typography>
            </Box>
            <Box>
                <Button variant="outlined" disableElevation={true} color="secondary" style={{ borderColor: 'white' }}>
                    Edit
                </Button>
                <OSBSplitButton options={options} handleClick={openWithApp} />
            </Box>
        </Box>
    </>
}

export default WorkspacePage;