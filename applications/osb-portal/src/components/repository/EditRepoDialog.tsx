import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ClearIcon from "@material-ui/icons/Clear";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
  bgLight,
  primaryColor,
  bgInputs,
  fontColor,
  paragraph,
  bgLightestShade,
} from "../../theme";
import {
  Box,
  FormControl,
  Select,
  Typography,
  MenuItem,
  TextField,
} from "@material-ui/core";
import { RepositoryType } from "../../apiclient/workspaces/models/RepositoryType";
import RepositoryService from "../../service/RepositoryService";
import {
  OSBRepository,
  RepositoryContentType,
} from "../../apiclient/workspaces";
import { UserInfo } from "../../types/user";

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
          [theme.breakpoints.down("sm")]: {
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
          "&:hover": {
            color: primaryColor,
          },
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
}: {
  dialogOpen: boolean;
  onSubmit: () => any;
  setDialogOpen: (open: boolean) => any;
  repository?: OSBRepository;
  title: string;
  user: UserInfo;
}) => {
  const classes = useStyles();

  const [formValues, setFormValues] = useState({
    ...repository,
    userId: user.id,
  });
  const [error, setError] = useState({
    uri: false,
    defaultContext: false,
    contentTypesList: false,
    name: false,
  });
  const [loading, setLoading] = React.useState(false);
  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleInput = (event: any, key: any) => {
    const value = event.target.value;
    setFormValues({ ...formValues, [key]: value });
    setError({ ...error, [key]: !Boolean(value) });
  };

  const addRepository = () => {
    const errors = {
      name: formValues.name === "",
      uri: formValues.uri === "",
      defaultContext: formValues.defaultContext === "",
      contentTypesList:
        Boolean(formValues.contentTypesList) &&
        formValues.contentTypesList.length === 0,
    };
    setError(errors);
    if (!Object.values(errors).find((e) => e)) {
      setLoading(true);
      // TODO implement update
      RepositoryService.addRepository(formValues).then(
        () => {
          handleClose();
          onSubmit();
        },
        (e) => {
          setLoading(false);
          throw new Error("Error submitting the repository");
        }
      );
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleClose}
      className={classes.root}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
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
                value={formValues.repositoryType}
                onChange={(e) => handleInput(e, "repositoryType")}
                IconComponent={KeyboardArrowDownIcon}
              >
                {Object.values(RepositoryType)
                  .filter((t) => t === RepositoryType.Github) // TODO remove when all repo types are available
                  .map((repositoryType) => (
                    <MenuItem key={repositoryType} value={repositoryType}>
                      {repositoryType}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth={true}
              placeholder="Repository URL"
              variant="outlined"
              error={error.uri}
              onChange={(e) => handleInput(e, "uri")}
              value={formValues.uri}
            />
          </Box>
        </Box>
        <Box className="form-group">
          <Typography component="label">Name</Typography>
          <TextField
            fullWidth={true}
            variant="outlined"
            error={error.name}
            onChange={(e) => handleInput(e, "name")}
            value={formValues.name}
          />
        </Box>
        <Box className="form-group">
          <Typography component="label">Default Branch</Typography>
          <TextField
            fullWidth={true}
            variant="outlined"
            error={error.defaultContext}
            onChange={(e) => handleInput(e, "defaultContext")}
            value={formValues.defaultContext}
          />
        </Box>

        <Box className="form-group">
          <Typography component="label">Type</Typography>
          <FormControl variant="outlined" fullWidth={true}>
            <Select
              value={formValues.contentTypesList}
              multiple={true}
              onChange={(e) => handleInput(e, "contentTypesList")}
              IconComponent={KeyboardArrowDownIcon}
              error={error.contentTypesList}
            >
              <MenuItem value={RepositoryContentType.Experimental}>
                NWB Experimental Data
              </MenuItem>
              <MenuItem value={RepositoryContentType.Modeling}>
                Modeling
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box className="form-group">
          <Typography component="label">
            Can you describe what people can find in this repository?
          </Typography>
          <TextField
            multiline={true}
            fullWidth={true}
            rows={6}
            variant="outlined"
            onChange={(e) => handleInput(e, "summary")}
            value={formValues.summary}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button
          variant="contained"
          disableElevation={true}
          onClick={addRepository}
          color="primary"
        >
          Add
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
