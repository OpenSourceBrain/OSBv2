import * as React from "react";


import { makeStyles, styled } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CircularProgress from '@material-ui/core/CircularProgress';
import InfiniteScroll from 'react-infinite-scroll-component';
import Chip from "@material-ui/core/Chip";

import { WorkspaceCard } from "..";
import { Workspace } from "../../types/workspace";
import workspaceService from '../../service/WorkspaceService';


const useStyles = makeStyles((theme) => ({
  cardContainer: {
    maxHeight: 'calc(100% - 55px) !important',
    "& .scrollbar": {
      "& .infinite-scroll-component__outerdiv": {
        "& .infinite-scroll-component": {
          overflow: 'hidden !important',
        },
      },
    },
  },
  firstTab: {
    paddingLeft: 0,
  }
}))

export enum WorkspaceSelection {
  USER,
  PUBLIC,
  FEATURED,
}

// TODO handle user's vs public workspaces
export const Workspaces = ({ user, counter }: any) => {

  const [state, setState] = React.useState<{
    selection: WorkspaceSelection,
    items: Workspace[],
    page: number,
    totalPages: number,
    total: number
  }>({
    selection: WorkspaceSelection.FEATURED,
    items: null,
    page: 1,
    totalPages: 0,
    total: null
  });


  const classes = useStyles();

  function changeSelection(newSelection: WorkspaceSelection) {
    setState({ ...state, selection: newSelection, page: 1, items: null, totalPages: 0, total: null });
  }

  function refreshWorkspaces() {
    const update = (res: any) => {
      if (page === 1) {
        setState({ ...state, ...res });
      } else {
        setState({ ...state, ...res, items: [...state.items, ...res.items] })
      }

    }
    switch (state.selection) {
      case WorkspaceSelection.PUBLIC: {
        workspaceService.fetchWorkspaces(true, false, page).then(update);
        break;
      }
      case WorkspaceSelection.FEATURED: {
        workspaceService.fetchWorkspaces(true, true, page).then(update)
        break;
      }
      default: {
        workspaceService.fetchWorkspaces(false, false, page).then(update);
        break;
      }
    }
  }



  function showMore() {
    setState({ ...state, page: page + 1 })
  }

  const { items: workspaces, selection, totalPages, page } = state;


  React.useEffect(() => {
    refreshWorkspaces();
  }, [counter, selection, page]);







  const workspaceList =
    workspaces
      ? workspaces.map((workspace: Workspace, index: number) => {
        return (
          <Grid item={true} key={index} xs={6} sm={4} md={6} lg={4} xl={3} >
            <WorkspaceCard workspace={workspace} />
          </Grid>
        );
      })
      : [];


  const handleChange = (event: React.ChangeEvent<{}>, tabSelected: WorkspaceSelection) => {
    changeSelection(tabSelected)
  };

  const fetchMoreWorkspaces = () => {
    console.log('in fetchMoreWorkspaces');
    showMore();
  }

  return (
    <>
      <Tabs
        value={selection}
        textColor="primary"
        indicatorColor="primary"
        onChange={handleChange}
      >
        {user ?
          <Tab className={user ? classes.firstTab : ''} id="your-all-workspaces-tab" value={WorkspaceSelection.USER} label={user.isAdmin ? <Typography component="p" variant="body1">All workspaces{selection === WorkspaceSelection.USER && <Chip size="small" color="primary" label={state.total}/>}</Typography> : <Typography component="p" variant="body1">Your workspaces<Chip size="small" color="primary" label={state.total}/></Typography>} />
          : null
        }
        <Tab className={user ? '' : classes.firstTab} value={WorkspaceSelection.FEATURED} label={<Typography component="p" variant="body1">Featured workspaces{selection === WorkspaceSelection.FEATURED && <Chip size="small" color="primary" label={state.total}/>}</Typography>} />
        <Tab value={WorkspaceSelection.PUBLIC} label={<Typography component="p" variant="body1">Featured workspaces{selection === WorkspaceSelection.PUBLIC && <Chip size="small" color="primary" label={state.total}/>}</Typography>} />
      </Tabs>

      {/* {
        workspaces && <Box mb={2}>

          <Typography variant="subtitle2" style={{ marginTop: "0.5em" }}>
            {state.total} Workspace{workspaceList.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      } */}

      {
        !workspaces && <Box mt={2}>

          <CircularProgress />
        </Box>
      }

      <Box className={`verticalFit card-container ${classes.cardContainer}`} mt={2}>
        <Box pb={1} className="scrollbar" id="workspace-box">

          <InfiniteScroll
            dataLength={workspaceList.length}
            next={fetchMoreWorkspaces}
            hasMore={page < totalPages}
            loader={<CircularProgress size="small" />}
            scrollableTarget="workspace-box"
          >

            <Grid container={true} spacing={1}>
              {workspaceList}
            </Grid>

          </InfiniteScroll>
        </Box>

      </Box>
    </>
  );
};


export default Workspaces;
