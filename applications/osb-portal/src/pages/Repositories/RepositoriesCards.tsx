import * as React from "react";

// components
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Card from "@mui/material/Card";
import Link from "@mui/material/Link";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";

import { TagTooltip } from "../../components/workspace/WorkspaceCard";
import CircularProgress from "@mui/material/CircularProgress";

// style
import { paragraph, chipTextColor, chipBg, textColor } from "../../theme";
import styled from "@mui/system/styled";

// icons
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

import { CodeBranchIcon, RepositoriesCardIcon, GithubCardIcon, FigshareCardIcon, DandiArchiveCardIcon } from "../../components/icons";

//types
import { OSBRepository, RepositoryType } from "../../apiclient/workspaces";
import { UserInfo } from "../../types/user";

//utils
import { formatDate } from "../../utils";
import RepositoryActionsMenu from "../../components/repository/RepositoryActionsMenu";
import CardTitle from "../../components/styled/CardTitle";
import Grid from "@mui/material/Grid";
import CardFooter from "../../components/styled/CardFooter";
import { useNavigate } from "react-router-dom";
import { refreshRepositories } from "../../store/actions/repositories";

interface RepositoriesProps {
  repositories: OSBRepository[];
  user?: UserInfo;
  loading: boolean;
  handleRepositoryClick: (repository: OSBRepository) => void;
  refreshRepositories: () => void;
}

export const StyledContextChip = styled(Chip)((theme) => ({
  background: chipBg,
  borderRadius: "16px",
  maxWidth: "5.5rem",
  overflow: "hidden",
  color: chipTextColor,
  fontSize: "0.857rem",
  padding: "0.143rem",
}));

export const RepositoriesListCards = (props: RepositoriesProps) => {
  const { repositories, loading, handleRepositoryClick, refreshRepositories } =
    props;

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
                  <Card className={`workspace-card`} elevation={0}>
                      <RepositoryActionsMenu
                        repository={repository}
                        user={props.user}
                        onAction={refreshRepositories}
                      />
                    <CardContent>

                      <Box
                        className="imageContainer"
                        justifyContent="center"
                        alignItems="center"
                        display="flex"
                        mb={2}
                        overflow="hidden"
                        flex="1"
                        sx={{
                          backgroundImage: repository.thumbnail && `url(/proxy/workspaces/${repository.thumbnail}?v=${repository.timestampUpdated.getMilliseconds()})`,
                          backgroundSize: "cover",
                        }}
                        onClick={() => handleRepositoryClick(repository)}
                      >
                        {
                          !repository.thumbnail && (
                            repository.repositoryType === RepositoryType.Github ? (
                              <GithubCardIcon />
                            ) : repository.repositoryType === RepositoryType.Figshare ? (
                              <FigshareCardIcon />
                            ) : repository.repositoryType === RepositoryType.Dandi ? (
                              <DandiArchiveCardIcon />
                            ) : (<RepositoriesCardIcon />)
                          )
                        }
                      </Box>

                      <Box sx={{ px: 1, py: 0 }}>
                        <Box display="flex">
                          <Tooltip title={repository.name}>
                            <Link
                              href={`/repositories/${repository.id}`}
                              className={`workspace-page-link`}
                              underline="none"
                              color="secondary"
                              sx={{ minWidth: 0 }}
                            >
                              <CardTitle mb={"4px"}>
                                {repository.name}
                              </CardTitle>
                            </Link>
                          </Tooltip>
                          {repository.tags.length > 0 && (
                            <TagTooltip
                              title={
                                <>
                                  {repository.tags.map((tagObject) => (
                                    <Chip
                                      size="small"
                                      label={tagObject.tag}
                                      key={tagObject.id}
                                      sx={{
                                        margin: "0px 2px 0px 2px",
                                        backgroundColor: chipBg,
                                        color: textColor,
                                      }}
                                    />
                                  ))}
                                </>
                              }
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
                        </Box>
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
                      </Box>
                    </CardContent>
                    <Box sx={{ px: 1, pb: 1 }}>
                      <CardFooter variant="caption">
                        <Button
                          className="repoType"
                          endIcon={<OpenInNewIcon />}
                          onClick={() => openRepoUrl(repository.uri)}
                        >
                          <span>{repository.repositoryType}</span>
                        </Button>

                        <Tooltip
                          title={
                            <span style={{ textTransform: "capitalize" }}>
                              {repository.defaultContext}
                            </span>
                          }
                        >
                          <>{repository.defaultContext}</>
                        </Tooltip>
                      </CardFooter>
                    </Box>
                  </Card>
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
