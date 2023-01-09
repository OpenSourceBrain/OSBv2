import * as React from "react";

//components
import { Chip, Grid, Box, Typography } from "@mui/material";

//icons
import CircularProgress from "@mui/material/CircularProgress";

import { WorkspaceActionsMenu, WorkspaceCard } from "..";
import { Workspace } from "../../types/workspace";

import Tooltip from "@mui/material/Tooltip";
import Link from "@mui/material/Link";
import { TagTooltip } from "./WorkspaceCard";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { formatDate } from "../../utils";
import CardActions from "@mui/material/CardActions";
import {
  StyledCard,
  StyledCardContent,
  StyledRepoName,
  StyledRepositoryTags,
} from "../../pages/Repositories/RepositoriesCards";
import { paragraph, chipTextColor, chipBg, textColor } from "../../theme";
import FolderIcon from "@mui/icons-material/Folder";

export enum WorkspaceSelection {
  USER,
  PUBLIC,
  FEATURED,
}

export const WorkspacesCards = (props: any) => {
  const { workspaces, loading, handleWorkspaceClick } = props;

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
            {workspaces?.map((workspace: Workspace, index: number) => {
              return (
                <Grid item key={index} xs={12} sm={6} md={4} lg={3} xl={2}>
                  <StyledCard className={`workspace-card`} elevation={0}>
                    <StyledCardContent>
                      <WorkspaceActionsMenu
                        user={props.user}
                        workspace={workspace}
                        isWorkspaceOpen={false}
                      />
                      <Box
                        className="imageContainer"
                        justifyContent="center"
                        alignItems="center"
                        display="flex"
                        mb={2}
                        onClick={() => handleWorkspaceClick(workspace)}
                      >
                        {!workspace?.thumbnail ? (
                          <FolderIcon />
                        ) : (
                          <img
                            width={"100%"}
                            src={
                              "/proxy/workspaces/" +
                              workspace.thumbnail +
                              "?v=" +
                              workspace.timestampUpdated.getMilliseconds()
                            }
                            title={workspace.name}
                            alt={workspace.name}
                          />
                        )}
                      </Box>
                      <Box sx={{ padding: "0 0.857rem", cursor: "pointer" }}>
                        <Tooltip title={workspace?.name}>
                          <Link
                            href={`/workspace/${workspace.id}`}
                            className={`workspace-page-link`}
                            underline="none"
                          >
                            <StyledRepoName mb={"4px"}>
                              {workspace.name}
                            </StyledRepoName>
                            {workspace.tags.length > 0 && (
                              <TagTooltip
                                title={workspace.tags.map((tagObject) => {
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
                        <Link
                          sx={{
                            "&:hover": {
                              textDecoration: "underline",
                              textDecorationColor: chipTextColor,
                            },
                          }}
                          underline="none"
                          href={`/user/${workspace.user.id}`}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: ".857rem",
                              color: chipTextColor,
                              lineHeight: 1.143,
                            }}
                            mb={"4px"}
                          >
                            {workspace.user.firstName +
                              " " +
                              workspace.user.lastName}
                          </Typography>
                        </Link>
                      </Box>
                    </StyledCardContent>
                    <CardActions
                      sx={{ padding: "0.429rem 0.857rem 0.857rem 0.857rem" }}
                    >
                      <StyledRepositoryTags variant="caption">
                        <span>{formatDate(workspace?.timestampUpdated)}</span>
                        <span>{workspace?.defaultApplication?.name}</span>
                      </StyledRepositoryTags>
                    </CardActions>
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

export default WorkspacesCards;
