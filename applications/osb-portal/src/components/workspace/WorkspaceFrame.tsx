import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
import { Workspace, WorkspaceResource, OSBApplications, ResourceStatus } from '../../types/workspace';
import { UserInfo } from '../../types/user';
import WorkspaceResourceService from '../../service/WorkspaceResourceService';
import WorkspaceService from '../../service/WorkspaceService';

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
    let timerId: any = null;

    const openResource = async (contentWindow: any, workspaceResource: WorkspaceResource) => {
        if (timerId !== null) {
            clearTimeout(timerId);
        }
        workspaceResource = await WorkspaceResourceService.getResource(workspaceResource.id); // refresh the workspace resource from the db
        if (workspaceResource.status === ResourceStatus.available) {
            const location: string = ((workspaceResource != null) && (workspaceResource !== undefined) &&
            (workspaceResource.location !== undefined) && (workspaceResource.location != null))
            ? workspaceResource.location : "";
            if (location.length > 0) {
                const fileName: string = location.slice(location.lastIndexOf("/") + 1)
                WorkspaceResourceService.workspacesControllerWorkspaceResourceOpen(workspaceResource.id); // Mark the workspace resource as "opened"
                contentWindow.postMessage(fileName, '*');
            }
        } else {
            timerId = setTimeout(openResource, 3000, contentWindow, workspaceResource);
        }
    }

    const onloadIframe = (e: any) => {
        if ((workspace.resources != null) && (workspace.resources.length > 0)) {
            const workspaceResource: WorkspaceResource = workspace.lastOpen != null ? workspace.lastOpen : workspace.resources[0];
            openResource(e.target.contentWindow, workspaceResource);
        }
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