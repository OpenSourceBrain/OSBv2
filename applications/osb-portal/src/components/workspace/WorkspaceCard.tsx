import * as React from "react";
import { useNavigate } from "react-router-dom";

import styled from "@mui/system/styled";
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

import CardTitle from "../styled/CardTitle";
import CardFooter from "../styled/CardFooter";

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

export const TagTooltip = styled(Tooltip)((theme) => ({
  tooltip: {
    backgroundColor: bgDarkest,
    color: textColor,
  },
  arrow: {
    color: bgDarkest,
  },
}));

export const WorkspaceCard = (props: Props) => {
  const workspace: Workspace = props.workspace;
  const navigate = useNavigate();

  return (
    <>
      <Card className={`workspace-card`} elevation={0}>
        <WorkspaceActionsMenu workspace={workspace} />

        <CardContent>
          <Box
            className="imageContainer"
            justifyContent="center"
            alignItems="center"
            display="flex"
            mb={2}
            overflow="hidden"
            flex="1"
            onClick={() => props.handleWorkspaceClick(workspace)}
            sx={{
              backgroundImage: workspace.thumbnail && `url(/proxy/workspaces/${workspace.thumbnail}?v=${workspace.timestampUpdated.getMilliseconds()})`,
              backgroundSize: "cover",
            }}
          >
            {!workspace?.thumbnail ? <FolderIcon /> : <Box />}
          </Box>
          <Box sx={{ px: 1, cursor: "pointer" }}>
            <Tooltip title={workspace?.name}>
              <Link
                onClick={() => navigate(`/workspaces/${workspace.id}`)}
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
              onClick={() => navigate(`/user/${workspace.user.username}`)}
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
        <Box sx={{ padding: 1 }}>
          <CardFooter variant="caption">
            <span>
              {workspace?.timestampUpdated.toLocaleDateString("en-UK", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })}
            </span>
            <span>{workspace?.defaultApplication?.name}</span>
          </CardFooter>
        </Box>
      </Card>
    </>
  );
};

export default WorkspaceCard;
