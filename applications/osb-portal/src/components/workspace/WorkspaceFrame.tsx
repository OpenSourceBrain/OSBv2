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



    React.useEffect(() => {
        if (!app && iframeReady && (workspace.resources != null) && (workspace.resources.length > 0)) {
            const workspaceResource: WorkspaceResource = workspace.lastOpen != null ? workspace.lastOpen : workspace.resources[0];
            openResource(workspaceResource);
        }
        const iFrame = document.getElementById("workspace-frame") as HTMLIFrameElement;
        const messageListener = (message: MessageEvent) => {
            if (message.source !== iFrame.contentWindow) {
                return;
            }
            if (!message.origin.includes(applicationSubdomain)) {
                return;
            }
            const action = message.data as AnyAction;
            dispatch(action)
        };

        window.addEventListener('message', messageListener);

        return () => window.removeEventListener('message', messageListener);
    }, [workspace]);


    const applicationSubdomain = app ? OSBApplications[app].subdomain : workspace.lastOpen.type.application.subdomain
    const domain = getBaseDomain()

    const userParam = (user == null) ? '' : `${user.id}`;

    const type = applicationSubdomain.slice(0, 4);
    document.cookie = `workspaceId=${workspace.id};path=/;domain=${domain}`;
    document.cookie = `workspaceOwner=${workspace.owner.keycloakId};path=/;domain=${domain}`;
    const frameUrl = `//${applicationSubdomain}.${domain}/hub/spawn/${userParam}/${workspace.id}${type}`;





    const openResource = async (resource: WorkspaceResource) => {
        const iFrame = document.getElementById("workspace-frame") as HTMLIFrameElement;
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

    return (
        <iframe id="workspace-frame" frameBorder="0" src={frameUrl} className={classes.iframe} onLoad={onloadIframe} />
    )
}