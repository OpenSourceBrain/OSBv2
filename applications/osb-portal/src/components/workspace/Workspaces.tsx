import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import CircularProgress from '@material-ui/core/CircularProgress';

import WorkspaceCard from "./WorkspaceCard";
import { Workspace } from "../../types/workspace";

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    maxHeight: 'calc(100% - 55px) !important',
  },
  tab: {
    minWidth: 'fit-content !important',
    borderRight: '1px solid white',
    paddingLeft: theme.spacing(1),
  },
  lastTab: {
    borderRight: 'none',
  },
  firstTab: {
    paddingLeft: 0,
  }
}))

// TODO handle user's vs public workspaces
export const Workspaces = ({ publicWorkspaces, userWorkspaces, featuredWorkspaces, showPublicWorkspaces, showUserWorkspaces, showFeaturedWorkspaces, showPublic, showFeatured, user, deleteWorkspace, updateWorkspace, refreshWorkspaces }: any) => {

  const classes = useStyles();

  React.useEffect(() => {
    showFeaturedWorkspaces();
  }, []);

  const FEATURED_WORKSPACES = "Featured workspaces";
  const USER_WORKSPACES = "Your workspaces";
  const PUBLIC_WORKSPACES = "Public workspaces";

  const [activeTab, setActiveTab] = React.useState(FEATURED_WORKSPACES);

  const workspaces = activeTab === FEATURED_WORKSPACES ? featuredWorkspaces : activeTab === PUBLIC_WORKSPACES ? publicWorkspaces : activeTab === USER_WORKSPACES ? userWorkspaces : publicWorkspaces;


  const workspaceList =
    workspaces
      ? workspaces.map((workspace: Workspace, index: number) => {
        return (
          <Grid item={true} key={index} xs={6} sm={4} md={6} lg={4} xl={3} >
            <WorkspaceCard workspace={workspace} deleteWorkspace={deleteWorkspace} updateWorkspace={updateWorkspace} user={user} refreshWorkspaces={refreshWorkspaces} />
          </Grid>
        );
      })
      : null;


  const handleChange = (event: React.ChangeEvent<{}>, tabSelected: string) => {
    switch (tabSelected) {
      case USER_WORKSPACES:
        showUserWorkspaces();
        break;
      case FEATURED_WORKSPACES:
        showFeaturedWorkspaces();
        break;
      case PUBLIC_WORKSPACES:
        showPublicWorkspaces();
        break;
    }
    setActiveTab(tabSelected);
  };

  return (
    <>
      <Tabs
        value={activeTab}
        textColor="primary"
        indicatorColor="primary"
        onChange={handleChange}
      >
        { user ?
            <Tab className={`${classes.tab} ${classes.firstTab}`} value={USER_WORKSPACES} label={user.isAdmin ? "All workspaces" : "Your workspaces" } />
          : null
        }
        <Tab className={user ? classes.tab : `${classes.firstTab} ${classes.tab}`} value={FEATURED_WORKSPACES} label="Featured workspaces" />
        <Tab className={`${classes.tab} ${classes.lastTab}`} value={PUBLIC_WORKSPACES} label="Public workspaces" />
      </Tabs>

      {
        workspaceList && <Box mb={2}>

          <Typography variant="subtitle2" style={{ marginTop: "0.5em" }}>
            {workspaceList.length} Workspace{workspaceList.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      }

      <Box className={`verticalFit card-container ${classes.cardContainer}`} >
        <Box pt={1} pb={1} className="scrollbar">
          {workspaceList ?
            <Grid container={true} spacing={1}>
              {workspaceList}
            </Grid> : <Box mt={1}><CircularProgress /></Box>
          }
        </Box>

      </Box>
    </>
  );
};

export default Workspaces;
