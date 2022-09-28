import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import workspaceService from "../../service/WorkspaceService";
import WorkspaceCard from "./WorkspaceCard";
import { Workspace } from "../../types/workspace";
import { linkColor } from "../../theme";

const useStyles = makeStyles((theme) => ({
  workspacesBox: {
    height: "400px",
    overflow: "auto",
    "& .MuiGrid-container": {
      "& .MuiGrid-item": {
        "& .active-button": {
          border: `3px solid ${linkColor}`,
        },
      },
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
  },
  workspaceButton: {
    padding: 0,
    width: "100%",
    "& .MuiButton-label": {
      "& .not-active": {
        display: "none",
      },
      "& .MuiCard-root": {
        minHeight: "fit-content",
        "& .MuiBox-root": {
          "& .MuiLink-root": {
            "& .MuiSvgIcon-root": {
              padding: "0.5rem",
            },
          },
        },
        "& .MuiCardContent-root": {
          "& .MuiLink-root": {
            "& .MuiTypography-h5": {
              fontSize: "1rem",
              textTransform: "capitalize",
            },
          },
          "& .MuiTypography-caption": {
            fontSize: "0.6rem",
            textTransform: "capitalize",
          },
        },
      },
    },
    "& a": {
      pointerEvents: "none",
    },
  },
  checkMarkIcon: {
    position: "absolute",
    top: 0,
    left: 0,
    marginLeft: "0.5rem",
    marginTop: "0.5rem",
  },
}));

interface ExistingWorkspaceEditorProps {
  setWorkspace: (ws: Workspace) => void;
  loading: boolean;
}

export const ExistingWorkspaceEditor = (
  props: ExistingWorkspaceEditorProps
) => {
  const classes = useStyles();

  const [activeCardClassNames, setActiveCardClassNames] = React.useState<
    string[]
  >([]);
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>(null);

  React.useEffect(() => {
    workspaceService
      .fetchWorkspaces(null, null, 1, 1000)
      .then((retrievedWorkspaces) => {
        setWorkspaces(retrievedWorkspaces.items);
        setActiveCardClassNames(
          Array(retrievedWorkspaces.items.length).fill("not-active")
        );
      });
  }, []);

  const handleWorkspaceSelection = (index: number) => {
    const placeHolderArray = Array(workspaces.length).fill("not-active");
    placeHolderArray[index] = "active";
    setActiveCardClassNames(placeHolderArray);
    props.setWorkspace(workspaces[index]);
  };

  return (
    <>
      <Box p={3} className={`${classes.workspacesBox} scrollbar`}>
        {workspaces ? (
          <Grid container={true} spacing={1}>
            {workspaces &&
              workspaces.map((workspace, index) => {
                return (
                  <Grid
                    item={true}
                    key={workspace.id}
                    xs={6}
                    sm={4}
                    md={4}
                    lg={4}
                    xl={3}
                  >
                    <Button
                      className={`${activeCardClassNames[index]}-button ${classes.workspaceButton}`}
                      onClick={() => handleWorkspaceSelection(index)}
                      disableRipple={true}
                    >
                      <CheckCircleIcon
                        className={`${activeCardClassNames[index]} ${classes.checkMarkIcon}`}
                        color="primary"
                      />
                      <WorkspaceCard workspace={workspace} hideMenu={true} />
                    </Button>
                  </Grid>
                );
              })}
          </Grid>
        ) : (
          <CircularProgress
            size={40}
            style={{ position: "relative", left: "50%" }}
          />
        )}
      </Box>
      {props.loading && (
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
    </>
  );
};

interface ExistingWorkspaceEditorActionsProps {
  disabled: boolean;
  closeAction: () => void;
  onAddClick: () => void;
}

export const ExistingWorkspaceEditorActions = (
  props: ExistingWorkspaceEditorActionsProps
) => {
  return (
    <Box p={1}>
      <Grid container={true}>
        <Grid item={true}>
          <Button color="primary" onClick={props.closeAction}>
            Cancel
          </Button>
        </Grid>
        <Grid
          item={true}
          style={{
            marginLeft: "1rem",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            disabled={props.disabled}
            onClick={props.onAddClick}
          >
            Add to workspace
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
