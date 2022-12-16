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
import CardActionArea from "@mui/material/CardActionArea";

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

import { CodeBranchIcon, RepositoriesCardIcon } from "../../components/icons";

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
  handleRepositoryClick: (repository: OSBRepository) => void;
}

const StyledCard = styled(Card)(() => ({
  flex: 1,
  maxHeight: `14.286em`,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRadius: "8px",

  "& .actions": {
    lineHeight: "0",
    justifyContent: "flex-end",
    height: "2.5rem",

    "& .MuiSvgIcon-root": {
      fontSize: "1.5rem",
      cursor: "pointer",
    },
  },
  "& .imageContainer": {
    overflow: "hidden",
    minHeight: "80px",
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
    cursor: "pointer",
    "& .imageContainer": {
      "& .MuiSvgIcon-root": {
        fill: "white",
      },
    },

    "& .workspace-page-link": {
      textDecoration: "underline",
      textDecorationColor: "white",
    },
  },
}));

const StyledRepositoryTags = styled(Typography)(() => ({
  lineHeight: 1.143,
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
    padding: "0.286rem 0.857rem 0.286rem 0rem",
    color: chipTextColor,
    fontWeight: 400,
    justifyContent: "flex-start",
  },

  "& .context": {
    alignItems: "baseline",
    background: chipBg,
    borderRadius: "16px",
    padding: "0.286rem 0.857rem",
    maxWidth: "5.5rem",
    height: "2rem",
    overflow: "hidden",
  },
}));

export const RepositoriesListCards = (props: RepositoriesProps) => {
  const { repositories, loading, handleRepositoryClick } = props;

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
            sx={{ paddingLeft: "24px", paddingRight: "18px", flex: "initial" }}
            py={4}
          >
            {repositories?.map((repository: OSBRepository, index: number) => {
              return (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3} xl={2}>
                  <StyledCard
                    className={`workspace-card`}
                    elevation={0}
                    onClick={() => handleRepositoryClick(repository)}
                  >
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
                              lineHeight: "1.429",
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
                        sx={{
                          fontSize: ".857rem",
                          color: chipTextColor,
                          lineHeight: 1.143,
                        }}
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
                            sx={{
                              "&:hover": { backgroundColor: "transparent" },
                            }}
                            className="context"
                            startIcon={<CodeBranchIcon />}
                          >
                            <span>{repository.defaultContext}</span>
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
