import * as React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import NestedMenuItem from "material-ui-nested-menu-item";

import { OSBApplications, Workspace } from "../../types/workspace";
import OSBDialog from "../common/OSBDialog";
import WorkspaceEdit from "./WorkspaceEditor";


interface WorkspaceActionsMenuProps {
    canEdit: boolean;
    workspace: Workspace;
    anchorEl: any;
    handleCloseMenu: () => void;
    updateWorkspace?: (ws: Workspace) => null;
    deleteWorkspace?: (wsId: number) => null;
    refreshWorkspaces?: () => null;
}


export default (props: WorkspaceActionsMenuProps) => {
    const [editWorkspaceOpen, setEditWorkspaceOpen] = React.useState(false);

    const handleEditWorkspace = () => {
        setEditWorkspaceOpen(true);
        props.handleCloseMenu();
    }

    const handleDeleteWorkspace = () => {
        props.deleteWorkspace(props.workspace.id);
        props.handleCloseMenu();
        props.refreshWorkspaces();
    }

    const handlePublicWorkspace = () => {
        props.updateWorkspace({...props.workspace, publicable: true});
        props.handleCloseMenu();
    }

    const handlePrivateWorkspace = () => {
        props.updateWorkspace({ ...props.workspace, publicable: false });
        props.handleCloseMenu();
    }

    const handleOpenWorkspace = () => {
        window.location.href = `/workspace/${props.workspace.id}`;
    }

    const handleCloseEditWorkspace = () => {
        setEditWorkspaceOpen(false);
        props.refreshWorkspaces();
    }

    /**
    *
    * @param applicatonType OSBApplication key
    */
    const handleOpenWorkspaceWithApp = (applicatonType: string) => {
        window.location.href = `/workspace/${props.workspace.id}/${applicatonType}`;
    }

    return (
        <>
            <Menu
                id="simple-menu"
                anchorEl={props.anchorEl}
                keepMounted={true}
                open={Boolean(props.anchorEl)}
                onClose={props.handleCloseMenu}
            >
                {props.canEdit && <MenuItem onClick={handleEditWorkspace}>Edit</MenuItem>}
                {props.canEdit && <MenuItem onClick={handleDeleteWorkspace}>Delete</MenuItem>}
                {props.canEdit && !props.workspace.publicable && <MenuItem onClick={handlePublicWorkspace}>Make public</MenuItem>}
                {props.canEdit && props.workspace.publicable && <MenuItem onClick={handlePrivateWorkspace}>Make private</MenuItem>}
                <MenuItem onClick={handleOpenWorkspace}>Open workspace</MenuItem>
                <NestedMenuItem
                label="Open with..."
                parentMenuOpen={true}

                >
                {
                    Object.keys(OSBApplications).map(item =>
                    <MenuItem
                        key={item}
                        onClick={
                        (e) => {
                            handleOpenWorkspaceWithApp(item);
                        }
                        }
                    >
                        {OSBApplications[item].name}
                    </MenuItem>
                    )
                }


                </NestedMenuItem>
            </Menu>
            <OSBDialog
                title={"Edit workspace " + props.workspace.name}
                open={editWorkspaceOpen}
                closeAction={handleCloseEditWorkspace}
            >
                <WorkspaceEdit workspace={props.workspace} onLoadWorkspace={handleCloseEditWorkspace} />
            </OSBDialog>
        </>
    )
}