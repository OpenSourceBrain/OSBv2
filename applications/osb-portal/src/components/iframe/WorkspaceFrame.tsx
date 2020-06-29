import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    iframe: {
      border: `1px solid ${theme.palette.background.default}`,
      height: 'calc(100vh - 70px)',
      width: 'calc(100vw - 75px)',
    },
 }));

export const WorkspaceFrame = (props: any) => {
    const classes = useStyles();
    const { id } = useParams();
    const user = props.user;

    const domain = window.location.host.split('.').slice(1).join('.');  // remove the first part of the hostname

    const workspaceParam = 'workspace=${encodeURIComponent(id)}';
    const userParam = (user == null) ? '' : '&user=${encodeURIComponent(user.id)}';

    const application = 'nwbexplorer';
    const frameUrl = `//${application}.${domain}?${workspaceParam}${userParam}`;
    return (
        <iframe frameBorder="0" src={frameUrl} className={classes.iframe}/>
    )
}