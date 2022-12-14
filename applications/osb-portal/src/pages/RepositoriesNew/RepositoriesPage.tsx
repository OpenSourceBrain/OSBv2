import * as React from "react";
import debounce from "lodash/debounce";

//components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";

import { HomePageSider } from "../../components";
import RepositoriesCards from "./RepositoriesCards";
import RepositoriesTable from "./RespositoriesTable";
import SearchReposWorkspaces from "../../components/common/SearchReposWorkspaces";

//Icons
import WindowIcon from "@mui/icons-material/Window";
import IconButton from "@mui/material/IconButton";
import ListIcon from "@mui/icons-material/List";

//types
import { UserInfo } from "../../types/user";
import { OSBRepository, Tag } from "../../apiclient/workspaces";
import searchFilter from "../../types/searchFilter";

//hooks
import { useHistory } from "react-router-dom";

//api
import RepositoryService from "../../service/RepositoryService";

//style
import {
  bgLightest as lineColor,
  bgRegular,
  checkBoxColor,
  bgDarker,
  linkColor,
} from "../../theme";
import makeStyles from "@mui/styles/makeStyles";

import clsx from "clsx";

enum RepositoriesTab {
  all,
  my,
}

let firstTimeFiltering = true;

const useStyles = makeStyles((theme) => ({
  tab: {
    maxWidth: "33%",
    minWidth: "fit-content",
    padding: "16px 24px",
  },
  tabTitle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "& .MuiTypography-root": {
      fontSize: "0.857rem",
      fontWeight: 700,
    },
  },
  listTypeBtn: {
    minWidth: "auto",
    padding: "5px",
    backgroundColor: bgRegular,
    border: "none !important",
    color: checkBoxColor,
    borderRadius: "8px",

    "&:hover": {
      backgroundColor: bgRegular,
      color: linkColor,
    },
  },
  activeTabBtn: {
    backgroundColor: bgDarker,
    color: linkColor,
  },
}));

export const RepositoriesPage = ({ user }: { user: UserInfo }) => {
  const history = useHistory();
  const [searchFilterValues, setSearchFilterValues] =
    React.useState<searchFilter>({
      text: undefined,
      tags: [],
      types: [],
    });
  const classes = useStyles();

  const [repositories, setRepositories] = React.useState<OSBRepository[]>([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [tabValue, setTabValue] = React.useState(RepositoriesTab.all);
  const [listView, setListView] = React.useState<string>("grid");

  const isSearchFieldsEmpty =
    searchFilterValues.tags.length === 0 &&
    searchFilterValues.types.length === 0 &&
    (typeof searchFilterValues.text === "undefined" ||
      searchFilterValues.text === "");

  const openRepoUrl = (repositoryId: number) => {
    history.push(`/repositories/${repositoryId}`);
  };

  const updateList = (newTabValue: RepositoriesTab = tabValue) => {
    setRepositories(null);
    setTabValue(newTabValue);
    getReposList({ newTabValue });
  };

  const debouncedHandleSearchFilter = React.useCallback(
    debounce((newTextFilter: string) => {
      setSearchFilterValues({ ...searchFilterValues, text: newTextFilter });
    }, 500),
    []
  );

  const setReposValues = (reposDetails) => {
    if (listView === "grid" && isSearchFieldsEmpty) {
      setLoading(false);
      setRepositories([...repositories, ...reposDetails.osbrepositories]);
    } else {
      setRepositories(reposDetails.osbrepositories);
    }
    setTotal(reposDetails.pagination.total);
    setTotalPages(reposDetails.pagination.numberOfPages);
    setLoading(false);
  };

  const getReposList = (payload?) => {
    if (payload?.searchFilterValues) {
      RepositoryService.getRepositoriesByFilter(
        page,
        payload?.searchFilterValues
      ).then((reposDetails) => {
        setReposValues(reposDetails);
      });
    } else if (payload?.tabValue) {
      RepositoryService.getUserRepositoriesDetails(user.id, page).then(
        (reposDetails) => {
          setReposValues(reposDetails);
        }
      );
    } else {
      RepositoryService.getRepositoriesDetails(page).then((reposDetails) => {
        setReposValues(reposDetails);
      });
    }
  };

  const handleTabChange = (event: any, newValue: RepositoriesTab) => {
    updateList(newValue);
  };

  const changeListView = (type: string) => {
    setListView(type);
  };

  React.useEffect(() => {
    if (isSearchFieldsEmpty) {
      setLoading(true);

      getReposList();
    } else {
      setLoading(true);

      getReposList({ searchFilterValues, tabValue });
    }
  }, [page, searchFilterValues, tabValue]);

  return (
    <>
      <Box className="verticalFit">
        <Grid container={true} className="verticalFill">
          <Grid
            item={true}
            xs={12}
            sm={12}
            md={3}
            lg={2}
            direction="column"
            className="verticalFill"
          >
            <Box width={1} className="verticalFit">
              <HomePageSider />
            </Box>
          </Grid>
          <Grid
            item={true}
            xs={12}
            sm={12}
            md={9}
            lg={10}
            alignItems="stretch"
            className="verticalFill"
          >
            <Box width={1} className="verticalFit">
              <div id="workspaces-list" className="verticalFit">
                <Box borderBottom={`2px solid ${lineColor}`} pr="1.714rem">
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid
                      container={true}
                      alignItems="center"
                      className="verticalFill"
                    >
                      <Grid
                        item={true}
                        xs={12}
                        sm={12}
                        md={7}
                        lg={7}
                        className="verticalFill"
                      >
                        <Tabs value={tabValue} onChange={handleTabChange}>
                          <Tab
                            label={
                              <div className={classes.tabTitle}>
                                <Typography>All repositories</Typography>
                              </div>
                            }
                            className={classes.tab}
                          />
                          {user && (
                            <Tab
                              label={
                                <div className={classes.tabTitle}>
                                  <Typography>My repositories</Typography>
                                </div>
                              }
                              className={classes.tab}
                            />
                          )}
                        </Tabs>
                      </Grid>
                      <Grid
                        item={true}
                        xs={12}
                        sm={12}
                        md={1}
                        lg={1}
                        className="verticalFill"
                      >
                        <ButtonGroup
                          sx={{
                            backgroundColor: bgRegular,
                            padding: "4px",
                            borderRadius: "8px",
                          }}
                          disableElevation
                          variant="contained"
                          aria-label="Disabled elevation buttons"
                        >
                          <IconButton
                            onClick={() => changeListView("grid")}
                            className={
                              listView === "grid"
                                ? clsx(
                                    classes.listTypeBtn,
                                    classes.activeTabBtn
                                  )
                                : classes.listTypeBtn
                            }
                          >
                            <WindowIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => changeListView("list")}
                            className={
                              listView === "list"
                                ? clsx(
                                    classes.listTypeBtn,
                                    classes.activeTabBtn
                                  )
                                : classes.listTypeBtn
                            }
                          >
                            <ListIcon />
                          </IconButton>
                        </ButtonGroup>
                      </Grid>
                      <Grid
                        item={true}
                        xs={12}
                        sm={12}
                        md={4}
                        lg={4}
                        className="verticalFill"
                      >
                        <SearchReposWorkspaces
                          filterChanged={(newTextFilter) =>
                            debouncedHandleSearchFilter(newTextFilter)
                          }
                          searchFilterValues={searchFilterValues}
                          setSearchFilterValues={setSearchFilterValues}
                          hasTypes={true}
                          setLoading={setLoading}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </Box>

                {listView === "list" ? (
                  <RepositoriesTable
                    handleRepositoryClick={(repository: OSBRepository) =>
                      openRepoUrl(repository.id)
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
                        tags: searchFilterValues.tags.filter(
                          (t) => t !== tag.tag
                        ),
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
                        types: searchFilterValues.types.filter(
                          (t) => t !== type
                        ),
                      })
                    }
                    searchFilterValues={searchFilterValues}
                    user={user}
                    setPage={setPage}
                    page={page}
                    total={total}
                    totalPages={totalPages}
                    repositories={repositories}
                    loading={loading}
                  />
                ) : (
                  <RepositoriesCards
                    user={user}
                    setPage={setPage}
                    page={page}
                    total={total}
                    totalPages={totalPages}
                    repositories={repositories}
                    loading={loading}
                  />
                )}
              </div>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default RepositoriesPage;
