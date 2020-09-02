import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
import { Workspace, WorkspaceResource, OSBApplications } from '../../types/workspace';
import { UserInfo } from '../../types/user';
import WorkspaceResourceService from '../../service/WorkspaceResourceService';
import WorkspaceService from '../../service/WorkspaceService';
import { userLogin } from '../../store/actions/user';
import { BorderAll } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    iframe: {
        flex: 1,
    },
}));



export const WorkspaceFrame = (props: { user: UserInfo, workspace: Workspace, login: any }) => {
    const classes = useStyles();

    const { user, workspace } = props;
    if (!workspace) {
        return null;
    }

    const id = workspace.id;
    const onloadIframe = (e: any, fileName: string = null) => {
        let workspaceResource: WorkspaceResource = workspace.lastOpen;
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
    const userParam = (user == null) ? '' : `${user.id}`;
    const application = workspace.lastOpen.type.application.subdomain;
    const type = application.slice(0, 4);

    const frameUrl = `//${application}.${domain}/hub/spawn/${userParam}/${id}${type}`;
    document.cookie = `accessToken=${WorkspaceService.accessToken};path=/;domain=${domain}`;
    document.cookie = `workspaceId=${id};path=/;domain=${domain}`;

    return (
        <iframe id="workspace-frame" frameBorder="0" src={frameUrl} className={classes.iframe} onLoad={onloadIframe} />
    )
}