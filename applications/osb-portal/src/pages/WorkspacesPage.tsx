import * as React from "react";
import { ReactElement } from "react";
import debounce from "lodash/debounce";
import { useNavigate, useSearchParams } from "react-router-dom";

//components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";
import WindowIcon from "@mui/icons-material/Window";
import ListIcon from "@mui/icons-material/List";
import Chip from "@mui/material/Chip";
import WorkspacesCards from "../components/workspace/WorkspacesCards";
import SearchFilterReposWorkspaces from "../components/common/SearchFilterReposWorkspaces";

import {
  StyledActiveIconButton,
  StyledGrid,
  StyledIconButton,
} from "./Repositories/RepositoriesPage";

//style
import { bgLightest as lineColor, bgRegular, bgDark, bgDarker } from "../theme";

//types
import { Workspace } from "../types/workspace";
import { WorkspaceSelection } from "../components/workspace/WorkspacesCards";
import searchFilter from "../types/searchFilter";

//services
import workspaceService from "../service/WorkspaceService";
import WorkspacesList from "../components/workspace/WorkspacesTable";
import { Tag } from "../apiclient/workspaces";
import OSBPagination from "../components/common/OSBPagination";
import { UserInfo } from "../types/user";
import Paper from "@mui/material/Paper";
import { WorkspaceToolBox } from "../components";

interface WorkspacesPageProps {
  user: UserInfo;
  counter: number;
}

export const WorkspacesPage = (props: WorkspacesPageProps) => {
  const navigate = useNavigate();
  const [searchParams, ] = useSearchParams();

  const [searchFilterValues, setSearchFilterValues] =
    React.useState<searchFilter>({
      text: searchParams.get("q"),
      tags: searchParams.getAll("tags"),
      types: searchParams.getAll("types"),
    });

  const [workspaces, setWorkspaces] = React.useState<Workspace[]>(null);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [tabValue, setTabValue] = React.useState(
    props.user ? WorkspaceSelection.USER : WorkspaceSelection.FEATURED
  );
  const [listView, setListView] = React.useState<string>("grid");
  const isPublic = tabValue === WorkspaceSelection.PUBLIC || true;
  const isFeatured = tabValue === WorkspaceSelection.FEATURED;

  const getTabValue = () => {
    if (tabValue) {
      return { isPublic, isFeatured };
    } else {
      return { isPublic: false, isFeatured: false };
    }
  };

  const isSearchFieldsEmpty =
    searchFilterValues.tags.length === 0 &&
    searchFilterValues.types.length === 0 &&
    (typeof searchFilterValues.text === "undefined" ||
      searchFilterValues.text === "");

  const openWorkspaceUrl = (workspaceId: number) => {
    navigate(`/workspaces/${workspaceId}`);
  };


  const debouncedHandleSearchFilter = (newTextFilter: string) => {
    setSearchFilterValues({
      ...searchFilterValues,
      text: newTextFilter,
    });

    debounce(() => {
      getWorkspacesList({ searchFilterValues: { ...searchFilterValues, text: newTextFilter } });
    }, 500);
  };




  const setWorkspacesValues = (workspacesDetails) => {
    setWorkspaces(workspacesDetails.items);
    setTotal(workspacesDetails.total);
    setTotalPages(workspacesDetails.totalPages);
    setLoading(false);
  };

  const getWorkspacesList = (payload?) => {
    setLoading(true);

    const tabs = getTabValue();

    if (payload?.searchFilterValues) {
      workspaceService
        .fetchWorkspacesByFilter(
          tabs.isPublic,
          tabs.isFeatured,
          page,
          searchFilterValues
        )
        .then((workspacesDetails) => {
          setWorkspacesValues(workspacesDetails);
        });
    } else {
      workspaceService
        .fetchWorkspaces(tabs.isPublic, tabs.isFeatured, page)
        .then((workspacesDetails) => {
          setWorkspacesValues(workspacesDetails);
        });
    }
  };

  const handleTabChange = (event: any, newValue: WorkspaceSelection) => {
    setTotal(0);
    setTabValue(newValue);
  };

  const changeListView = (type: string) => {
    setListView(type);
  };

  const handleChangePage = (event: unknown, current: number) => {
    setPage(current);
  };

  const CustomButton = ({
    listType,
    Icon,
  }: {
    listType: string;
    Icon: ReactElement;
  }) => {
    if (listType === listView) {
      return (
        <StyledActiveIconButton onClick={() => changeListView(listType)}>
          {Icon}
        </StyledActiveIconButton>
      );
    } else {
      return (
        <StyledIconButton onClick={() => changeListView(listType)}>
          {Icon}
        </StyledIconButton>
      );
    }
  };

  React.useEffect(() => {
    if (isSearchFieldsEmpty) {
      getWorkspacesList();
    } else {
      getWorkspacesList({ searchFilterValues });
    }
  }, [page, searchFilterValues, tabValue, props.counter]);

  return (
    <>
      <div id="workspaces-list" className="verticalFit">
        <Box borderBottom={`1px solid ${lineColor}`}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={4}
            sx={{
              pb: {
                sm: 2,
                lg: 0,
              },
            }}
          >
            <Grid
              container={true}
              alignItems="center"
              className="verticalFill"
              spacing={1}
            >
              <Grid
                item={true}
                xs={12}
                sm={12}
                md={12}
                lg={7}
                className="verticalFill"
              >
                <Tabs value={tabValue} onChange={handleTabChange}>
                  {props.user ? (
                    <Tab
                      id="your-all-workspaces-tab"
                      value={WorkspaceSelection.USER}
                      label={
                        props.user.isAdmin ? (
                          <div className="tabTitle">
                            <Typography>All workspaces</Typography>
                            {tabValue === WorkspaceSelection.USER && (
                              <Chip
                                size="small"
                                color="primary"
                                label={total}
                              />
                            )}
                          </div>
                        ) : (
                          <div className="tabTitle">
                            <Typography>My workspaces</Typography>
                            {tabValue === WorkspaceSelection.USER && (
                              <Chip
                                size="small"
                                color="primary"
                                label={total}
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
                    label={
                      <div className="tabTitle">
                        <Typography>Featured workspaces</Typography>
                        {tabValue === WorkspaceSelection.FEATURED && (
                          <Chip size="small" color="primary" label={total} />
                        )}
                      </div>
                    }
                  />
                  <Tab
                    id="public-tab"
                    value={WorkspaceSelection.PUBLIC}
                    label={
                      <div className="tabTitle">
                        <Typography>Public workspaces</Typography>
                        {tabValue === WorkspaceSelection.PUBLIC && (
                          <Chip size="small" color="primary" label={total} />
                        )}
                      </div>
                    }
                  />
                </Tabs>
              </Grid>
              <Grid item={true} xs={12} sm={12} md={12} lg={5}>
                <ButtonGroup
                  sx={{
                    backgroundColor: bgRegular,
                    padding: "4px",
                    borderRadius: "8px",
                    marginRight: "0.571rem",
                  }}
                  disableElevation
                  variant="contained"
                  aria-label="Disabled elevation buttons"
                >
                  <CustomButton Icon={<WindowIcon />} listType="grid" />
                  <CustomButton Icon={<ListIcon />} listType="list" />
                </ButtonGroup>
                <SearchFilterReposWorkspaces
                  filterChanged={(newTextFilter) =>
                    debouncedHandleSearchFilter(newTextFilter)
                  }
                  searchFilterValues={searchFilterValues}
                  setSearchFilterValues={setSearchFilterValues}
                  hasTypes={false}
                  setLoading={setLoading}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {workspaces?.length === 0 && props.user ? (
          <Box display="flex" alignContent="center" alignItems="center" justifyContent="center" flex="1"sx={{ backgroundColor: bgDarker}}>
          <Paper sx={{px: 6, py: 6, maxWidth:700, borderRadius: "16px", backgroundColor: bgDark }}>
            <WorkspaceToolBox
            title="Create your first workspace"
              closeMainDialog={(isClosed) => null}
            />
          </Paper></Box>) : (
          listView === "grid" ? (
            <WorkspacesCards workspaces={workspaces} loading={loading} handleWorkspaceClick={(workspace: Workspace) =>
              openWorkspaceUrl(workspace.id)
            } />
          ) : (
            <WorkspacesList
              workspaces={workspaces}
              handleWorkspaceClick={(workspace: Workspace) =>
                openWorkspaceUrl(workspace.id)
              }
              handleTagClick={(tag: Tag) =>
                searchFilterValues.tags.includes(tag.tag)
                  ? null
                  : setSearchFilterValues({
                      ...searchFilterValues,
                      tags: searchFilterValues.tags.concat(tag.tag),
                    })
              }
              handleTagUnclick={(tag: Tag) =>
                setSearchFilterValues({
                  ...searchFilterValues,
                  tags: searchFilterValues.tags.filter((t) => t !== tag.tag),
                })
              }
              handleTypeClick={(type: string) =>
                setSearchFilterValues({
                  ...searchFilterValues,
                  types: searchFilterValues.types.concat(type),
                })
              }
              handleTypeUnclick={(type: string) =>
                setSearchFilterValues({
                  ...searchFilterValues,
                  types: searchFilterValues.types.filter((t) => t !== type),
                })
              }
              searchFilterValues={searchFilterValues}
              loading={loading}
              user={props?.user}
            />
          )
        ) 
        
        }
      </div>
      {workspaces && totalPages > 1 && (
        <OSBPagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          showFirstButton
          showLastButton
        />
      )}
    </>
  );
};
