import * as React from "react";


//custom components
import OSBDialog from "./OSBDialog";
import { WorkspaceToolBox } from "../index";


export default ({
  dialogOpen,
  handleClose,
}: {
  dialogOpen: boolean;
  handleClose: (open: boolean) => any;
}) => {

  return (
    <OSBDialog
      closeAction={() => handleClose(false)}
      title=""
      open={dialogOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="createWorkspaceRepo"
      sx={{ "& .MuiTypography-h6": {borderBottom: "none !important"} }}
    >
      
        <WorkspaceToolBox
          title="Create new Workspace"
          closeMainDialog={(isClosed) => handleClose(isClosed)}
        />
      
    </OSBDialog>
  );
};
