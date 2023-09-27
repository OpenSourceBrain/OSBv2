import * as React from "react";
import { useNavigate } from "react-router-dom";

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
import RepositoryService from "../../service/RepositoryService";

interface RepositoryActionsMenuProps {
  repository: OSBRepository;
  user?: UserInfo;
  onAction: (r: OSBRepository) => void;
  isRepositoryPage?: boolean;
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
  const navigate = useNavigate();

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

  const handleOpenRepository = () => {
    navigate(`/repositories/${props.repository.id}`);
  };

  const handleDeleteRepository = () => {
    RepositoryService.deleteRepository(props.repository.id).then(() => {
      props.onAction(null);
      handleCloseMenu();
    });
  };

  return (
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
        {!props?.isRepositoryPage && (
          <MenuItem className="open-repository" onClick={handleOpenRepository}>
            Open Repository
          </MenuItem>
        )}
        {canEdit && (
            <MenuItem onClick={handleEditRepository}>Edit</MenuItem>
        )}
        {canEdit && (
        <MenuItem
              className="open-repository"
              onClick={handleDeleteRepository}
            >
              Delete
            </MenuItem>
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
  );
};
