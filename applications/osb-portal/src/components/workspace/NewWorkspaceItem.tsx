import * as React from "react";
import { Typography, Box, ButtonBase, Button } from "@material-ui/core";

import { ResourceType } from "../../types/global";
import { UserInfo } from "../../types/user";
import OSBDialog from "../common/OSBDialog";
import { NewWorkspaceAskUser } from "..";
import WorkspaceEdit from "./WorkspaceEditor";

interface ItemProps {
  icon: React.ElementType;
  title: string;
  application: ResourceType;
  user: UserInfo;
}

export default (props: ItemProps) => {
  const { user, title, application } = props;
  const [askLoginOpen, setAskLoginOpen] = React.useState(false);
  const [newWorkspaceOpen, setNewWorkspaceOpen] = React.useState(false);

  const handleClick = () => {
    if (!user) {
      setAskLoginOpen(true);
    } else {
      setNewWorkspaceOpen(true);
    }
  };

  const closeAskLogin = () => setAskLoginOpen(false);

  const closeNewWorkspace = () => {
    setNewWorkspaceOpen(false);
  }
  return (
    <>
      <Button style={{ textTransform: "none" }} onClick={handleClick}>
        <Box textAlign="center">
          <props.icon style={{ marginBottom: "0.2em" }} />
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="caption">{application}</Typography>
        </Box>
      </Button>
      <OSBDialog
        title="Create new workspace"
        open={askLoginOpen}
        closeAction={closeAskLogin}
      >
        <NewWorkspaceAskUser />
      </OSBDialog>
      <OSBDialog
        title="Create new workspace"
        open={newWorkspaceOpen}
        closeAction={closeNewWorkspace}
      >
        <WorkspaceEdit workspace={null} onLoadWorkspace={closeNewWorkspace} />
      </OSBDialog>
    </>
  );
};
