import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
import { Workspace } from '../../types/workspace';
import { UserInfo } from '../../types/user';

const useStyles = makeStyles((theme) => ({
    iframe: {
        flex: 1,
    },
}));



export const WorkspaceFrame = (props: { user: UserInfo, workspace: Workspace }) => {
    const classes = useStyles();

    const { user, workspace } = props;
    const id = workspace.id;
    const onloadIframe = (e: any, fileName?: string) => {
        if (fileName == null) {
            fileName = "https://github.com/OpenSourceBrain/NWBShowcase/raw/master/NWB/time_series_data.nwb"; // TODO temporarily hardcoded
        }
        e.target.contentWindow.postMessage(fileName, '*');
    }

    const domain = window.location.host.includes('.') ? window.location.host.split('.').slice(1).join('.') : window.location.host  // remove the first part of the hostname

    const workspaceParam = `workspace=${encodeURIComponent(id)}`;
    const userParam = (user == null) ? '' : `&user=${encodeURIComponent(user.id)}`;

    const application = 'nwbexplorer'; // TODO come from workspace.lastOpen.type.application.subomain
    const frameUrl = `//${application}.${domain}?${workspaceParam}${userParam}`;
    return (
        <iframe id="workspace-frame" frameBorder="0" src={frameUrl} className={classes.iframe} onLoad={onloadIframe} />
    )
}