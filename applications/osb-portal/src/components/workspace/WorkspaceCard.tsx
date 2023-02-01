import * as React from "react";

import makeStyles from "@mui/styles/makeStyles";
import withStyles from "@mui/styles/withStyles";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import FolderIcon from "@mui/icons-material/Folder";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

import { Workspace } from "../../types/workspace";
import { formatDate } from "../../utils";
import { UserInfo } from "../../types/user";
import { WorkspaceActionsMenu } from "..";
import {
  bgDarkest,
  paragraph,
  textColor,
  chipBg,
  chipTextColor,
} from "../../theme";

import CardTitle from "../common/CardTitle";
import CardFooter from "../common/CardFooter";

interface Props {
  workspace: Workspace;
  updateWorkspace?: (ws: Workspace) => any;
  deleteWorkspace?: (wsId: number) => any;
  user?: UserInfo;
  refreshWorkspaces?: () => any;
  hideMenu?: boolean;
  handleWorkspaceClick?: (workspace: Workspace) => any;
  [k: string]: any;
}

export const TagTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: bgDarkest,
    color: textColor,
  },
  arrow: {
    color: bgDarkest,
  },
}))(Tooltip);

export const WorkspaceCard = (props: Props) => {
  const workspace: Workspace = props.workspace;

  return (
    <>
      <Card className={`workspace-card`} elevation={0}>
        <WorkspaceActionsMenu
          workspace={workspace}
          showButton={true}
        />

        <CardContent>
          <Box
            className="imageContainer"
            justifyContent="center"
            alignItems="center"
            display="flex"
            mb={2}
            onClick={() => props.handleWorkspaceClick(workspace)}
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
                <CardTitle mb={"4px"}>{workspace.name}</CardTitle>
                {workspace.tags.length > 0 && (
                  <TagTooltip
                    title={workspace.tags.map((tagObject) => {
                      return (
                        <Chip
                          size="small"
                          label={tagObject.tag}
                          key={tagObject.id}
                          sx={{
                            color: textColor,
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
                {workspace.user.firstName + " " + workspace.user.lastName}
              </Typography>
            </Link>
          </Box>
        </CardContent>
        <Box sx={{ padding: "0.429rem 0.857rem 0.857rem 0.857rem" }}>
          <CardFooter variant="caption">
            <span>{formatDate(workspace?.timestampUpdated)}</span>
            <span>{workspace?.defaultApplication?.name}</span>
          </CardFooter>
        </Box>
      </Card>
    </>
  );
};

export default WorkspaceCard;
