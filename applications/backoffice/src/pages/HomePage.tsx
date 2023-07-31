import * as React from "react";
import Cookies from 'js-cookie'

import Box from "@mui/material/Box";
import Link from '@mui/material/Link';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';

import makeStyles from '@mui/styles/makeStyles';

import { initApis, getUsers } from  "../service/UserService";
import { UserInfo } from '../types/user';
import WorkspaceService from "../service/WorkspaceService"
import RepositoryService from "../service/RepositoryService";

const BIG_NUMBER_OF_ITEMS = 5000;



export default (props: any) => {

  const [ users, setUsers ] = React.useState<any[]>(null);
  const [ workspaces, setWorkspaces ] = React.useState<any>(null);
  const [ repositories, setRepositories ] = React.useState<any>(null);
  const [ error, setError ] = React.useState<any>(null);

  let realm = "osb2"
  if (window.location.hostname.includes("local")) {
    realm = "osblocal"
  } else if (window.location.hostname.includes("dev")) {
    realm = "osb2dev"
  }

  const fetchInfo = () => {
    // Initialise APIs with token
    const token = Cookies.get('accessToken');
    if (token !== "undefined") {
      initApis(token);

      /* Does not require logging in */
      getUsers().then((userlist) => {
        setUsers(userlist);
        setError(null);
      }, (e) => setError(e));

      /* Requires user to be logged in, and to be admin to see all workspaces */
      WorkspaceService.fetchWorkspaces(null, null, 1, BIG_NUMBER_OF_ITEMS).then((workspaceList) => {
        setWorkspaces(workspaceList.items);
        setError(null);
      }, (e) => setError(e))

      /* Does not require logging in */
      RepositoryService.getRepositories(1, BIG_NUMBER_OF_ITEMS, null).then((repositoryList) => {
        setRepositories(repositoryList);
        setError(null);
      }, (e) => setError(e))
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

  // Get hostname without sub-domain
  const getHostname = (subdomain: string) => {
    const hostname = window.location.hostname.split('.');
    hostname.shift();
    if (subdomain === "") {
      return "https://" + hostname.join('.');
    }
    else {
      return "https://" + subdomain + "." + hostname.join('.');
      }
  }

  const keycloakBaseUrl = React.useMemo(() => {

    return "/auth/admin/master/console/#/realms/" + realm + "/users/";
  }, [realm]);

  // for links to profiles
  const osbProfile = "/user/";

  const getDataGridData = () => {
    const gridData: any = [];
    users.forEach((auser) => {
      const arow: any = {
        id: auser.id,
        name: auser.firstName + " " + auser.lastName,
        username: auser.username,
        registration_date: auser.registrationDate,
        groups: auser.groups,
        workspaces: getUserWorkspaces(auser.id).length,
        repositories: getUserRepos(auser.id).length
      }
      gridData.push(arow);
    })

    return gridData;
  }

  const dataColumns: GridColDef[] = [
    {
      field: 'id', headerName: 'Profile', renderCell: (param: any) =>
      <>
        <Link href={`${getHostname("")}${osbProfile}${param.value}`} target="_blank"> OSB </Link>
        &nbsp;|&nbsp;
        <Link href={`${getHostname("accounts")}${keycloakBaseUrl}${param.value}`} target="_blank"> KeyCloak </Link>
      </>,
      minWidth: 50, flex: 2,
    },
    {
      field: 'name', headerName: 'Name',
      minWidth: 50, flex: 2,
    },
    {
      field: 'username', headerName: 'Username',
      minWidth: 50, flex: 2,
    },
    {
      field: 'registration_date', headerName: 'Registration date',
      minWidth: 50, flex: 4,
    },
    {
      field: 'groups', headerName: 'Groups',
      minWidth: 50, flex: 2,
    },
    {
      field: 'workspaces', headerName: 'Workspaces',
      minWidth: 50, flex: 1,
    },
    {
      field: 'repositories', headerName: 'Repositories',
      minWidth: 50, flex: 1,
    }
  ]

  return <>
    { (error !== null) ? <>"An error occured: " { error }</> : (users === null || workspaces === null || repositories === null) ? <CircularProgress /> :
      <Box p={1} style={{ height: '100%', overflow: 'auto' }}>
        Summary: { `${users.length} users` } { workspaces !== null ? ` ${workspaces.length} workspaces,` : "? workspaces," } { repositories !== null ? ` and ${repositories.length} repositories.` : "? repositories." }
        <div style={{ height: '100%', width: '100%' }}>
          <DataGrid
            rows={getDataGridData()}
            columns={dataColumns}
            autoHeight={true}
            rowsPerPageOptions={[20, 50, 100]}
          />
        </div>
      </Box>
      }
  </>
};
