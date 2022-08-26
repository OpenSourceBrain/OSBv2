import * as React from "react";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { IconButton } from "@material-ui/core";
import * as Icons from "../icons";

import { EditRepoDialog } from "./../index";
import { canEditRepository } from '../../service/UserService';
import { UserInfo } from "../../types/user";
import { OSBRepository } from "../../apiclient/workspaces";

interface RepositoryActionsMenuProps {
  repository: OSBRepository;
  user?: UserInfo;
  onAction: (r: OSBRepository) => void;
}

export default (props: RepositoryActionsMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [repositoryEditorOpen, setRepositoryEditorOpen] = React.useState(false);

  const canEdit = canEditRepository(props.user, props.repository);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }

  const handleCloseMenu = () => {
    setAnchorEl(null);
  }

  const handleEditRepository = () => {
    setRepositoryEditorOpen(true);
    handleCloseMenu();
  }

  const setDialogOpen = () => {
    setRepositoryEditorOpen(!repositoryEditorOpen);
  }

  const handleOnSubmit = (r: OSBRepository) => {
    props.onAction(r);
  }

  const isRenderable = canEdit || false; // for future updates

  return (
    <>
      {
        isRenderable && <><IconButton size="small" onClick={handleClick}>
          <Icons.Dots style={{ fontSize: "1rem", transform: 'rotate(90deg)' }} />
        </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted={true}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            {canEdit && <MenuItem onClick={handleEditRepository}>Edit</MenuItem>}
          </Menu>
          {repositoryEditorOpen && <EditRepoDialog user={props.user} title="Edit repository" dialogOpen={repositoryEditorOpen} setDialogOpen={setDialogOpen}
            onSubmit={handleOnSubmit} repository={props.repository} />}
        </>
      }
    </>
  )
}