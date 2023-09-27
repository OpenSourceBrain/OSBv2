import * as React from "react";
import debounce from "lodash/debounce";
import { ReactElement } from "react";

//components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";

import RepositoriesCards from "./RepositoriesCards";
import RepositoriesTable from "../../components/repository/RespositoriesTable";
import SearchFilterReposWorkspaces from "../../components/common/SearchFilterReposWorkspaces";
import Chip from "@mui/material/Chip";
import OSBPagination from "../../components/common/OSBPagination";

//Icons
import WindowIcon from "@mui/icons-material/Window";
import IconButton from "@mui/material/IconButton";
import ListIcon from "@mui/icons-material/List";

//types
import { UserInfo } from "../../types/user";
import { OSBRepository, Tag } from "../../apiclient/workspaces";
import searchFilter from "../../types/searchFilter";

//hooks
import { useNavigate } from "react-router-dom";

//api
import RepositoryService from "../../service/RepositoryService";

//style
import {
  bgLightest as lineColor,
  bgRegular,
  checkBoxColor,
  bgDarker,
  linkColor,
  primaryColor,
} from "../../theme";
import styled from "@mui/system/styled";

enum RepositoriesTab {
  all,
  my,
}

const customButtonStyle = {
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
};

export const StyledIconButton = styled(IconButton)(() => customButtonStyle);

export const StyledActiveIconButton = styled(IconButton)(() => ({
  ...customButtonStyle,
  backgroundColor: bgDarker,
  color: linkColor,

  "&:hover": {
    backgroundColor: bgDarker,
  },
}));

export const StyledTabs = styled(Tab)(() => ({}));

export const StyledGrid = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    padding: "12px 24px !important",
  },
}));

export const RepositoriesPage = ({
  user,
  counter,
}: {
  user: UserInfo;
  counter: number;
}) => {
  const navigate = useNavigate();
  const [searchFilterValues, setSearchFilterValues] =
    React.useState<searchFilter>({
      text: undefined,
      tags: [],
      types: [],
    });
  const [repositories, setRepositories] = React.useState<OSBRepository[]>([]);
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [tabValue, setTabValue] = React.useState(RepositoriesTab.all);
  const [listView, setListView] = React.useState<string>("list");

  

  const openRepoUrl = (repositoryId: number) => {
    navigate(`/repositories/${repositoryId}`);
  };

  const debouncedHandleSearchFilter = debounce((newTextFilter: string) => {
    setSearchFilterValues({ ...searchFilterValues, text: newTextFilter });
  }, 500);

  const setReposValues = (reposDetails) => {
    setRepositories(reposDetails.osbrepositories);
    setTotal(reposDetails.pagination.total);
    setTotalPages(reposDetails.pagination.numberOfPages);
    setLoading(false);
  };

  const updateReposList = () => {
    const isSearchFieldsEmpty =
    searchFilterValues.tags.length === 0 &&
    searchFilterValues.types.length === 0 &&
    (typeof searchFilterValues.text === "undefined" ||
      searchFilterValues.text === "");
    setLoading(true);
    if (!isSearchFieldsEmpty) {
      const myReposFilter = tabValue ? {...searchFilterValues, user_id: user.id} : searchFilterValues

      RepositoryService.getRepositoriesByFilter(
        page,
        myReposFilter
      ).then((reposDetails) => {
        setReposValues(reposDetails);
      });
    } else if (tabValue) {
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

  const handleRefreshRepositories = () => {
    updateReposList();
  }

  const handleTabChange = (event: any, newValue: RepositoriesTab) => {
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
  React.useEffect(updateReposList, [page, searchFilterValues, tabValue, counter]);

  return (
    <>
      <Box width={1} className="verticalFit">
        <div id="repositories-list" className="verticalFit">
          <Box borderBottom={`1px solid ${lineColor}`} >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              px={4}
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
                  md={7}
                  lg={7}
                  className="verticalFill"
                >
                  <Tabs value={tabValue} onChange={handleTabChange}>
                    <StyledTabs
                      value={RepositoriesTab.all}
                      label={
                        <div className="tabTitle">
                          <Typography>All repositories</Typography>
                          {tabValue === RepositoriesTab.all && (
                            <Chip size="small" color="primary" label={total} />
                          )}
                        </div>
                      }
                    />
                    {user && (
                      <StyledTabs
                        value={RepositoriesTab.my}
                        label={
                          <div className="tabTitle">
                            <Typography>My repositories</Typography>
                            {tabValue === RepositoriesTab.my && (
                              <Chip
                                size="small"
                                color="primary"
                                label={total}
                              />
                            )}
                          </div>
                        }
                      />
                    )}
                  </Tabs>
                </Grid>
                <StyledGrid item={true} xs={12} sm={8} md={5} lg={5}>
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
                    hasTypes={true}
                    setLoading={setLoading}
                  />
                </StyledGrid>
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
              user={user}
              repositories={repositories}
              loading={loading}
            />
          ) : (
            <RepositoriesCards
              handleRepositoryClick={(repository: OSBRepository) =>
                openRepoUrl(repository.id)
              }
              user={user}
              repositories={repositories}
              loading={loading}
              refreshRepositories={handleRefreshRepositories}
            />
          )}
        </div>
        {repositories && totalPages > 1 && (
          <OSBPagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            showFirstButton={true}
            showLastButton={true}
          />
        )}
      </Box>
    </>
  );
};

export default RepositoriesPage;
