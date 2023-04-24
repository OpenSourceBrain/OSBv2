import * as React from "react";
import debounce from "lodash/debounce";

import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import workspaceService from "../../service/WorkspaceService";
import WorkspaceCard from "./WorkspaceCard";
import { Workspace } from "../../types/workspace";
import { linkColor } from "../../theme";
import searchFilter from "../../types/searchFilter";
import SearchFilterReposWorkspaces from "../common/SearchFilterReposWorkspaces";
import { Page } from "../../types/model";

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
  const [searchFilterValues, setSearchFilterValues] =
    React.useState<searchFilter>({
      text: undefined,
      tags: [],
      types: [],
    });
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>(null);

  const debouncedHandleSearchFilter = debounce((newTextFilter: string) => {
    setSearchFilterValues({
      ...searchFilterValues,
      text: newTextFilter,
      tags: newTextFilter
        ? [...searchFilterValues?.tags, newTextFilter]
        : searchFilterValues?.tags,
    });
  }, 500);



  const isSearchFieldsEmpty =
    searchFilterValues.tags.length === 0 &&
    searchFilterValues.types.length === 0 &&
    (typeof searchFilterValues.text === "undefined" ||
      searchFilterValues.text === "");

  const setWorkspacesFromPage = (retrievedWorkspaces: Page<Workspace>): void => {
    setWorkspaces(retrievedWorkspaces.items);
    setActiveCardClassNames(
      Array(retrievedWorkspaces.items.length).fill("not-active")
    );
  };

  const getWorkspacesList = (payload?) => {
    setWorkspaces(null);

    if (payload?.searchFilterValues) {
      workspaceService
        .fetchWorkspacesByFilter(null, null, 1, searchFilterValues, 100)
        .then(setWorkspacesFromPage);
    } else {
      workspaceService
        .fetchWorkspaces(null, null, 1, 100)
        .then(setWorkspacesFromPage);
    }
  };

  React.useEffect(() => {
    if (isSearchFieldsEmpty) {
      getWorkspacesList();
    } else {
      getWorkspacesList({ searchFilterValues });
    }
  }, [searchFilterValues]);

  const handleWorkspaceSelection = (index: number) => {
    const placeHolderArray = Array(workspaces.length).fill("not-active");
    placeHolderArray[index] = "active";
    setActiveCardClassNames(placeHolderArray);
    props.setWorkspace(workspaces[index]);
  };

  return (
    <>
      <Box width="100%" display="flex" py={2}>
        <SearchFilterReposWorkspaces
          filterChanged={(newTextFilter) =>
            debouncedHandleSearchFilter(newTextFilter)
          }
          searchFilterValues={searchFilterValues}
          setSearchFilterValues={setSearchFilterValues}
          hasTypes={false}
        />
      </Box>
      <Box className={`${classes.workspacesBox} scrollbar`}>
        {workspaces ? (
          <Grid container={true} spacing={1}>
            {workspaces &&
              workspaces.map((workspace, index) => {
                return (
                  <Grid
                    item={true}
                    key={workspace.id}
                    xs={6}
                    sm={6}
                    md={4}
                    lg={3}
                    xl={2}
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
