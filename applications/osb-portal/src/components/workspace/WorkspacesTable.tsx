import * as React from "react";
import { useNavigate } from "react-router-dom";

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
import { StyledContextChip } from "../../pages/Repositories/RepositoriesCards";

// style
import { chipTextColor } from "../../theme";

// icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";


//types
import { RepositoryContentType, Tag } from "../../apiclient/workspaces";
import { UserInfo } from "../../types/user";
import searchFilter from "../../types/searchFilter";
import {
  StyledShowMoreText,
  StyledTableContainer,
} from "../styled/Tables";
import { Workspace } from "../../types/workspace";

interface WorkspacesProps {
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

export const WorkspacesList = (props: WorkspacesProps) => {
  const {
    workspaces,
    handleTagClick,
    handleTagUnclick,
    loading,
    searchFilterValues,
    handleWorkspaceClick,
  } = props;

  const navigate = useNavigate();

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
                        <Box
                          className="col"
                          sx={{ display: "flex", flexDirection: "column" }}
                        >
                          <Typography variant="h5" component="h2">{row.name}</Typography>
                          {row.description && (
                            <StyledShowMoreText
                              lines={2}
                              more={
                                <span className="seemore">
                                  See more <ExpandMoreIcon fontSize="small" />
                                </span>
                              }
                              less={<span className="seemore">
                                  See less <ExpandLessIcon fontSize="small"  />
                                  </span>
                              }
                              onClick={handleExpandClick}
                              expanded={expanded}
                            >
                              {row.description}
                            </StyledShowMoreText>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ minWidth: 200 }}>
                        <Button
                          sx={{
                            "&:hover": { backgroundColor: "transparent" },
                            textTransform: "capitalize",
                            color: chipTextColor,
                          }}
                          onClick={() => navigate(`/user/${row?.user?.id}`)}
                        >
                          {row.user.firstName + " " + row.user.lastName}
                        </Button>
                      </TableCell>
                      <TableCell >
                        <Typography>
                        Last updated on {row.timestampUpdated.toLocaleDateString()}
                        </Typography>
                        
                      </TableCell>

                      <TableCell sx={{ minWidth: 200 }}>
                        <Box>
                          {row.tags.map((tagObject) => (
                            <Chip
                              className="repo-tag"
                              onClick={() => handleTagClick(tagObject)}
                              key={tagObject.id}
                              label={tagObject.tag}
                              clickable={true}
                              onDelete={
                                searchFilterValues?.tags?.map((tag) =>
                                  tag.toLowerCase()).includes(tagObject.tag.toLowerCase())
                                  ? () => handleTagUnclick(tagObject)
                                  : null
                              }
                            />
                          ))}
                        </Box>
                      </TableCell>
                      <TableCell style={{ minWidth: 100 }}>
                        <Tooltip
                          title={
                            <span style={{ textTransform: "capitalize" }}>
                              {row?.defaultApplication?.name}
                            </span>
                          }
                        >
                          <StyledContextChip
                            label={row.defaultApplication?.name}
                          />
                        </Tooltip>
                      </TableCell>
                     <TableCell sx={{ width: "12em", pr: 4, textAlign: "right" }}>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={() => handleWorkspaceClick(row)}
                        >
                          Open Workspace
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
