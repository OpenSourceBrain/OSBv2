import * as React from "react";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";


//style
import { bgDarker } from "../../theme";
import styled from "@mui/system/styled";

//custom components
import OSBDialog from "./OSBDialog";
import { WorkspaceToolBox } from "../index";


const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: bgDarker,
  backgroundImage: "unset",
}));

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
