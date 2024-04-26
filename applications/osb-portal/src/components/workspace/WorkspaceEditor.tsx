import * as React from "react";

//components
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Alert from '@mui/material/Alert';
import Autocomplete from "@mui/material/Autocomplete";
import MDEditor from "react-markdown-editor-lite";
import MarkdownViewer from "../common/MarkdownViewer";
import OSBDialog from "../common/OSBDialog";
import ThumbnailUploadArea from "../common/ThumbnailUploadArea";

// import style manually
import "react-markdown-editor-lite/lib/index.css";

//style
import styled from "@mui/system/styled";
import { bgLight, radius, gutter, bgInputs, bgDarkest } from "../../theme";

//types
import { Workspace } from "../../types/workspace";
import { UserInfo } from "../../types/user";
import { Tag } from "../../apiclient/workspaces";

//services
import WorkspaceService from "../../service/WorkspaceService";
import StyledLabel from "../styled/FormLabel";

import { readFile } from "../../utils";



const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiChip-root": {
    backgroundColor: bgLight,
  },
  "& .MuiInputBase-root": {
    backgroundColor: "transparent !important",
    paddingTop: "0 !important",

    "&:before": {
      border: "0 !important",
    },
  },
}));

interface WorkspaceEditProps {
  workspace: Workspace;
  onLoadWorkspace: (refresh?: boolean, workspace?: Workspace) => void;
  closeHandler?: () => void;
  filesSelected?: boolean;
  tags: Tag[];
  retrieveAllTags?: (page: number) => void;
  children?: any;
  title: string;
  open: boolean;
  user: UserInfo;
}



// let thumbnail: Blob;

export default (props: WorkspaceEditProps) => {
  const { workspace, user } = props;
  const [workspaceForm, setWorkspaceForm] = React.useState<Workspace>({
    ...props.workspace,
  });

  // let's have a thumbnail state here, so we can pass it to the thumbnail upload area
  const [thumbnail, setThumbnail] = React.useState<Blob | null>(null);
  const closeWorkSpaceEditor = () => {
    if (props.closeHandler) {
      props.closeHandler();
    }
  };
  const [thumbnailError, setThumbnailError] = React.useState<any>(null);

  const [showNoFilesSelectedDialog, setShowNoFilesSelectedDialog] =
    React.useState(false);
  const workspaceTags =
    workspace && workspace.tags
      ? workspace.tags.map((tagObject) => tagObject.tag)
      : [];
  const [defaultTags, setDefaultTags] = React.useState(workspaceTags);

  const [submitError, setSubmitError] = React.useState("");

  const handleCreateWorkspaceButtonClick = () => {
    if (typeof props.filesSelected !== "undefined") {
      props.filesSelected
        ? handleCreateWorkspace()
        : setShowNoFilesSelectedDialog(!showNoFilesSelectedDialog);
    } else {
      handleCreateWorkspace();
    }
  };

  const handleCreateWorkspace = async () => {
    setLoading(true);
    WorkspaceService.createOrUpdateWorkspace({
      ...workspace,
      ...workspaceForm,
    }).then(
      async (returnedWorkspace) => {
        props.retrieveAllTags(1);
        if (thumbnail && !thumbnailError) {
          const fileThumbnail: any = await readFile(thumbnail);
          WorkspaceService.updateWorkspaceThumbnail(
            returnedWorkspace.id,
            new Blob([fileThumbnail])
          ).then(
            () => props.onLoadWorkspace(true, returnedWorkspace),
            (e) => console.error("Error uploading thumbnail", e)
          );
          setThumbnail(null);
        } else {
          setLoading(true);
          props.onLoadWorkspace(true, returnedWorkspace);
        }
      },
      (e) => {
        setLoading(false);
        if (e.status === 405) {
          setSubmitError("Workspaces quota exceeded. Try to delete some workspace before retry. To see and manage your quotas, go to your account page.");
        } else {
          setSubmitError("Unexpected error submitting the workspace. Please try again later.");
        }
        
        // console.error('Error submitting the workspace', e);
      }
    );
  };



  const setNameField = (e: any) =>
    setWorkspaceForm({ ...workspaceForm, name: e.target.value });
  const setDescriptionField = (e: any) =>
    setWorkspaceForm({ ...workspaceForm, description: e.text });
  const setWorkspaceTags = (tagsArray: string[]) => {
    const arrayOfTags: Tag[] = [];
    tagsArray.forEach((tag) => {
      arrayOfTags.push({ tag });
    });
    setWorkspaceForm({ ...workspaceForm, tags: arrayOfTags });
  };
  const setTypeField = (e: any) => {
    // publicable if 1
    // featured if 2
    setWorkspaceForm({
      ...workspaceForm,
      shareType: e.target.value,
      publicable: e.target.value >= 1,
      featured: e.target.value === 2,
    });
  };
  const [loading, setLoading] = React.useState(false);

  return (
    <>
      <OSBDialog
        title={props.title}
        open={props.open}
        closeAction={closeWorkSpaceEditor}
        maxWidth="md"
        actions={
          <React.Fragment>
            {submitError && <Alert severity="error">{submitError}</Alert>}
            <Button
              disabled={loading}
              color="primary"
              onClick={closeWorkSpaceEditor}
            >
              Cancel
            </Button>
            <Button
              id="create-a-new-workspace-button"
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={handleCreateWorkspaceButtonClick}
              sx={{ marginLeft: "8px" }}
            >
              {workspace.id ? "Save" : "Create A New Workspace"}
            </Button>
          </React.Fragment>
        }
      >
        <Box>
          {props.children && <Box>{props.children}</Box>}
          <Box>
            <StyledLabel>
              Workspace name
            </StyledLabel>
            <TextField
              id="workspaceName"
              placeholder="Name"
              fullWidth={true}
              onChange={setNameField}
              variant="outlined"
              defaultValue={props.workspace.name}
            />
          </Box>

          <Box mt={4} alignItems="stretch">
            <StyledLabel>
              Workspace tags
            </StyledLabel>
            <StyledAutocomplete
              multiple={true}
              freeSolo={true}
              options={props.tags.map((tagObject) => tagObject.tag)}
              defaultValue={defaultTags}
              onChange={(event, value) => setWorkspaceTags(value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  InputProps={{ disableUnderline: true }}
                  fullWidth={true}
                  {...params}
                  variant="filled"
                />
              )}
            />
          </Box>

          <Box mt={4}>
            <StyledLabel>
              Visibility
            </StyledLabel>
            <Select
              value={workspaceForm.shareType}
              onChange={setTypeField}
              fullWidth={true}
              variant="outlined"
            >
              <MenuItem value={0}>Private</MenuItem>
              <MenuItem value={1}>Public</MenuItem>
              {user.isAdmin && <MenuItem value={2}>Featured</MenuItem>}
            </Select>
          </Box>

          <Box mt={4}>
            <StyledLabel>
              Workspace description
            </StyledLabel>

            <MDEditor
              defaultValue={workspace?.description}
              onChange={setDescriptionField}
              view={{ html: false, menu: true, md: true }}
              renderHTML={(text: string) => <MarkdownViewer>{text}</MarkdownViewer>}
            />
          </Box>
          <Box mt={4} alignItems="stretch">
            <StyledLabel>
              Workspace thumbnail
            </StyledLabel>
            <ThumbnailUploadArea
              setThumbnail={setThumbnail}
              thumbnail={thumbnail}
              // thumbnailPreview={thumbnailPreview}
              thumbnailError={thumbnailError}
              setThumbnailError={setThumbnailError}
              workspace={workspace}
            />
          </Box>
        </Box>
      </OSBDialog>
      {loading && (
        <Box mt={4} p={2} sx={{ backgroundColor: bgLight }} textAlign="right">
          <CircularProgress
            size={24}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: -12,
              marginLeft: -12,
            }}
          />
        </Box>
      )}
      {showNoFilesSelectedDialog && (
        <Dialog
          open={showNoFilesSelectedDialog}
          onClose={() => setShowNoFilesSelectedDialog(false)}
        >
          <DialogTitle>No files selected</DialogTitle>
          <DialogContent>
            {
              "No files from this repository have been selected, and so all the files in the repository will be added in the workspace. Press OK to proceed, or press Cancel and go back and select some."
            }
          </DialogContent>
          <DialogActions>

            <Button
              color="primary"
              onClick={() => setShowNoFilesSelectedDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleCreateWorkspace();
                setShowNoFilesSelectedDialog(false);
              }}
              disabled={loading}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};
