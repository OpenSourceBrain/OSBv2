import * as React from "react";

import makeStyles from '@mui/styles/makeStyles';
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ShowMoreText from "react-show-more-text";

import {
  Tag,
  OSBRepository,
  RepositoryContentType,
  RepositoryType,
} from "../../apiclient/workspaces";
import RepositoryActionsMenu from "./RepositoryActionsMenu";
import { UserInfo } from "../../types/user";
import searchFilter from "../../types/searchFilter";
import {
  bgRegular,
  bgDarkest,
  paragraph,
  bgLightest,
  radius,
  textColor,
  linkColor,
} from "../../theme";
import RepositoriesSearch from "./RepositoriesSearch";
import { CodeBranchIcon } from "../icons";
import Resources from "./resources";

interface RepositoriesProps {
  repositories: OSBRepository[];
  showSimpleVersion?: boolean;
  handleRepositoryClick: (repository: Repository) => void;
  handleTagClick: (tagObject: Tag) => void;
  handleTagUnclick: (tagObject: Tag) => void;
  handleTypeClick: (type: string) => void;
  handleTypeUnclick: (type: string) => void;
  searchFilterValues: searchFilter;
  user?: UserInfo;
  searchRepositories?: boolean;
  filterChanged?: (filter: string) => void;
  refreshRepositories?: () => void;
}

const useStyles = makeStyles((theme) => ({
  repositoryData: {
    display: "flex",
    flexDirection: "column",
    paddingRight: 0,
    overflow: "auto",
    "& .MuiGrid-container": {
      flex: 0,
    },
    backgroundColor: bgDarkest,
    "& strong": {
      display: "block",
      marginBottom: theme.spacing(1),
      fontSize: ".88rem",
      letterSpacing: "0.02rem",
      fontWeight: "500",
      lineHeight: 1.5,
    },
    "& p": {
      overflow: "hidden",
      fontSize: ".88rem",
      letterSpacing: "0.01rem",
      color: paragraph,
      [theme.breakpoints.down('sm')]: {
        marginBottom: theme.spacing(1),
      },
    },

    "& .col": {
      borderWidth: 0,
      "& .MuiSvgIcon-root": {
        color: paragraph,
      },
      "& .MuiAvatar-root": {
        width: ".5rem",
        height: "auto",
      },
      "& .repo-user": {
        width: theme.spacing(3),
        height: "3.0ex",
      },
      [theme.breakpoints.down('sm')]: {
        paddingTop: theme.spacing(0),
        paddingBottom: theme.spacing(0),
      },
      [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(1),
      },
      [theme.breakpoints.up("md")]: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
      },
    },
    "& .row": {
      borderWidth: `1px 0 1px 0`,
      borderStyle: "solid",
      borderColor: bgRegular,
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      "& .MuiChip-root": {
        backgroundColor: "#3c3c3c",
        color: paragraph,
      },
      "& .repo-tag": {
        color: textColor,
      },
      "& .MuiButtonBase-root": {
        minWidth: "11.5rem",
        marginRight: "1.312rem",
      },
      "& .MuiChip-clickable": {
        minWidth: "unset",
        marginRight: "unset",
        "&:hover": {
          backgroundColor: bgDarkest,
        },
      },
      "&:hover": {
        backgroundColor: bgRegular,
        cursor: "pointer",
        "& strong": {
          textDecoration: "underline",
        },
      },
      "& .MuiGrid-root": {
        "&:first-child": {
          "& .col": {
            paddingLeft: 0,
          },
        },
        "&:last-child": {
          "& .col": {
            paddingRight: 0,
            minHeight: 120,
            justifyContent: "flex-end",
            flexDirection: "row",
            alignItems: "center",
            [theme.breakpoints.down('lg')]: {
              paddingLeft: 0,
            },
            [theme.breakpoints.down('sm')]: {
              marginTop: theme.spacing(2),
            },
            [theme.breakpoints.down('md')]: {
              "& .MuiButton-outlined": {
                flexGrow: 1,
              },
            },
          },
        },
      },
      [theme.breakpoints.down('md')]: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
      },
    },
  },
  repositoryActionsBox: {
    display: "flex",
    "& .MuiButtonBase-root": {
      minWidth: `${theme.spacing(2)} !important`,
    },
    "& .MuiIconButton-root": {
      marginLeft: theme.spacing(1),
      "& .MuiIconButton-label": {
        width: "fit-content",
      },
    },
  },
  searchBox: {
    background: bgLightest,
    padding: theme.spacing(2),
    borderTopLeftRadius: radius,
    borderTopRightRadius: radius,
  },
  showMoreText: {
    color: paragraph,
    "& a": {
      color: linkColor,
      display: "flex",
      textDecoration: "none",
      "& .MuiSvgIcon-root": {
        color: `${linkColor} !important`,
      },
    },
  },
}));

export default (props: RepositoriesProps) => {
  const classes = useStyles();
  const openRepoUrl = (uri: string) => window.open(uri, "_blank");
  const showSimpleVersion =
    typeof props.showSimpleVersion === "undefined"
      ? false
      : props.showSimpleVersion;
  const searchRepositories =
    typeof props.searchRepositories === "undefined"
      ? false
      : props.searchRepositories;
  const [expanded, setExpanded] = React.useState(false);
  const gridRef = React.useRef(null);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleTagClick = (tagObject: Tag) => {
    props.handleTagClick(tagObject);
  };
  const handleTagUnclick = (tagObject: Tag) => {
    props.handleTagUnclick(tagObject);
  };

  const handleTypeClick = (type: string) => {
    props.handleTypeClick(type);
  };

  const handleTypeUnclick = (type: string) => {
    props.handleTypeUnclick(type);
  };

  return (
    <>
      {searchRepositories && (
        <Box className={classes.searchBox}>
          <RepositoriesSearch
            filterChanged={(newFilter) => props.filterChanged(newFilter)}
          />
        </Box>
      )}
      <Box className={`${classes.repositoryData} scrollbar verticalFill`}>
        {props.repositories.map((repository) => (
          <Grid
            container={true}
            className="repos-list row"
            spacing={0}
            key={repository.id}
          >
            <Grid
              item={true}
              xs={12}
              sm={3}
              lg={showSimpleVersion ? 5 : 4}
              ref={gridRef}
              className="name-repo-list-item"
            >
              <Box
                className="col"
                onClick={(e: any) => {
                  console.log(e);
                  if (e.target.tagName.toLowerCase() !== "a")
                    props.handleRepositoryClick(repository);
                }}
              >
                <Typography component="strong">{repository.name}</Typography>
                {repository.summary && (
                  <ShowMoreText
                    className={classes.showMoreText}
                    lines={4}
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
                    width={
                      gridRef.current !== null
                        ? gridRef.current.clientWidth
                        : 100
                    }
                  >
                    {repository.summary}
                  </ShowMoreText>
                )}
              </Box>
            </Grid>

            {!showSimpleVersion && (
              <Grid
                item={true}
                xs={12}
                sm={2}
                lg={1}
                className="avatar-repo-list-item"
              >
                <Box className="col">
                  {
                    // TODO: use user avatar, but repository.user does not include an avatar property
                  }
                  <Chip
                    avatar={
                      <Avatar alt="user-profile-avatar" className="repo-user">
                        {(repository.user.firstName.length > 0 &&
                          repository.user.firstName.charAt(0)) +
                          (repository.user.lastName.length > 0 &&
                            repository.user.lastName.charAt(0))}
                      </Avatar>
                    }
                    label={
                      repository?.user?.firstName +
                      " " +
                      repository?.user?.lastName
                    }
                    onClick={() =>
                      window.open(`/user/${repository?.user?.id}`, "_self")
                    }
                  />
                </Box>
              </Grid>
            )}
            {!showSimpleVersion && (
              <Grid
                item={true}
                xs={12}
                sm={3}
                lg={2}
                className="url-repo-list-item"
              >
                <Box className="col" display="flex" alignItems="center">
                  <Button
                    onClick={() => {
                      openRepoUrl(repository.uri);
                      props.handleRepositoryClick(repository.id);
                    }}
                  >
                    {/* TODO: use Icons once we have themed icons for Figshare/Dandi */}
                    {Resources[repository.repositoryType] ||
                      repository.repositoryType}
                  </Button>
                </Box>
              </Grid>
            )}

            {
              <Grid
                item={true}
                xs={12}
                sm={showSimpleVersion ? 3 : 2}
                lg={showSimpleVersion ? 4 : 3}
                className="tags-repo-list-item"
              >
                <Box display="flex" alignItems="center" flexWrap="wrap">
                  {repository.contentTypes.split(",").map((type, index) => {
                    if (
                      props.searchFilterValues &&
                      props.searchFilterValues.types.includes(type)
                    ) {
                      return (
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
                          key={type}
                          label={type}
                          onDelete={() => handleTypeUnclick(type)}
                          clickable={true}
                        />
                      );
                    } else {
                      return (
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
                          key={type}
                          label={type}
                          onClick={() => handleTypeClick(type)}
                          clickable={true}
                        />
                      );
                    }
                  })}
                  {repository.tags &&
                    repository.tags.map((tagObject, index) => {
                      if (
                        props.searchFilterValues &&
                        props.searchFilterValues.tags.includes(tagObject.tag)
                      ) {
                        return (
                          <Chip
                            className="repo-tag"
                            key={tagObject.id}
                            label={tagObject.tag}
                            onClick={() => handleTagClick(tagObject)}
                            clickable={true}
                            onDelete={(event) => handleTagUnclick(tagObject)}
                          />
                        );
                      } else {
                        return (
                          <Chip
                            className="repo-tag"
                            key={tagObject.id}
                            label={tagObject.tag}
                            onClick={() => handleTagClick(tagObject)}
                            clickable={true}
                          />
                        );
                      }
                    })}
                </Box>
              </Grid>
            }
            <Grid
              item={true}
              xs={12}
              sm={3}
              lg={1}
              onClick={() => props.handleRepositoryClick(repository.id)}
              className="gitBranch-repo-list-item"
            >
              <Box display="flex" alignItems="center" flexWrap="wrap">
                {repository.defaultContext && (
                  <Chip
                    avatar={<CodeBranchIcon />}
                    key={repository.defaultContext}
                    label={repository.defaultContext}
                  />
                )}
              </Box>
            </Grid>
            <Grid
              item={true}
              xs={12}
              sm={showSimpleVersion ? 1 : 3}
              lg={1}
              className="arrow-repo-list-item"
            >
              <Box className="col" display="flex" flex={1} alignItems="center">
                <Avatar
                  src="/images/arrow_right.svg"
                  onClick={() => props.handleRepositoryClick(repository.id)}
                />
              </Box>
              {props.user && !showSimpleVersion && (
                <Box className={classes.repositoryActionsBox}>
                  <RepositoryActionsMenu
                    repository={repository}
                    user={props.user}
                    onAction={props.refreshRepositories}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        ))}
      </Box>
    </>
  );
};
