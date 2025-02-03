import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ClearIcon from "@mui/icons-material/Clear";
import CircularProgress from "@mui/material/CircularProgress";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import InputLabel from "@mui/material/InputLabel";
import Autocomplete from "@mui/material/Autocomplete";

import {
  Box,
  FormControl,
  Select,
  Typography,
  MenuItem,
  TextField,
  FormHelperText,
} from "@mui/material";
import MDEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";

import {
  bgLight,
  paragraph,
  bgDarker,
  secondaryColor,
  checkBoxColor,
  bgLightest,
  bgDarkest,
  badgeBgLight,
  drawerText,
} from "../../theme";
import { RepositoryType } from "../../apiclient/workspaces";
import RepositoryService from "../../service/RepositoryService";
import {
  OSBRepository,
  RepositoryContentType,
  RepositoryInfo,
  Tag,
} from "../../apiclient/workspaces";
import { UserInfo } from "../../types/user";
import { styled } from "@mui/system";
import ButtonGroup from "@mui/material/ButtonGroup";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RepositoryMarkdownViewer from "./RepositoryMarkdownViewer";
import ThumbnailUploadArea from "../common/ThumbnailUploadArea";
import { readFile } from "../../utils";

const DEFAULT_CONTEXTS = ["main", "master"];

interface EditRepoProps {
  dialogOpen: boolean;
  onSubmit?: (r: OSBRepository) => any;
  handleClose: (open: boolean) => any;
  repository?: OSBRepository;
  title: string;
  user?: UserInfo;
  tags: Tag[];
  refreshRepositories: () => void;
}

const RepoDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    padding: 0,
    backgroundColor: bgDarker,
    backgroundImage: "unset",
    borderRadius: "0.143rem",

    "& .MuiDialogTitle-root": {
      padding: "0.857rem 1.143rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: `0.071rem solid ${bgLight}`,
      color: secondaryColor,
      fontWeight: 700,

      "& .MuiSvgIcon-root": {
        color: drawerText,
      },

      "& .MuiButtonBase-root": {
        alignSelf: "end",
        padding: 0,
        "& .MuiSvgIcon-root": {
          marginBottom: 0,
          fill: checkBoxColor,
        },
        "&:hover": {
          backgroundColor: "transparent",
        },
      },
    },
  },
  "& .MuiDialogContent-root": {
    padding: "0.875rem 1rem",
    display: "grid",
    gap: "0.875rem",
    marginTop: "0.857rem",
    marginBottom: "1rem",
  },

  "& .MuiDialogActions-root": {
    padding: "1.143rem",
    background: bgLightest,
    boxShadow: "0px -5px 30px rgba(0, 0, 0, 0.25)",
    border: `0.071rem solid ${bgDarkest}`,
  },
  "& .MuiFormControl-root": {
    backgroundColor: bgLight,
    borderRadius: "2px",
    "& .MuiInputBase-root": {
      margin: 0,
      "&:hover": {
        "&:before": {
          border: 0,
        },
      },
    },
  },
}));

const RepoButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  borderRadius: "2px",
  "& .MuiTextField-root": {
    "& .MuiInputBase-root.MuiOutlinedInput-root": {
      borderRadius: "0px 2px 2px 0px",
    },
  },
}));

const Label = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "0.75rem",
  color: badgeBgLight,
  marginBottom: "0.286rem",
  lineHeight: "1.429rem",
}));

const RepoSelect = styled(Select)(({ theme }) => ({
  padding: 0,
  borderRadius: "2px",
  color: paragraph,
  fontSize: "1rem",
  backgroundColor: bgLight,

  "& .MuiSelect-select": {
    padding: "14px",
  },
  "&:before": {
    border: 0,
  },

  "& .MuiSelect-root": {
    padding: "14px",
  },
  "&:after": {
    border: 0,
  },

  "& .MuiSvgIcon-root": {
    right: theme.spacing(1),
  },
}));

const RepoAutocomplete = styled(Autocomplete)(({ theme }) => ({
  border: 0,
  padding: 0,
  "& .MuiButtonBase-root.MuiChip-root": {
    background: bgDarkest,
  },
  "& .MuiFormControl-root": {
    "& .MuiInputBase-root": {
      padding: "7px",
    },
  },
}));

export const EditRepoDialog = ({
  dialogOpen,
  onSubmit,
  repository = RepositoryService.EMPTY_REPOSITORY,
  title = "Add repository",
  user,
  tags: tagOptions,
  handleClose,
  refreshRepositories,
}: EditRepoProps) => {
  const [formValues, setFormValues] = useState({
    ...repository,
    userId: user?.id,
  });
  const [loading, setLoading] = React.useState(false);
  const [contexts, setContexts] = useState<string[]>();

  const [uri, setUri] = useState<string>(repository?.uri);
  const [thumbnail, setThumbnail] = React.useState<Blob | null>(null);
  const [thumbnailError, setThumbnailError] = React.useState<any>(null);

  const [error, setError] = useState({
    uri: "",
    defaultContext: "",
    contentTypesList: "",
    name: "",
  });

  const setRepositoryTags = (tags: string[]) => {
    const arrayOfTags: Tag[] = [];
    tags.forEach((tag) => arrayOfTags.push({ tag }));
    setFormValues({ ...formValues, tags: arrayOfTags });
  };

  React.useEffect(() => {
    setFormValues({ ...repository, userId: user?.id });
    const repositoryTags: string[] =
      repository && repository.tags
        ? repository.tags.map((tagObject) => tagObject.tag)
        : [];
    setRepositoryTags(repositoryTags);
  }, [repository]);

  React.useEffect(() => {
    if (uri) {
      setLoading(true);
      setError({ ...error, uri: undefined });
      RepositoryService.getRepositoryInfo(uri, formValues.repositoryType).then(
        (info: RepositoryInfo) => {
          setContexts(info.contexts);
          setLoading(false);
          if(repository !== RepositoryService.EMPTY_REPOSITORY) {
            setFormValues({
              ...formValues,
              tags: repository.tags || info.tags.map((tag) => ({ tag })),
              defaultContext: repository.defaultContext ||
                info.contexts.find((c) => DEFAULT_CONTEXTS.includes(c)) ||
                info.contexts[0],
              summary: repository.summary || info.summary,
              name: repository.name || info.name,
            });
          }
          setLoading(false);
        },
        () => {
          setError({ ...error, uri: "Invalid url" });
          setLoading(false);
        }
      );
    }
  }, [uri]);

  const handleInput = (event: any, key: any) => {
    const value = event?.target?.value || event.text;
    setFormValues({ ...formValues, [key]: value });
    setError({ ...error, [key]: !value });
  };

  // Needs debouncing
  const handleInputUri = (event: any) => {
    const value = event?.target?.value || event.text;
    setUri(value);
    setError({ ...error, uri: null });
    handleInput(event, "uri");
  };

  const handleInputContext = (event: any) => {
    const value = event?.target?.value || event.text;
    setFormValues({ ...formValues, defaultContext: value });
  };

  async function submitRepositoryThumbnail(obj: any) {
    if (thumbnail && !thumbnailError) {
      const fileThumbnail: any = await readFile(thumbnail);
      RepositoryService.updateRepostioryThumbnail(
        obj.id,
        new Blob([fileThumbnail])
      ).then(
        () => {
          refreshRepositories();
          // Computed fields are not updated: remove so that the repo can be merged by the caller
          Object.keys(obj).forEach((key) => obj[key] === undefined ? delete obj[key] : {}
          );
          onSubmit(obj);
        },
        (e) => {
          console.error(e);
          throw new Error("Error updating the repository thumbnail");
        });
      setThumbnail(null);
    } else {
      setLoading(true);
      refreshRepositories();
    }
  }

  const addOrUpdateRepository = () => {
    console.log("original repository", repository);
    const errors = {
      name: !formValues.name ? "Name must be set" : "",
      uri: !formValues.uri ? "URL must be set" : "",
      defaultContext: !formValues.defaultContext
        ? "Please select one value from the list"
        : "",
      contentTypesList:
        Boolean(formValues.contentTypesList) &&
        formValues.contentTypesList.length === 0
          ? "Please select at least one value"
          : "",
    };
    setError(errors);
    if (!Object.values(errors).find((e) => e)) {
      setLoading(true);
      if (repository === RepositoryService.EMPTY_REPOSITORY) {
        RepositoryService.addRepository(formValues).then(
          async (returnedRepository) => {
            setLoading(false);
            handleClose(false);
            const obj: any = returnedRepository;
            await submitRepositoryThumbnail(obj);
          },
          (e) => {
            setLoading(false);
            e.json().then((m: any) => console.error(m));
            throw new Error("Error submitting the repository");
          }
        );
      } else {
        const putRequestRepository: OSBRepository = {
          ...formValues,
          user: undefined,
        };
        console.log("sending this repository", putRequestRepository);
        RepositoryService.updateRepository(putRequestRepository)
          .then(
            async (returnedRepository) => {
              setLoading(false);
              handleClose(false);
              const obj: any = returnedRepository;
              // Computed fields are not updated: remove so that the repo can be merged by the caller
              Object.keys(returnedRepository).forEach((key) =>
                obj[key] === undefined ? delete obj[key] : {}
              );
              onSubmit(returnedRepository);
              await submitRepositoryThumbnail(obj);
            },
            (e) => {
              setLoading(false);
              e.json().then((m: any) => console.error(m.description, m.trace));
            }
          )
          .catch((e) => {
            console.error(e);
            setLoading(false);
            throw new Error("Error updating the repository");
          });
      }
    }
  };

  return (
    <RepoDialog
      open={dialogOpen}
      onClose={() => handleClose(false)}
      className={"repository-edit-modal"}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth={true}
      maxWidth={"lg"}
    >
      <DialogTitle id="alert-dialog-title">
        {title}
        <ClearIcon onClick={() => handleClose(false)} />
      </DialogTitle>
      <DialogContent>
        <Box>
          <Label>Source</Label>
          <RepoButtonGroup fullWidth>
            <Select
              sx={{
                background: bgLight,
                borderRadius: "2px 0px 0px 2px",
                width: "30%",
                "& .MuiOutlinedInput-root:hover": {
                  "& > fieldset": {
                    borderColor: bgLightest,
                  },
                },
                "&:before": {
                  border: "0 !important",
                },
                "& .MuiSelect-select": {
                  padding: "0 24px",
                },
              }}
              inputProps={{ "aria-label": "Without label" }}
              IconComponent={(props) => (
                <ExpandMoreIcon sx={{ fill: paragraph }} {...props} />
              )}
              variant="standard"
              className="repository-source-input-element"
              value={formValues.repositoryType}
              onChange={(e) => handleInput(e, "repositoryType")}
            >
              {Object.values(RepositoryType).map((repositoryType) => (
                <MenuItem key={repositoryType} value={repositoryType}>
                  {repositoryType}
                </MenuItem>
              ))}
            </Select>
            <TextField
              className="repository-url-input-element"
              variant="outlined"
              error={Boolean(error.uri)}
              onChange={handleInputUri}
              value={formValues.uri}
              placeholder="Repository URL"
              fullWidth
              sx={{
                backgroundColor: "transparent !important",
                padding: 0,
                "& .MuiOutlinedInput-root:hover": {
                  "& > fieldset": {
                    borderColor: bgLightest,
                  },
                },
              }}
            />
          </RepoButtonGroup>
          <FormHelperText error={Boolean(error.uri)}>
            {error.uri}
          </FormHelperText>
        </Box>
        {contexts && (
          <Box>
            <Label>Default Branch/Version</Label>
            <FormControl
              variant="outlined"
              fullWidth={true}
              error={Boolean(error.defaultContext)}
            >
              <InputLabel
                shrink={false}
                htmlFor="repo-branch"
                sx={{ color: paragraph }}
              >
                {!formValues.defaultContext && "Select branch"}
              </InputLabel>
              <RepoSelect
                id="repo-branch"
                variant="standard"
                value={formValues.defaultContext}
                defaultValue={"main"}
                onChange={(e) => handleInputContext(e)}
                fullWidth
                displayEmpty
                label="Select branch"
                inputProps={{
                  "aria-label": "Select branch",
                }}
                IconComponent={(props) => (
                  <ExpandMoreIcon sx={{ fill: paragraph }} {...props} />
                )}
              >
                {contexts?.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </RepoSelect>
              <FormHelperText>{error.defaultContext}</FormHelperText>
            </FormControl>
          </Box>
        )}
        <Box>
          <Label>Name</Label>
          <FormControl
            fullWidth={true}
            error={Boolean(error.name)}
            sx={{
              "& .MuiFormControl-root": {
                padding: 0,
              },
              "& .MuiInputBase-root": {
                "&:hover": {
                  "& > fieldset": {
                    borderColor: bgLightest,
                  },
                },
                "& .MuiInputBase-input": {
                  padding: "14px",
                },
              },
            }}
          >
            <InputLabel
              shrink={false}
              htmlFor="repo-name"
              sx={{ color: paragraph }}
            >
              {!formValues.name && "Repository name"}
            </InputLabel>
            <TextField
              id="repo-name"
              className="repository-name-input-element"
              fullWidth={true}
              variant="outlined"
              error={Boolean(error.name)}
              onChange={(e) => handleInput(e, "name")}
              value={formValues.name}
              sx={{ padding: "14px" }}
            />
            <FormHelperText error={Boolean(error.name)}>
              {error.name}
            </FormHelperText>
          </FormControl>
        </Box>

        <Box>
          <Label>Type</Label>
          <FormControl
            variant="outlined"
            fullWidth={true}
            error={Boolean(error.contentTypesList)}
          >
            <InputLabel
              shrink={false}
              htmlFor="repo-type"
              sx={{ color: paragraph, "&.Mui-focused": { color: paragraph } }}
            >
              {!formValues?.contentTypesList?.length && "Select type"}
            </InputLabel>
            <RepoSelect
              variant="standard"
              id="repo-type"
              className="repository-type-input-element"
              value={formValues.contentTypesList}
              multiple={true}
              onChange={(e) => handleInput(e, "contentTypesList")}
              IconComponent={(props) => (
                <ExpandMoreIcon sx={{ fill: paragraph }} {...props} />
              )}
              renderValue={(selected) => (selected as string[]).join(", ")}
            >
              <MenuItem
                value={RepositoryContentType.Experimental}
                sx={{ padding: "0" }}
              >
                <Checkbox
                  color="primary"
                  checked={formValues.contentTypesList.includes(
                    RepositoryContentType.Experimental
                  )}
                />
                <ListItemText primary="Experimental Data" />
              </MenuItem>
              <MenuItem
                value={RepositoryContentType.Modeling}
                sx={{ padding: "0" }}
              >
                <Checkbox
                  color="primary"
                  checked={formValues.contentTypesList.includes(
                    RepositoryContentType.Modeling
                  )}
                />
                <ListItemText primary="Modeling" />
              </MenuItem>
            </RepoSelect>
            <FormHelperText>{error.contentTypesList}</FormHelperText>
          </FormControl>
        </Box>

        <Box>
          <Label>Repository tags</Label>
          <FormControl variant="outlined" fullWidth={true}>
            <InputLabel
              shrink={false}
              htmlFor="repository-tags-input-element"
              sx={{ color: paragraph }}
            >
              {!formValues?.tags?.length && "Select tags"}
            </InputLabel>
            <RepoAutocomplete
              id="repository-tags-input-element"
              className="repository-tags-input-element"
              multiple={true}
              freeSolo={true}
              options={tagOptions.map((t) => t.tag)}
              onChange={(event, value: string[]) => setRepositoryTags(value)}
              placeholder="Select tags"
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={`tag-${index}`}
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
              value={
                formValues.tags &&
                formValues.tags.map((tagObject) => tagObject.tag)
              }
              sx={{
                "& .MuiInputBase-root": {
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                },
              }}
            />
          </FormControl>
        </Box>

        <Box>
          <Label>
            Can you describe what people can find in this repository?
          </Label>

          <MDEditor
            defaultValue={formValues.summary || repository?.summary}
            value={formValues.summary}
            onChange={(e) => handleInput(e, "summary")}
            view={{ html: false, menu: true, md: true }}
            renderHTML={(text: string) => <RepositoryMarkdownViewer text={text} />}
          />
        </Box>
        <Box>
          <ThumbnailUploadArea
            thumbnail={thumbnail}
            setThumbnail={setThumbnail}
            thumbnailError={thumbnailError}
            setThumbnailError={setThumbnailError}
            workspace={repository}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)} color="primary">
          Cancel
        </Button>
        <Button
          className="repository-add-button"
          variant="contained"
          disableElevation={true}
          disabled={loading}
          onClick={addOrUpdateRepository}
          color="primary"
        >
          {repository === RepositoryService.EMPTY_REPOSITORY ? "Add" : "Save"}
        </Button>
        {loading && (
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
        )}
      </DialogActions>
    </RepoDialog>
  );
};

export default EditRepoDialog;
