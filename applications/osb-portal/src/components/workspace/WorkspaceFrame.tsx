import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Workspace, WorkspaceResource, OSBApplications, ResourceStatus } from '../../types/workspace';
import { UserInfo } from '../../types/user';
import WorkspaceResourceService from '../../service/WorkspaceResourceService';
import { getBaseDomain } from '../../utils';
import { refreshWorkspace } from '../../store/actions/workspaces';
import { AnyAction, Dispatch } from 'redux';

const useStyles = makeStyles((theme) => ({
    iframe: {
        flex: 1,
    },
}));

export const WorkspaceFrame = (props: { user: UserInfo, workspace: Workspace, app: string, dispatch: Dispatch }) => {
    const classes = useStyles();

    const { user, workspace, app, dispatch } = props;
    if (!workspace) {
        return null;
    }
    let iframeReady = false;
    let iFrame: HTMLIFrameElement;
    const applicationSubdomain = app ? OSBApplications[app].subdomain : workspace.lastOpen.type.application.subdomain;
    React.useEffect(() => {
        if (!app && iframeReady && (workspace.resources != null) && (workspace.resources.length > 0)) {
            const workspaceResource: WorkspaceResource = workspace.lastOpen != null ? workspace.lastOpen : workspace.resources[0];
            openResource(workspaceResource);
        }
    }, [workspace]);

    React.useEffect(() => {
        iFrame = document.getElementById("workspace-frame") as HTMLIFrameElement;
        window.addEventListener('message', message => {
            if (message.source !== iFrame.contentWindow) {
                return; // Skip message in this event listener
            }
            if (!message.origin.includes(applicationSubdomain)) {
                return;
            }
            const action = message.data as AnyAction;
            dispatch(action)
        });
    }, []);

    const id = workspace.id;

    const openResource = async (resource: WorkspaceResource) => {

        if (resource.status === ResourceStatus.available) {
            const fileName: string = "/opt/workspace/" + resource.folder + "/" + resource.location.slice(resource.location.lastIndexOf("/") + 1);
            WorkspaceResourceService.workspacesControllerWorkspaceResourceOpen(resource.id).then(() => {
                iFrame.contentWindow.postMessage(fileName, '*');
            }).catch(() => {
                console.error("Error opening resource, openResource function failed!");
            });
        }
    }




    const onloadIframe = (e: any) => {
        iframeReady = true;
        refreshWorkspace();
    }

    const domain = getBaseDomain()

    const userParam = (user == null) ? '' : `${user.id}`;

    const type = applicationSubdomain.slice(0, 4);

    const frameUrl = `//${applicationSubdomain}.${domain}/hub/spawn/${userParam}/${id}${type}`;
    document.cookie = `workspaceId=${id};path=/;domain=${domain}`;
    document.cookie = `workspaceOwner=${workspace.owner.keycloakId};path=/;domain=${domain}`;

    return (
        <iframe id="workspace-frame" frameBorder="0" src={frameUrl} className={classes.iframe} onLoad={onloadIframe} />
    )
}