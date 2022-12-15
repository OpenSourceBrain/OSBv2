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

// style
import {
  paragraph,
  chipTextColor,
  chipBg,
  textColor,
  lightWhite,
  cardIconFill,
} from "../../theme";
import styled from "@mui/system/styled";

// icons
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

import { ContextIcon, RepositoriesCardIcon } from "../../components/icons";

//types
import { OSBRepository } from "../../apiclient/workspaces";
import { UserInfo } from "../../types/user";

//utils
import { formatDate } from "../../utils";
import RepositoryActionsMenu from "../../components/repository/RepositoryActionsMenu";

interface RepositoriesProps {
  repositories: OSBRepository[];
  user?: UserInfo;
  loading: boolean;
}

const StyledCard = styled(Card)(() => ({
  flex: 1,
  minHeight: `17em`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRadius: "8px",

  "& .actions": {
    lineHeight: "0",
    justifyContent: "flex-end",
    height: "35px",

    "& .MuiSvgIcon-root": {
      fontSize: "1.5rem",
      cursor: "pointer",
    },
  },
  "& .imageContainer": {
    overflow: "hidden",
    height: "100px",
    margin: "0 0 auto",

    "& .MuiSvgIcon-root": {
      fontSize: "5em",
      fill: cardIconFill,
    },
  },
  "& .workspace-page-link": {
    display: "flex",
    width: "fit-content",
    maxWidth: "100%",
    justifyContent: "center",
  },

  "&:hover": {
    "& .imageContainer": {
      "& .MuiSvgIcon-root": {
        fill: "white",
      },
    },

    "& .workspace-page-link": {
      borderBottom: "1px solid white",
    },
  },
}));

const StyledRepositoryTags = styled(Typography)(() => ({
  fontSize: ".857rem",
  color: chipTextColor,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  "& .MuiSvgIcon-root": {
    fontSize: ".857rem",
  },

  "& .MuiButtonBase-root": {
    textTransform: "capitalize",
    padding: "4px 12px",
    color: chipTextColor,
    fontWeight: 400,
    justifyContent: "flex-start",

    "&:hover": {
      backgroundColor: "transparent",
    },
  },

  "& .context": {
    alignItems: "baseline",
    background: chipBg,
    borderRadius: "16px",
    padding: "4px 12px",
    maxWidth: "135px",
    height: "30px",
    overflow: "hidden",
  },
}));

export const RepositoriesListCards = (props: RepositoriesProps) => {
  const { repositories, loading } = props;

  const openRepoUrl = (uri: string) => window.open(uri, "_blank");

  return (
    <>
      {loading ? (
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
        <Box className={`verticalFit card-container`}>
          <Grid
            container
            spacing={1}
            sx={{ paddingLeft: "24px", paddingRight: "18px" }}
            py={4}
          >
            {repositories?.map((repository: OSBRepository, index: number) => {
              return (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3} xl={2}>
                  <StyledCard className={`workspace-card`} elevation={0}>
                    <CardActions className="actions">
                      <RepositoryActionsMenu
                        repository={repository}
                        user={props.user}
                        onAction={() => {}}
                      />
                    </CardActions>
                    <Box
                      className="imageContainer"
                      justifyContent="center"
                      alignItems="center"
                      display="flex"
                    >
                      <RepositoriesCardIcon />
                    </Box>
                    <CardContent>
                      <Tooltip title={repository.name}>
                        <Link
                          href={`/repository/${repository.id}`}
                          className={`workspace-page-link`}
                          underline="none"
                        >
                          <Typography
                            component="h2"
                            variant="h4"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              fontSize: "1rem",
                              color: lightWhite,
                            }}
                            mb={"4px"}
                          >
                            {repository.name}
                          </Typography>
                          {repository.tags.length > 0 && (
                            <TagTooltip
                              title={repository.tags.map((tagObject) => {
                                return (
                                  <Chip
                                    color={textColor}
                                    size="small"
                                    label={tagObject.tag}
                                    key={tagObject.id}
                                    sx={{
                                      margin: "0px 2px 0px 2px",
                                      backgroundColor: chipBg,
                                    }}
                                  />
                                );
                              })}
                              arrow={true}
                              placement="top"
                            >
                              <LocalOfferIcon
                                fontSize="small"
                                sx={{
                                  color: paragraph,
                                  fontSize: "1rem",
                                  alignSelf: "center",
                                  marginLeft: "5px",
                                }}
                              />
                            </TagTooltip>
                          )}
                        </Link>
                      </Tooltip>
                      <Typography
                        variant="caption"
                        sx={{ fontSize: ".857rem", color: chipTextColor }}
                        mb={"4px"}
                      >
                        {formatDate(repository.timestampUpdated)}
                      </Typography>

                      <StyledRepositoryTags variant="caption">
                        <span>
                          <Button
                            endIcon={<OpenInNewIcon />}
                            onClick={() => openRepoUrl(repository.uri)}
                          >
                            {repository.repositoryType}
                          </Button>
                        </span>
                        <span>
                          <Button
                            className="context"
                            startIcon={<ContextIcon />}
                          >
                            {repository.defaultContext}
                          </Button>
                        </span>
                      </StyledRepositoryTags>
                    </CardContent>
                  </StyledCard>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </>
  );
};

export default RepositoriesListCards;
