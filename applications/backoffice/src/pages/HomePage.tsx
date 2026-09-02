import * as React from "react";

import Box from "@mui/material/Box";
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';

import { initApis, getToken, getUsers } from "../service/UserService";
import { User, GetUsersSortByEnum, GetUsersSortOrderEnum } from "../apiclient/accounts";
import WorkspaceService from "../service/WorkspaceService";
import RepositoryService from "../service/RepositoryService";
import SearchFilter from "../types/searchFilter";

const DEFAULT_PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 350;

// Latest registered users first; also the backend's default ordering.
const DEFAULT_SORT_MODEL: GridSortModel = [{ field: "registration_date", sort: "desc" }];

// Grid columns whose sorting is delegated to the backend.
const SORT_FIELD_MAP: { [field: string]: GetUsersSortByEnum } = {
  registration_date: GetUsersSortByEnum.RegistrationDate,
  username: GetUsersSortByEnum.Username,
  name: GetUsersSortByEnum.Name,
};

interface UserCounts {
  workspaces?: number;
  repositories?: number;
}

export default (props: any) => {

  const [users, setUsers] = React.useState<User[]>(null);
  const [rowCount, setRowCount] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(0); // DataGrid pages are 0-based
  const [pageSize, setPageSize] = React.useState<number>(DEFAULT_PAGE_SIZE);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<any>(null);

  const [searchInput, setSearchInput] = React.useState<string>("");
  const [search, setSearch] = React.useState<string>("");

  const [sortModel, setSortModel] = React.useState<GridSortModel>(DEFAULT_SORT_MODEL);

  // Per-user workspace/repository counts, loaded lazily after each page renders.
  const [counts, setCounts] = React.useState<{ [userId: string]: UserCounts }>({});
  // Cheap grand totals for the summary line.
  const [totals, setTotals] = React.useState<{ workspaces?: number; repositories?: number }>({});

  const [ready, setReady] = React.useState<boolean>(false);

  let realm = "osb2";
  if (window.location.hostname.includes("local")) {
    realm = "osblocal";
  } else if (window.location.hostname.includes("dev")) {
    realm = "osb2dev";
  }

  // Set up the API clients from the gatekeeper token once on mount.
  React.useEffect(() => {
    initApis();
    if (getToken()) {
      setReady(true);
    } else {
      setError("You are not logged in.");
    }
  }, []);

  // Debounce the search box, resetting to the first page on a new query.
  React.useEffect(() => {
    const handle = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchInput]);

  // Fetch a single page of users server-side whenever paging, search or sorting changes.
  React.useEffect(() => {
    if (!ready) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    // An empty sort model (third click on a header) falls back to the default.
    const sortItem = sortModel.length > 0 ? sortModel[0] : DEFAULT_SORT_MODEL[0];
    const sortBy = SORT_FIELD_MAP[sortItem.field];
    const sortOrder = sortItem.sort === "asc" ? GetUsersSortOrderEnum.Asc : GetUsersSortOrderEnum.Desc;
    getUsers(page + 1, pageSize, search, sortBy, sortOrder).then(
      (result) => {
        if (cancelled) {
          return;
        }
        setUsers(result.users);
        setRowCount(result.total);
        setCounts({}); // drop counts from the previous page
        setError(null);
        setLoading(false);
      },
      (e) => {
        if (cancelled) {
          return;
        }
        setError(e);
        setLoading(false);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [ready, page, pageSize, search, sortModel]);

  // Lazily load per-user workspace/repository counts for the current page.
  React.useEffect(() => {
    if (!users || users.length === 0) {
      return;
    }
    let cancelled = false;

    users.forEach((user) => {
      const userId = user.id;

      const wsFilter: SearchFilter = { user_id: userId };
      WorkspaceService.fetchWorkspacesByFilter(false, false, 1, wsFilter, 1).then(
        (res) => {
          if (cancelled) {
            return;
          }
          setCounts((prev) => ({ ...prev, [userId]: { ...prev[userId], workspaces: res.total } }));
        },
        () => { /* leave the count blank on error */ }
      );

      RepositoryService.getUserRepositoriesDetails(userId, 1, 1).then(
        (res) => {
          if (cancelled) {
            return;
          }
          setCounts((prev) => ({ ...prev, [userId]: { ...prev[userId], repositories: res.pagination?.total ?? 0 } }));
        },
        () => { /* leave the count blank on error */ }
      );
    });

    return () => {
      cancelled = true;
    };
  }, [users]);

  // Cheap grand totals for the summary (one lightweight request each).
  React.useEffect(() => {
    if (!ready) {
      return;
    }
    WorkspaceService.fetchWorkspaces(false, false, 1, 1).then(
      (res) => setTotals((prev) => ({ ...prev, workspaces: res?.total })),
      () => { /* ignore */ }
    );
    RepositoryService.getRepositoriesDetails(1, 1).then(
      (res) => setTotals((prev) => ({ ...prev, repositories: res.pagination?.total })),
      () => { /* ignore */ }
    );
  }, [ready]);

  // Get hostname without sub-domain
  const getHostname = (subdomain: string) => {
    const hostname = window.location.hostname.split('.');
    hostname.shift();
    if (subdomain === "") {
      return "https://" + hostname.join('.');
    }
    return "https://" + subdomain + "." + hostname.join('.');
  };

  const keycloakBaseUrl = React.useMemo(() => {
    return "/auth/admin/master/console/#/realms/" + realm + "/users/";
  }, [realm]);

  // for links to profiles
  const osbProfile = "/user/";

  const displayName = (user: User) =>
    [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || user.email || "—";

  const getDataGridData = () => {
    if (!users) {
      return [];
    }
    return users.map((auser) => ({
      id: auser.id,
      name: displayName(auser),
      username: auser.username,
      registration_date: auser.registrationDate,
      groups: auser.groups,
      workspaces: counts[auser.id]?.workspaces,
      repositories: counts[auser.id]?.repositories,
    }));
  };

  const renderCount = (value: any) =>
    value === undefined ? <CircularProgress size={14} /> : value;

  const dataColumns: GridColDef[] = [
    {
      field: 'id', headerName: 'Profile', sortable: false, renderCell: (param: any) =>
        <>
          <Link href={`${getHostname("")}${osbProfile}${param.value}`} target="_blank"> OSB </Link>
          &nbsp;|&nbsp;
          <Link href={`${getHostname("accounts")}${keycloakBaseUrl}${param.value}`} target="_blank"> KeyCloak </Link>
        </>,
      minWidth: 50, flex: 2,
    },
    { field: 'name', headerName: 'Name', minWidth: 50, flex: 2 },
    { field: 'username', headerName: 'Username', minWidth: 50, flex: 2 },
    { field: 'registration_date', headerName: 'Registration date', minWidth: 50, flex: 4 },
    { field: 'groups', headerName: 'Groups', sortable: false, minWidth: 50, flex: 2 },
    {
      field: 'workspaces', headerName: 'Workspaces', sortable: false,
      minWidth: 50, flex: 1, renderCell: (param: any) => renderCount(param.value),
    },
    {
      field: 'repositories', headerName: 'Repositories', sortable: false,
      minWidth: 50, flex: 1, renderCell: (param: any) => renderCount(param.value),
    },
  ];

  if (error !== null) {
    return <Box p={2}>An error occured: {String(error?.message || error)}</Box>;
  }

  return (
    <Box p={1} style={{ height: '100%', overflow: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} gap={2}>
        <span>
          Summary: {`${rowCount} users`}
          {totals.workspaces !== undefined ? `, ${totals.workspaces} workspaces` : ", … workspaces"}
          {totals.repositories !== undefined ? ` and ${totals.repositories} repositories.` : " and … repositories."}
        </span>
        <TextField
          size="small"
          variant="outlined"
          label="Search users"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </Box>
      <div style={{ height: '100%', width: '100%' }}>
        <DataGrid
          rows={getDataGridData()}
          columns={dataColumns}
          autoHeight={true}
          loading={loading}
          paginationMode="server"
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={(newSortModel) => { setSortModel(newSortModel); setPage(0); }}
          rowCount={rowCount}
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => { setPageSize(newPageSize); setPage(0); }}
          rowsPerPageOptions={[20, 50, 100]}
          disableSelectionOnClick={true}
        />
      </div>
    </Box>
  );
};
