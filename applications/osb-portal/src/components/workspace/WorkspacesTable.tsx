import * as React from "react";
import { useHistory } from "react-router-dom";

// components
import Chip from "@mui/material/Chip";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import Tooltip from "@mui/material/Tooltip";

import CircularProgress from "@mui/material/CircularProgress";
import { StyledSpan } from "../../pages/Repositories/RepositoriesCards";

// style
import { chipTextColor } from "../../theme";

// icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import { CodeBranchIcon } from "../icons";

//types
import {
  OSBRepository,
  RepositoryContentType,
  Tag,
} from "../../apiclient/workspaces";
import { UserInfo } from "../../types/user";
import searchFilter from "../../types/searchFilter";
import {
  StyledShowMoreText,
  StyledTableContainer,
  StyledContextButton,
} from "../../pages/Repositories/RespositoriesTable";
import { Workspace } from "../../types/workspace";

interface RepositoriesProps {
  workspaces: Workspace[];
  handleWorkspaceClick: (workspace: Workspace) => void;
  handleTagClick: (tagObject: Tag) => void;
  handleTagUnclick: (tagObject: Tag) => void;
  handleTypeClick: (type: string) => void;
  handleTypeUnclick: (type: string) => void;
  searchFilterValues: searchFilter;
  user?: UserInfo;
  loading: boolean;
}

export const WorkspacesList = (props: RepositoriesProps) => {
  const {
    workspaces,
    handleTagClick,
    handleTypeClick,
    handleTypeUnclick,
    handleTagUnclick,
    loading,
    searchFilterValues,
    handleWorkspaceClick,
  } = props;

  const history = useHistory();

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
        <Box
          className="verticalFill"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <StyledTableContainer>
            <Table aria-label="simple table">
              <TableBody>
                {workspaces &&
                  workspaces.map((row) => (
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
                            <StyledShowMoreText
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
                            </StyledShowMoreText>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell style={{ minWidth: 80 }}>
                        <Button
                          sx={{
                            "&:hover": { backgroundColor: "transparent" },
                            textTransform: "capitalize",
                            color: chipTextColor,
                          }}
                          onClick={() => history.push(`/user/${row?.user?.id}`)}
                        >
                          {row.user.username}
                        </Button>
                      </TableCell>
                      <TableCell style={{ minWidth: 100 }}>
                        <Button
                          sx={{
                            textTransform: "capitalize",
                            "&:hover": { backgroundColor: "transparent" },
                          }}
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
                                searchFilterValues?.types?.includes(type)
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
                                searchFilterValues?.tags?.includes(
                                  tagObject.tag
                                )
                                  ? () => handleTagUnclick(tagObject)
                                  : null
                              }
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell style={{ minWidth: 100 }}>
                        <StyledContextButton startIcon={<CodeBranchIcon />}>
                          <Tooltip
                            title={
                              <span style={{ textTransform: "capitalize" }}>
                                {row.defaultContext}
                              </span>
                            }
                          >
                            <StyledSpan>{row.defaultContext}</StyledSpan>
                          </Tooltip>
                        </StyledContextButton>
                      </TableCell>
                      <TableCell style={{ width: 100 }}>
                        <Button
                          variant="outlined"
                          onClick={() => handleWorkspaceClick(row)}
                        >
                          Open Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Box>
      )}
    </>
  );
};

export default WorkspacesList;
