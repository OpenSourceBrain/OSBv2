import * as React from "react";

// components
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Chip from "@mui/material/Chip";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import Grid from "@mui/material/Grid";

import CircularProgress from "@mui/material/CircularProgress";
import ShowMoreText from "react-show-more-text";

// style
import {
  bgLightest as lineColor,
  paragraph,
  linkColor,
  chipTextColor,
  chipBg,
  secondaryColor,
  primaryColor,
  bgRegular,
  bgInputs,
} from "../../theme";
import makeStyles from "@mui/styles/makeStyles";

// icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import {
  OSBRepository,
  RepositoryContentType,
  Tag,
} from "../../apiclient/workspaces";
import { UserInfo } from "../../types/user";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import searchFilter from "../../types/searchFilter";
import SearchReposWorkspaces from "../../components/common/SearchReposWorkspaces";
import { Pagination } from "@mui/material";

enum RepositoriesTab {
  all,
  my,
}

interface RepositoriesProps {
  repositories: OSBRepository[];
  showSimpleVersion?: boolean;
  handleRepositoryClick: (repository: OSBRepository) => void;
  handleTagClick: (tagObject: Tag) => void;
  handleTagUnclick: (tagObject: Tag) => void;
  handleTypeClick: (type: string) => void;
  handleTypeUnclick: (type: string) => void;
  searchFilterValues: searchFilter;
  user?: UserInfo;
  searchRepositories?: boolean;
  filterChanged?: (filter: string) => void;
  refreshRepositories?: () => void;
  tabValue: RepositoriesTab;
  setTabValue: (tab: RepositoriesTab) => void;
  setPage: (page: number) => void;
  total: number;
  totalPages: number;
  page: number;
  debouncedHandleSearchFilter: (text: string) => void;
  setSearchFilterValues: (searchFilter) => void;
  loading: boolean;
}

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
  showMoreText: {
    color: paragraph,
    marginTop: 8,
    "& a": {
      color: linkColor,
      display: "flex",
      textDecoration: "none",
      "& .MuiSvgIcon-root": {
        color: `${linkColor} !important`,
      },
    },
  },
  repositoryData: {
    "& .MuiChip-root": {
      margin: "0 8px 8px 0",
      backgroundColor: chipBg,
    },
    "& .content-types-tag": {
      color: chipTextColor,
    },
    "& .MuiButtonBase-root": {
      "&:hover": {
        backgroundColor: "transparent",
        color: secondaryColor,
      },
    },
    "& .MuiButton-outlined": {
      minWidth: "max-content",
      padding: "8px 12px",
      textTransform: "inherit",
      fontSize: "0.857rem",
      color: secondaryColor,
      borderRadius: 8,
      borderWidth: 1,

      "&:hover": {
        borderColor: primaryColor,
        color: `${primaryColor} !important`,
      },
    },
  },
  filterButton: {
    borderRadius: "0px 8px 8px 0px",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: "transparent",
    },
    minWidth: "fit-content !important",
    backgroundColor: bgRegular,
    "& .MuiTouchRipple-root:hover": {
      backgroundColor: "transparent",
    },
    "& .MuiSvgIcon-root": {
      fontSize: "1.3rem",
      color: chipTextColor,
    },
    "& .MuiTypography-root": {
      fontSize: "0.857rem",
      color: chipTextColor,
      fontWeight: 500,
    },
  },
  popover: {
    "& .MuiPaper-root": {
      top: "88px !important",
      left: "1023px !important",
      background: chipBg,
      minWidth: "390px !important",
      padding: theme.spacing(3),
      boxShadow: "0px 10px 60px rgba(0, 0, 0, 0.5)",
      "& .MuiSvgIcon-root": {
        cursor: "pointer",
      },
      "& .MuiAutocomplete-root": {
        display: "flex",
        alignItems: "center",
        paddingTop: 0,
        paddingBottom: 0,
        marginBottom: ".88rem",
        "& .MuiSvgIcon-root": {
          marginLeft: theme.spacing(1),
          color: paragraph,
        },
        "& .MuiInputBase-root": {
          paddingLeft: 0,
        },
        "& .MuiFilledInput-root": {
          "&:hover, &:before": {
            backgroundColor: "transparent",
            border: "none",
          },
        },
        "& .Mui-focused": {
          backgroundColor: "transparent",
          border: "none",
        },
      },
    },
  },
  label: {
    color: bgInputs,
    fontWeight: 700,
    fontSize: ".88rem",
    marginBottom: theme.spacing(1),
    display: "inline-block",
  },
}));

export const RepositoriesList = (props: RepositoriesProps) => {
  const classes = useStyles();
  const {
    tabValue,
    setTabValue,
    setPage,
    repositories,
    page,
    handleTagClick,
    handleTypeClick,
    handleTypeUnclick,
    handleTagUnclick,
    debouncedHandleSearchFilter,
    totalPages,
    loading,
  } = props;

  const [expanded, setExpanded] = React.useState(false);
  const handleTabChange = (event: any, newValue: RepositoriesTab) => {
    setTabValue(newValue);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const openRepoUrl = (uri: string) => window.open(uri, "_blank");

  const handleChangePage = (event: unknown, current: number) => {
    setPage(current);
  };

  return (
    <>
      <Box borderBottom={`2px solid ${lineColor}`} pr="1.714rem">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Grid container={true} alignItems="center" className="verticalFill">
            <Grid
              item={true}
              xs={12}
              sm={12}
              md={8}
              lg={8}
              className="verticalFill"
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab
                  label={
                    <div className={classes.tabTitle}>
                      <Typography>All repositories</Typography>
                    </div>
                  }
                  className={classes.tab}
                />
                {props.user && (
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
              md={4}
              lg={4}
              className="verticalFill"
            >
              <SearchReposWorkspaces
                filterChanged={(newTextFilter) =>
                  debouncedHandleSearchFilter(newTextFilter)
                }
                searchFilterValues={props.searchFilterValues}
                setSearchFilterValues={props.setSearchFilterValues}
                hasTypes={true}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>

      {loading && (
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

      {!loading && (
        <Box
          className="verticalFill"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <TableContainer className={classes.repositoryData}>
            <Table aria-label="simple table">
              <TableBody>
                {repositories &&
                  repositories.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        style={{ minWidth: 300 }}
                        component="th"
                        scope="row"
                      >
                        <Box className="col">
                          <Typography component="strong">{row.name}</Typography>
                          {row.summary && (
                            <ShowMoreText
                              className={classes.showMoreText}
                              lines={2}
                              more={
                                <>
                                  See more <ExpandMoreIcon />
                                </>
                              }
                              less={
                                <>
                                  See less
                                  <ExpandLessIcon />
                                </>
                              }
                              onClick={handleExpandClick}
                              expanded={expanded}
                              width={400}
                            >
                              {row.summary}
                            </ShowMoreText>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell style={{ minWidth: 100 }}>
                        {row.user.username}
                      </TableCell>
                      <TableCell style={{ minWidth: 100 }}>
                        <Button
                          sx={{ textTransform: "capitalize" }}
                          endIcon={<OpenInNewIcon />}
                          onClick={() => openRepoUrl(row.uri)}
                        >
                          {row.repositoryType}
                        </Button>
                      </TableCell>
                      <TableCell style={{ minWidth: 200 }}>
                        <Box mb={".5"}>
                          {row.contentTypes.split(",").map((type) => (
                            <Chip
                              avatar={
                                <FiberManualRecordIcon
                                  color={
                                    type === RepositoryContentType.Experimental
                                      ? "primary"
                                      : "secondary"
                                  }
                                />
                              }
                              onClick={() => handleTypeClick(type)}
                              key={type}
                              label={type}
                              clickable={true}
                              className="content-types-tag"
                              onDelete={
                                props.searchFilterValues &&
                                props.searchFilterValues.types.includes(type)
                                  ? () => handleTypeUnclick(type)
                                  : null
                              }
                            />
                          ))}
                        </Box>
                        <Box>
                          {row.tags.map((tagObject) => (
                            <Chip
                              className="repo-tag"
                              onClick={() => handleTagClick(tagObject)}
                              key={tagObject.id}
                              label={tagObject.tag}
                              clickable={true}
                              onDelete={
                                props.searchFilterValues &&
                                props.searchFilterValues.tags.includes(
                                  tagObject.tag
                                )
                                  ? () => handleTagUnclick(tagObject)
                                  : null
                              }
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell style={{ width: 100 }}>
                        <Button
                          variant="outlined"
                          onClick={() => props.handleRepositoryClick(row)}
                        >
                          Open Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {repositories && (
              <Pagination
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "1rem 0",
                }}
                count={totalPages}
                page={page}
                onChange={handleChangePage}
              />
            )}
          </TableContainer>
        </Box>
      )}
    </>
  );
};

export default RepositoriesList;
