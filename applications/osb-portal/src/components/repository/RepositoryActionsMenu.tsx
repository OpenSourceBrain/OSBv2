import * as React from "react";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { EditRepoDialog } from "../index";
import { canEditRepository } from "../../service/UserService";
import { UserInfo } from "../../types/user";
import { OSBRepository } from "../../apiclient/workspaces";
import Button from "@mui/material/Button";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import { styled } from "@mui/styles";
import { chipBg } from "../../theme";
import IconButton from "@mui/material/IconButton";

interface RepositoryActionsMenuProps {
  repository: OSBRepository;
  user?: UserInfo;
  onAction: (r: OSBRepository) => void;
}

const ThreeDotButton = styled(Button)(({ theme }) => ({
  background: chipBg,
  minWidth: "3rem",
  borderRadius: "0.429rem",
  boxShadow: "none",
  "&:hover": {
    background: "transparent",
  },
}));

export default (props: RepositoryActionsMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [repositoryEditorOpen, setRepositoryEditorOpen] = React.useState(false);

  const canEdit = canEditRepository(props.user, props.repository);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditRepository = () => {
    setRepositoryEditorOpen(true);
    handleCloseMenu();
  };

  const handleCloseDialog = () => {
    setRepositoryEditorOpen(false);
  };

  const handleOnSubmit = (r: OSBRepository) => {
    props.onAction(r);
  };

  return (
    <>
      {canEdit && (
        <>
          <IconButton className="btn-actions" size="small" onClick={handleClick}>
        <MoreVertIcon style={{ fontSize: "1rem" }} />
      </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted={true}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            {canEdit && (
              <MenuItem onClick={handleEditRepository}>Edit</MenuItem>
            )}
          </Menu>
          {repositoryEditorOpen && (
            <EditRepoDialog
              user={props.user}
              title="Edit repository"
              dialogOpen={repositoryEditorOpen}
              handleClose={handleCloseDialog}
              onSubmit={handleOnSubmit}
              repository={props.repository}
            />
          )}
        </>
      )}
    </>
  );
};
