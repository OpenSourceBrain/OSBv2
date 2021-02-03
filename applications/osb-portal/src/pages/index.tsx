import * as React from "react";
import { Grid, Paper } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import MainMenu from "../components/menu/MainMenu";
import { makeStyles } from "@material-ui/core/styles";
import { Latest } from "../components/latest/Latest";
import { useRouter } from 'next/router';
import { keycloakCfg } from "../config";
import type { AppProps, AppContext } from 'next/app'
import { parseCookies } from "../utils";
import { SSRKeycloakProvider, SSRCookies, getKeycloakInstance } from '@react-keycloak/ssr';
import workspaceService from '../service/WorkspaceService';




import {
  Banner,
  Workspaces,
  WorkspaceToolBox,
  WorkspaceContext
} from "../components";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginBottom: theme.spacing(2),
    overflow: "hidden",
  },
  moreMargin: {
    marginBottom: theme.spacing(4),
  },
}));


const Home = (props: any) => {
  const classes = useStyles();
  const router = useRouter();
  const refreshWorkspaces = () => router.replace(router.asPath)
  return <WorkspaceContext.Provider value={{ refreshWorkspaces, ...props }}>
    <MainMenu />
    <Box p={1} className="verticalFit">
      <Grid container={true}>
        <Grid item={true} xs={12} sm={12} md={6} container={true} className="leftContainer">
          <Grid item={true} xs={12}>
            <Paper className={classes.paper} elevation={0}>
              <Banner />
            </Paper>
          </Grid>
          <Grid item={true} xs={12}>
            <Paper className={classes.paper} elevation={0}>
              <Box p={3} >
                <WorkspaceToolBox refreshWorkspaces={refreshWorkspaces} />
              </Box>
            </Paper>
          </Grid>
          <Grid item={true} xs={12} className="verticalFit">
            <Paper className={classes.moreMargin} elevation={0}>
              <Box p={3} height="36vh">
                <Latest />
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={6} container={true} alignItems="stretch">
          <Box pl={2} width={1}>
            <Workspaces />
          </Box>
        </Grid>
      </Grid>
    </Box>
  </WorkspaceContext.Provider>
};



export async function getServerSideProps(context: AppContext) {
  // Extract cookies from AppContext
  const cookies = parseCookies(context?.ctx?.req);

  const keycloak = getKeycloakInstance(keycloakCfg, SSRCookies(cookies));
  const publicWorkspaces = await workspaceService.fetchWorkspaces(true);
  // console.log("Cookies: ", cookies)
  // console.log("Token: ", keycloak.token)
  let userWorkspaces = null;
  if (keycloak.token) {
    workspaceService.initApis(keycloak.token)
    userWorkspaces = await workspaceService.fetchWorkspaces(false)
  }

  return {
    props: {
      publicWorkspaces,
      userWorkspaces,
    }

  }
}

export default Home;
