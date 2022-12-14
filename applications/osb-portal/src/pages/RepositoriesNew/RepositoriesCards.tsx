import * as React from "react";

// components
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Link from "@mui/material/Link";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";

import { TagTooltip } from "../../components/workspace/WorkspaceCard";
import CircularProgress from "@mui/material/CircularProgress";
import InfiniteScroll from "react-infinite-scroll-component";

// style
import {
  paragraph,
  chipTextColor,
  chipBg,
  textColor,
  lightWhite,
} from "../../theme";
import makeStyles from "@mui/styles/makeStyles";
import clsx from "clsx";

// icons
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import {
  ContextIcon,
  RepositoriesCardIcon,
  ViewRepositoryCardIcon,
} from "../../components/icons";

//types
import { OSBRepository } from "../../apiclient/workspaces";
import { UserInfo } from "../../types/user";

//utils
import { formatDate } from "../../utils";

interface RepositoriesProps {
  repositories: OSBRepository[];
  user?: UserInfo;
  setPage: (page: number) => void;
  total: number;
  totalPages: number;
  page: number;
  loading: boolean;
}

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    maxHeight: "calc(100% - 55px) !important",
    "& .scrollbar": {
      padding: 0,
      "& .infinite-scroll-component__outerdiv": {
        "& .infinite-scroll-component": {
          overflow: "hidden !important",
        },
      },
    },
  },
  link: {
    display: "flex",
    width: "fit-content",
    maxWidth: "100%",
    justifyContent: "center",
  },
  imageContainer: {
    overflow: "hidden",
    height: "100px",
    margin: "0 0 auto",

    "& .MuiSvgIcon-root": {
      fontSize: "5em",
    },
  },
  card: {
    flex: 1,
    minHeight: `17em`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: "8px",
  },
  imageIcon: {
    fontSize: "7em",
  },
  repoName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "1rem",
    color: lightWhite,
  },
  localOfferIcon: {
    color: paragraph,
    fontSize: "1rem",
    alignSelf: "center",
    marginLeft: "5px",
  },
  captions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    "& .MuiSvgIcon-root": {
      fontSize: ".857rem",
    },
  },
  chip: {
    margin: "0px 2px 0px 2px",
    backgroundColor: "#3c3c3c",
    "& .MuiChip-label": {
      color: textColor,
    },
    actions: {
      lineHeight: "0",
      justifyContent: "flex-end",
    },
  },
  actions: {
    lineHeight: "0",
    justifyContent: "flex-end",
    height: "35px",

    "& .viewAction": {
      display: "none",
      margin: "-12px -9px 0 0",
    },

    "& .MuiSvgIcon-root": {
      fontSize: "1.5rem",
      cursor: "pointer",
    },

    "&:hover": {
      "& .moreAction": {
        display: "none",
      },
      "& .viewAction": {
        display: "block",
      },
    },
  },
  ellipses: {
    fontSize: ".857rem",
    color: chipTextColor,
  },
}));

export const RepositoriesListCards = (props: RepositoriesProps) => {
  const classes = useStyles();
  const { setPage, repositories, page, totalPages, loading } = props;
  const [fetchMore, setFetchMore] = React.useState<boolean>(false);

  const fetchMoreWorkspaces = () => {
    setFetchMore(true);
    setPage(page + 1);
  };
  const openRepoUrl = (uri: string) => window.open(uri, "_blank");

  return (
    <>
      {loading && !fetchMore ? (
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
      ) : (
        <Box className={`verticalFit card-container ${classes.cardContainer}`}>
          <Box pb={1} className="scrollbar" id="workspace-box">
            <InfiniteScroll
              dataLength={repositories.length}
              next={fetchMoreWorkspaces}
              hasMore={page < totalPages}
              loader={
                <Box
                  display="flex"
                  flex={1}
                  px={4}
                  py={4}
                  justifyContent="center"
                  width="100%"
                >
                  <CircularProgress />
                </Box>
              }
              scrollableTarget="workspace-box"
            >
              <Grid
                container
                spacing={1}
                sx={{ paddingLeft: "24px", paddingRight: "18px" }}
                py={4}
              >
                {repositories?.map(
                  (repository: OSBRepository, index: number) => {
                    return (
                      <Grid
                        item
                        key={index}
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        xl={2}
                      >
                        <Card
                          className={`${classes.card} workspace-card`}
                          elevation={0}
                        >
                          <CardActions className={classes.actions}>
                            <ViewRepositoryCardIcon className="viewAction" />

                            <MoreHorizIcon className="moreAction" />
                          </CardActions>
                          <Box
                            className={classes.imageContainer}
                            justifyContent="center"
                            alignItems="center"
                            display="flex"
                          >
                            <RepositoriesCardIcon />
                          </Box>
                          <CardContent>
                            <Tooltip title={repository.name}>
                              <Link
                                href={`/workspace/${repository.id}`}
                                color="inherit"
                                className={`${classes.link} workspace-page-link`}
                                underline="hover"
                              >
                                <Typography
                                  component="h2"
                                  variant="h4"
                                  className={classes.repoName}
                                  mb={"4px"}
                                >
                                  {repository.name}
                                </Typography>
                                {repository.tags.length > 0 && (
                                  <TagTooltip
                                    title={repository.tags.map((tagObject) => {
                                      return (
                                        <Chip
                                          size="small"
                                          label={tagObject.tag}
                                          key={tagObject.id}
                                          className={classes.chip}
                                        />
                                      );
                                    })}
                                    arrow={true}
                                    placement="top"
                                  >
                                    <LocalOfferIcon
                                      fontSize="small"
                                      className={classes.localOfferIcon}
                                    />
                                  </TagTooltip>
                                )}
                              </Link>
                            </Tooltip>
                            <Typography
                              variant="caption"
                              className={classes.ellipses}
                              mb={"4px"}
                            >
                              {formatDate(repository.timestampUpdated)}
                            </Typography>

                            <Typography
                              variant="caption"
                              className={clsx(
                                classes.captions,
                                classes.ellipses
                              )}
                            >
                              <span>
                                <Button
                                  sx={{
                                    textTransform: "capitalize",
                                    padding: 0,
                                    color: chipTextColor,
                                    fontWeight: 400,
                                    justifyContent: "flex-start",
                                  }}
                                  endIcon={<OpenInNewIcon />}
                                  onClick={() => openRepoUrl(repository.uri)}
                                >
                                  {repository.repositoryType}
                                </Button>
                              </span>
                              <span>
                                <Button
                                  sx={{
                                    textTransform: "capitalize",
                                    color: chipTextColor,
                                    fontWeight: 400,
                                    justifyContent: "flex-start",
                                    alignItems: "baseline",
                                    background: chipBg,
                                    borderRadius: "16px",
                                    padding: "4px 12px",
                                    maxWidth: "135px",
                                    height: "30px",
                                    overflow: "hidden",
                                  }}
                                  startIcon={<ContextIcon />}
                                >
                                  {repository.defaultContext}
                                </Button>
                              </span>
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  }
                )}
              </Grid>
            </InfiniteScroll>
          </Box>
        </Box>
      )}
    </>
  );
};

export default RepositoriesListCards;
