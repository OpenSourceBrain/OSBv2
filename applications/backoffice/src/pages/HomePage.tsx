import * as React from "react";
import Cookies from 'js-cookie'

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';

import makeStyles from '@mui/styles/makeStyles';

import { initApis, getUsers } from  "../service/UserService";
import { UserInfo } from '../types/user';
import WorkspaceService from "../service/WorkspaceService"
import RepositoryService from "../service/RepositoryService";

import SearchFilter from '../types/searchFilter';

const BIG_NUMBER_OF_ITEMS = 5000;

const useStyles = makeStyles((theme) => ({
  paper: {
    overflow: "hidden",
  },

}));

export default (props: any) => {
  const classes = useStyles();
  const [ users, setUsers ] = React.useState<any[]>(null);
  const [ workspaces, setWorkspaces ] = React.useState<any>(null);
  const [ repositories, setRepositories ] = React.useState<any>(null);

  const fetchInfo = () => {
    // Initialise APIs with token
    const token = Cookies.get('accessToken');
    if (token !== "undefined") {
      initApis(token);

      /* Does not require logging in */
      getUsers().then((userlist) => {
        setUsers(userlist);
      });

      /* Requires user to be logged in, and to be admin to see all workspaces */
      WorkspaceService.fetchWorkspaces(null, null, 1, BIG_NUMBER_OF_ITEMS).then((workspaceList) => {
        setWorkspaces(workspaceList.items);
      })

      /* Does not require logging in */
      RepositoryService.getRepositories(1, BIG_NUMBER_OF_ITEMS, null).then((repositoryList) => {
        setRepositories(repositoryList);
      })
    }
  };

  const getUserRepos = (userid: string) => {
    return repositories.filter((repository: any) => {
      return repository.userId === userid;
    })
  }

  const getUserWorkspaces = (userid: string) => {
    return workspaces.filter((workspace: any) => {
      return workspace.user.id === userid;
    })
  }

  React.useEffect(() => {
    fetchInfo();
  }, [ ]);

  if (users === null){
    return <>
      Error: Could not fetch information. Please login and retry.
    </>
  }

  // Get hostname without sub-domain
  const getHostname = () => {
    const hostname = window.location.hostname.split('.');
    hostname.shift();
    return "https://" + hostname.join('.');
  }

  // TODO: allow table sorting by fields
  // https://mui.com/material-ui/react-table/#sorting-amp-selecting
  const table =
      <>
        Summary: { `${users.length} users` } { workspaces !== null ? ` ${workspaces.length} workspaces,` : "? workspaces," } { repositories !== null ? ` and ${repositories.length} repositories.` : "? repositories." }
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Groups</TableCell>
                <TableCell>Workspaces</TableCell>
                <TableCell>Repositories</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users && users.map((auser: UserInfo) => (
                <TableRow
                  key={auser.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {auser.firstName + " " + auser.lastName}
                  </TableCell>
                  <TableCell><Link target="_blank" href={`${getHostname()}/user/${auser.id}`}>{auser.username}</Link></TableCell>
                  <TableCell>N/A</TableCell>
                  <TableCell>{ workspaces !== null ? `${getUserWorkspaces(auser.id).length}` : "?" }</TableCell>
                  <TableCell>{ repositories !== null ? `${getUserRepos(auser.id).length}` : "?" }</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>

  return <>
    <Box p={1}>
      {table}
    </Box>
  </>
};
