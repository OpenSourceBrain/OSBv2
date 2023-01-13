import * as React from "react";

//components
import OSBDialog from "./OSBDialog";
import Paper from "@mui/material/Paper";
import { WorkspaceToolBox } from "../index";

//style
import { bgDarker } from "../../theme";
import styled from "@mui/system/styled";

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
      title="Create a new workspace"
      subTitle={
        <>
          Quickly create a workspace by choosing <br /> one of the predefined
          templates
        </>
      }
      open={dialogOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="createWorkspaceRepo"
    >
      <StyledPaper>
        <WorkspaceToolBox />
      </StyledPaper>
    </OSBDialog>
  );
};
