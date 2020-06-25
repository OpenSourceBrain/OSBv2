import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    iframe: {
      frameBorder: `1px solid ${theme.palette.background.default}`,
      height: 'calc(100vh - 105px)',
      width: '100vw',
    },
 }));

export const NWBExplorerFrame = (props: any) => {
    const classes = useStyles();
    const { id } = useParams();
    const user = props.user;

    const domain = window.location.host.split('.').slice(1).join('.');  // remove the first part of the hostname

    const workspaceParam = 'workspace=${encodeURIComponent(id)}';
    const userParam = (user == null) ? '' : '&user=${encodeURIComponent(user.id)}';

    const nwbUrl = `//nwbexplorer.${domain}?${workspaceParam}${userParam}`;
    return (
        <iframe frameBorder="0" src={nwbUrl} className={classes.iframe}/>
    )
}