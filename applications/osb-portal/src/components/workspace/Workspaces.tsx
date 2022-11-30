import * as React from "react";
import debounce from "lodash/debounce";

import { makeStyles } from '@mui/styles';

//components
import {
  Chip,
  Grid,
  Tabs,
  Box,
  Tab, Typography
} from "@mui/material";

//icons
import CircularProgress from "@mui/material/CircularProgress";
import InfiniteScroll from "react-infinite-scroll-component";

import { WorkspaceCard } from "..";
import { Workspace } from "../../types/workspace";
import WorkspacesSearch from "./WorkspacesSearch";
import workspaceService from "../../service/WorkspaceService";

import { bgLightest as lineColor } from "../../theme";

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    maxHeight: "calc(100% - 55px) !important",
    "& .scrollbar": {
      "& .infinite-scroll-component__outerdiv": {
        "& .infinite-scroll-component": {
          overflow: "hidden !important",
        },
      },
    },
  },
  tab: {
    maxWidth: "33%",
    minWidth: 'fit-content',
    padding: '16px 24px'
  },
  tabTitle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& .MuiTypography-root': {
      fontSize: '1.091rem',
      fontWeight: 700,
    }
  }
}));

export enum WorkspaceSelection {
  USER,
  PUBLIC,
  FEATURED,
}

// TODO handle user's vs public workspaces
export const Workspaces = ({ user, counter }: any) => {
  const [state, setState] = React.useState<{
    items: Workspace[];
    page: number;
    totalPages: number;
    total: number;
  }>({
    items: null,
    page: 1,
    totalPages: 0,
    total: null,
  });

  const [error, setError] = React.useState<boolean>(false);

  // need to use useRef because if these are stored as states, they get
  // reinitialised each time the function component re-renders.
  const filterText = React.useRef<string>("");
  const selection = React.useRef<WorkspaceSelection>(
    user ? WorkspaceSelection.USER : WorkspaceSelection.FEATURED
  );

  const classes = useStyles();

  function changeSelection(newSelection: WorkspaceSelection) {
    setState({ ...state, page: 1, items: null, totalPages: 0, total: null });
    selection.current = newSelection;
  }

  function refreshWorkspaces() {
    const update = (res: any) => {
      if (page === 1) {
        setState({ ...state, ...res });
      } else {
        setState({ ...state, ...res, items: [...state.items, ...res.items] });
      }
    };
    switch (selection.current) {
      case WorkspaceSelection.PUBLIC: {
        if (filterText.current !== "") {
          workspaceService
            .fetchWorkspacesByFilter(true, false, page, {
              text: filterText.current,
              tags: [filterText.current],
            })
            .then(update, (e) => setError(true));
        } else {
          workspaceService
            .fetchWorkspaces(true, false, page)
            .then(update, (e) => setError(true));
        }
        break;
      }
      case WorkspaceSelection.FEATURED: {
        if (filterText.current !== "") {
          workspaceService
            .fetchWorkspacesByFilter(true, true, page, {
              text: filterText.current,
              tags: [filterText.current],
            })
            .then(update, (e) => setError(true));
        } else {
          workspaceService
            .fetchWorkspaces(true, true, page)
            .then(update, (e) => setError(true));
        }
        break;
      }
      default: {
        if (filterText.current !== "") {
          workspaceService
            .fetchWorkspacesByFilter(false, false, page, {
              text: filterText.current,
              tags: [filterText.current],
            })
            .then(update, (e) => setError(true));
        } else {
          workspaceService
            .fetchWorkspaces(false, false, page)
            .then(update, (e) => setError(true));
        }
        break;
      }
    }
  }

  function showMore() {
    setState({ ...state, page: page + 1 });
  }

  const { items: workspaces, totalPages, page } = state;

  React.useEffect(() => {
    refreshWorkspaces();
  }, [counter, selection.current, page]);

  React.useEffect(() => {
    if (error === true) {
      throw new Error("Error loading workspaces.");
    }
  }, [error]);

  // For the search filter: debounced to prevent an update each time the user
  // types a letter.
  // Must use useCallback so that the function persists between renders.
  // Otherwise, since this is a function component, the function is redefined
  // each time the component is rendered
  const debounceRefreshWorkspace = React.useCallback(
    debounce((text) => {
      filterText.current = text;
      setState({ ...state, items: null });
      refreshWorkspaces();
    }, 500),
    []
  );

  const workspaceList = workspaces
    ? workspaces.map((workspace: Workspace, index: number) => {
        return (
          <Grid item={true} key={index} xs={6} sm={4} md={4} lg={3} xl={2}>
            <WorkspaceCard workspace={workspace} />
          </Grid>
        );
      })
    : [];

  const handleChange = (
    event: React.ChangeEvent<{}>,
    tabSelected: WorkspaceSelection
  ) => {
    changeSelection(tabSelected);
  };

  const fetchMoreWorkspaces = () => {
    console.log("in fetchMoreWorkspaces");
    showMore();
  };

  return (
    <>
      <Box borderBottom={`2px solid ${lineColor}`}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Tabs
            value={selection.current}
            textColor="primary"
            indicatorColor="primary"
            onChange={handleChange}
          >
            {user ? (
              <Tab
                id="your-all-workspaces-tab"
                value={WorkspaceSelection.USER}
                className={classes.tab}
                label={
                  user.isAdmin ? (
                    <div className={classes.tabTitle}>
                      <Typography>All workspaces</Typography>
                      {selection.current === WorkspaceSelection.USER && (
                          <Chip
                              size="small"
                              color="primary"
                              label={state.total}
                          />
                      )}
                    </div>
                  ) : (
                   <div className={classes.tabTitle}>
                     <Typography>Your workspaces</Typography>
                      {selection.current === WorkspaceSelection.USER && (
                        <Chip
                          size="small"
                          color="primary"
                          label={state.total}
                        />
                      )}
                    </div>
                  )
                }
              />
            ) : null}
            <Tab
              id="featured-tab"
              value={WorkspaceSelection.FEATURED}
              className={classes.tab}
              label={
                <div className={classes.tabTitle}>
                  <Typography>Featured workspaces</Typography>
                  {selection.current === WorkspaceSelection.FEATURED && (
                    <Chip size="small" color="primary" label={state.total} />
                  )}
                </div>
              }
            />
            <Tab
              id="public-tab"
              value={WorkspaceSelection.PUBLIC}
              className={classes.tab}
              label={
                <div className={classes.tabTitle}>
                  <Typography>Public workspaces</Typography>
                  {selection.current === WorkspaceSelection.PUBLIC && (
                    <Chip size="small" color="primary" label={state.total} />
                  )}
                </div>
              }
            />
          </Tabs>
          <WorkspacesSearch
            filterChanged={(newTextFilter) =>
              debounceRefreshWorkspace(newTextFilter)
            }
          />
        </Box>
      </Box>


      {!workspaces && (
        <Box
          flex={1}
          px={2}
          py={2}
          display="flex"
          alignContent="center"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress />
        </Box>
      )}

      {workspaces && (
        <Box
          className={`verticalFit card-container ${classes.cardContainer}`}
          px={4}
          py={4}
        >
          <Box pb={1} className="scrollbar" id="workspace-box">
            <InfiniteScroll
              dataLength={workspaceList.length}
              next={fetchMoreWorkspaces}
              hasMore={page < totalPages}
              loader={
                <Box
                  display="flex"
                  flex={1}
                  px={2}
                  py={2}
                  justifyContent="center"
                  width="100%"
                >
                  <CircularProgress />
                </Box>
              }
              scrollableTarget="workspace-box"
            >
              <Grid container={true} spacing={1}>
                {workspaceList}
              </Grid>
            </InfiniteScroll>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Workspaces;
