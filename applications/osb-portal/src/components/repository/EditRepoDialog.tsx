import React, { useState } from "react";
import makeStyles from '@mui/styles/makeStyles';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ClearIcon from "@mui/icons-material/Clear";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CircularProgress from "@mui/material/CircularProgress";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import { Autocomplete } from '@mui/material';

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
  bgInputs,
  fontColor,
  paragraph,
  bgLightestShade,
} from "../../theme";
import MarkdownViewer from "../common/MarkdownViewer";
import { RepositoryType } from "../../apiclient/workspaces/models/RepositoryType";
import RepositoryService from "../../service/RepositoryService";
import {
  OSBRepository,
  RepositoryContentType,
  RepositoryInfo,
  Tag,
} from "../../apiclient/workspaces";
import { UserInfo } from "../../types/user";

const DEFAULT_CONTEXTS = ["main", "master"]

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiOutlinedInput-root.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        boxShadow: "0px 0px 0px 3px rgba(55, 171, 200, 0.12)",
      },
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: bgLight,
    },
    "& .MuiSelect-selectMenu": {
      backgroundColor: bgLight,
    },
    "& .MuiSvgIcon-root": {
      color: paragraph,
    },
    "& .input-group": {
      marginBottom: theme.spacing(2),
      "& .wrap": {
        [theme.breakpoints.up("sm")]: {
          display: "flex",
        },
      },
      "& .MuiTextField-root": {
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        },
      },
      "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
      "& .MuiTypography-root": {
        display: "block",
        fontWeight: "bold",
        fontSize: ".875rem",
        marginBottom: theme.spacing(1),
        color: bgInputs,
      },
      "& .MuiFormControl-root": {
        "&:not(.MuiTextField-root)": {
          width: "9rem",
          flexShrink: 0,
          [theme.breakpoints.down('md')]: {
            width: "100%",
            marginBottom: ".5rem",
          },
        },
      },
    },
    "& .form-group": {
      "& .MuiOutlinedInput-root": {
        borderRadius: 2,
      },
      "& .MuiTypography-root": {
        display: "block",
        fontWeight: "bold",
        marginBottom: theme.spacing(1),
        fontSize: ".875rem",
        color: bgInputs,
      },
      "&+.form-group": {
        marginTop: theme.spacing(2),
      },
    },
    "& .MuiDialogContent-root": {
      padding: theme.spacing(3),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(3),
      "& .MuiButton-root": {
        height: "2.13rem",
        padding: "0 1rem",
        "&.MuiButton-containedPrimary": {
          color: fontColor,
        },
      },
    },

    "& .MuiDialog-paper": {
      backgroundColor: bgLightestShade,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: bgLight,
      boxShadow: "0 10px 60px rgba(0, 0, 0, 0.5);",
    },

    "& .MuiDialogTitle-root": {
      border: "none",
      borderBottomWidth: 1,
      borderBottomStyle: "solid",
      borderBottomColor: bgLight,
      padding: theme.spacing(3),
      "& .MuiTypography-root": {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontWeight: 700,
        "& .MuiSvgIcon-root": {
          cursor: "pointer",
        },
      },
    },
  },
}));

export const EditRepoDialog = ({
  dialogOpen,
  setDialogOpen,
  onSubmit,
  repository = RepositoryService.EMPTY_REPOSITORY,
  title = "Add repository",
  user,
  tags: tagOptions,
}: {
  dialogOpen: boolean;
  onSubmit: (r: OSBRepository) => any;
  setDialogOpen: (open: boolean) => any;
  repository?: OSBRepository;
  title: string;
  user: UserInfo;
  tags: Tag[];
}) => {
  const classes = useStyles();
  const [formValues, setFormValues] = useState({
    ...repository,
    userId: user.id,
  });

  const [loading, setLoading] = React.useState(false);
  const [contexts, setContexts] = useState<string[]>();

  const [uri, setUri] = useState<string>(repository?.uri);

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
    setFormValues({ ...repository, userId: user.id });
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
      RepositoryService.getRepositoryInfo(
        uri,
        formValues.repositoryType
      ).then(
        (info: RepositoryInfo) => {
          setContexts(info.contexts);
          setFormValues({
            ...formValues,
            tags: info.tags.map((tag) => ({tag})),
            defaultContext: info.contexts.find((c => DEFAULT_CONTEXTS.includes(c))) || info.contexts[0],
            summary: info.summary,
            name: info.name
            
          });
          setLoading(false);
        },
        () => {
          setError({ ...error, uri: "Invalid url" });
          setLoading(false);
        }
      );

      
    }
  }, [uri]);

  const handleClose = () => {
    setDialogOpen(false);
  };

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
    setFormValues({...formValues, defaultContext: value})
  };

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
          (r) => {
            setLoading(false);
            handleClose();
            const obj: any = r;
            // Computed fields are not updated: remove so that the repo can be merged by the caller
            Object.keys(r).forEach((key) =>
              obj[key] === undefined ? delete obj[key] : {}
            );
            onSubmit(r);
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
            (r: OSBRepository) => {
              setLoading(false);
              setDialogOpen(false);
              const obj: any = r;
              // Computed fields are not updated: remove so that the repo can be merged by the caller
              Object.keys(r).forEach((key) =>
                obj[key] === undefined ? delete obj[key] : {}
              );
              onSubmit(r);
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
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      className={`${classes.root} repository-edit-modal`}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth={true}
      maxWidth={"lg"}
    >
      <DialogTitle id="alert-dialog-title">
        {title}
        <ClearIcon onClick={handleClose} />
      </DialogTitle>
      <DialogContent>
        <Box className="input-group">
          <Typography component="label">Source</Typography>
          <Box className="wrap">
            <FormControl variant="outlined">
              <Select
                variant="standard"
                className="repository-source-input-element"
                value={formValues.repositoryType}
                onChange={(e) => handleInput(e, "repositoryType")}
                IconComponent={KeyboardArrowDownIcon}>
                {Object.values(RepositoryType).map((repositoryType) => (
                  <MenuItem key={repositoryType} value={repositoryType}>
                    {repositoryType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              className="repository-url-input-element"
              fullWidth={true}
              placeholder="Repository URL"
              variant="outlined"
              error={Boolean(error.uri)}
              onChange={handleInputUri}
              value={formValues.uri}
            />
          </Box>
          <FormHelperText error={Boolean(error.uri)}>
            {error.uri}
          </FormHelperText>
        </Box>
        <Box className="form-group">
          <Typography component="label">Name</Typography>
          <TextField
            className="repository-name-input-element"
            fullWidth={true}
            variant="outlined"
            error={Boolean(error.name)}
            onChange={(e) => handleInput(e, "name")}
            value={formValues.name}
          />
          <FormHelperText error={Boolean(error.name)}>
            {error.name}
          </FormHelperText>
        </Box>
        {contexts && (
          <Box className="form-group">
            <Typography component="label">Default Branch/Version</Typography>
            <FormControl
              variant="outlined"
              fullWidth={true}
              error={Boolean(error.defaultContext)}
            >
              <Select
                variant="standard"
                value={formValues.defaultContext}
                defaultValue={"main"}
                onChange={(e) => handleInputContext(e)}
                IconComponent={KeyboardArrowDownIcon}>
                {contexts.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{error.defaultContext}</FormHelperText>
            </FormControl>
          </Box>
        )}

        <Box className="form-group">
          <Typography component="label">Type</Typography>
          <FormControl
            variant="outlined"
            fullWidth={true}
            error={Boolean(error.contentTypesList)}
          >
            <Select
              variant="standard"
              className="repository-type-input-element"
              value={formValues.contentTypesList}
              multiple={true}
              onChange={(e) => handleInput(e, "contentTypesList")}
              IconComponent={KeyboardArrowDownIcon}
              renderValue={(selected) => (selected as string[]).join(", ")}>
              <MenuItem value={RepositoryContentType.Experimental}>
                <Checkbox
                  color="primary"
                  checked={formValues.contentTypesList.includes(
                    RepositoryContentType.Experimental
                  )}
                />
                <ListItemText primary="Experimental Data" />
              </MenuItem>
              <MenuItem value={RepositoryContentType.Modeling}>
                <Checkbox
                  color="primary"
                  checked={formValues.contentTypesList.includes(
                    RepositoryContentType.Modeling
                  )}
                />
                <ListItemText primary="Modeling" />
              </MenuItem>
            </Select>
            <FormHelperText>{error.contentTypesList}</FormHelperText>
          </FormControl>
        </Box>

        <Box className="form-group">
          <Typography component="label">Tags</Typography>
          <Autocomplete
            className="repository-tags-input-element"
            multiple={true}
            freeSolo={true}
            options={tagOptions.map((t) => t.tag)}
            onChange={(event, value) => setRepositoryTags(value)}
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
            value={
              formValues.tags &&
              formValues.tags.map((tagObject) => tagObject.tag)
            }
          />
        </Box>

        <Box className="form-group">
          <Typography component="label">
            Can you describe what people can find in this repository?
          </Typography>

          <MDEditor
            defaultValue={formValues.summary || repository?.summary}
            value={formValues.summary}
            onChange={(e) => handleInput(e, "summary")}
            view={{ html: false, menu: true, md: true }}
            renderHTML={(text: string) => <MarkdownViewer text={text} />}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          className="repository-add-button"
          variant="contained"
          disableElevation={true}
          disabled={Object.values(error).filter((e) => e).length !== 0}
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
    </Dialog>
  );
};

export default EditRepoDialog;
