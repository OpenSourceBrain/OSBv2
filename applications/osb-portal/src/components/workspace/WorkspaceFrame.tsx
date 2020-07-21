import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
import { Workspace } from '../../types/workspace';
import { UserInfo } from '../../types/user';
import WorkspaceResourceService from '../../service/WorkspaceResourceService';
import { WorkspaceResource } from '../../apiclient/workspaces';

const useStyles = makeStyles((theme) => ({
    iframe: {
        flex: 1,
    },
}));



export const WorkspaceFrame = (props: { user: UserInfo, workspace: Workspace }) => {
    const classes = useStyles();

    const { user, workspace } = props;
    const id = workspace.id;
    const onloadIframe = (e: any, fileName: string = null) => {
        let workspaceResource: WorkspaceResource = workspace.lastResource;
        if (fileName == null) {
            if ((workspaceResource == null) && (workspace.resources != null) && (workspace.resources.length > 0)) {
                // ToDo: loop workspace resources for given fileName (if not null), when location==fileName use that workspaceresource
                // for now we just use the first resource
                workspaceResource = workspace.resources[0];
            }
            fileName = ((workspaceResource != null) && (workspaceResource !== undefined) &&
                        (workspaceResource.location !== undefined) && (workspaceResource.location != null))
                ? workspaceResource.location
                : "https://github.com/OpenSourceBrain/NWBShowcase/raw/master/NWB/time_series_data.nwb"; // TODO workspace has no resources or resource.location is null --> open this resource , temporarily hardcoded
        } else {
            // ToDo: loop workspace resources for given fileName (if not null), when location==fileName mark resource as opened
            // for now we just use the given fileName, do nothing ;-)
            //
        }
        if (workspaceResource != null) {
            WorkspaceResourceService.workspacesControllerWorkspaceResourceOpen(workspaceResource.id); // Mark the workspace resource as "opened"
        }

        e.target.contentWindow.postMessage(fileName, '*');
    }

    const domain = window.location.host.includes('.') ? window.location.host.split('.').slice(1).join('.') : window.location.host  // remove the first part of the hostname

    const workspaceParam = `workspace=${encodeURIComponent(id)}`;
    const userParam = (user == null) ? '' : `&user=${encodeURIComponent(user.id)}`;

    let application = 'nwbexplorer'; // TODO come from workspace.lastOpen.type.application.subomain
    switch (workspace.lastType) {
        case 'E':  // experiment
            application = 'nwbexplorer'; // nwb explorer
            break;
        case 'G':  // generic
            application = 'jupyterlab'; // jupyterlab
            break;
        case 'M':  // model
            application = 'netpyne'; // netpyne
            break;
        default:
            application = 'nwbexplorer'; // nwb explorer is the default
    }
    const frameUrl = `//${application}.${domain}?${workspaceParam}${userParam}`;
    return (
        <iframe id="workspace-frame" frameBorder="0" src={frameUrl} className={classes.iframe} onLoad={onloadIframe} />
    )
}