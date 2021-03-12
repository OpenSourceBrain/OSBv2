import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from "react-router-dom";
import { Workspace, WorkspaceResource, OSBApplications, ResourceStatus } from '../../types/workspace';
import { UserInfo } from '../../types/user';
import WorkspaceResourceService from '../../service/WorkspaceResourceService';
import { getBaseDomain } from '../../utils';
import { refreshWorkspace } from '../../store/actions/workspaces';

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
    let iframeReady = false;

    React.useEffect(() => {
        if (iframeReady && (workspace.resources != null) && (workspace.resources.length > 0)) {
            const workspaceResource: WorkspaceResource = workspace.lastOpen != null ? workspace.lastOpen : workspace.resources[0];
            openResource(workspaceResource);
        }
    }, [workspace]);



    const id = workspace.id;

    const openResource = async (resource: WorkspaceResource) => {

        if (resource.status === ResourceStatus.available) {
            const fileName: string = "/opt/workspace/" + resource.folder + "/" + resource.location.slice(resource.location.lastIndexOf("/") + 1);
            const r = WorkspaceResourceService.workspacesControllerWorkspaceResourceOpen(resource.id).then(() => {
                const iFrame: HTMLIFrameElement = document.getElementById("workspace-frame") as HTMLIFrameElement;
                iFrame.contentWindow.postMessage(fileName, '*');
            }).catch(() => {
                console.error("Error opening resource, ResourceOpen function failed!");
            });
        }
    }

    const onloadIframe = (e: any) => {
        iframeReady = true;
        refreshWorkspace();
    }

    const domain = getBaseDomain()

    const userParam = (user == null) ? '' : `${user.id}`;
    const application = workspace.lastOpen.type.application.subdomain;
    const type = application.slice(0, 4);

    const frameUrl = `//${application}.${domain}/hub/spawn/${userParam}/${id}${type}`;
    document.cookie = `workspaceId=${id};path=/;domain=${domain}`;
    document.cookie = `workspaceOwner=${workspace.owner.keycloakId};path=/;domain=${domain}`;

    return (
        <iframe id="workspace-frame" frameBorder="0" src={frameUrl} className={classes.iframe} onLoad={onloadIframe} />
    )
}