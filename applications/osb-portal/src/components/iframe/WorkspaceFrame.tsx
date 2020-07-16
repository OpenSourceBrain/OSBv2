import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    iframe: {
        flex: 1,
    },
}));



export const WorkspaceFrame = (props: any) => {
    const classes = useStyles();
    const { id } = useParams();
    const user = props.user;

    const onloadIframe = (e: any, fileName?: string) => {
        if (fileName == null) {
            fileName = "https://github.com/OpenSourceBrain/NWBShowcase/raw/master/NWB/time_series_data.nwb";
        }
        e.target.contentWindow.postMessage(fileName, '*');
    }

    const domain = 'v2.opensourcebrain.org'; // window.location.host.split('.').slice(1).join('.');  // remove the first part of the hostname

    const workspaceParam = `workspace=${encodeURIComponent(id)}`;
    const userParam = (user == null) ? '' : `&user=${encodeURIComponent(user.id)}`;

    const application = 'nwbexplorer';
    const frameUrl = `//${application}.${domain}?${workspaceParam}${userParam}`;
    return (
        <iframe id="workspace-frame" frameBorder="0" src={frameUrl} className={classes.iframe} onLoad={onloadIframe} />
    )
}