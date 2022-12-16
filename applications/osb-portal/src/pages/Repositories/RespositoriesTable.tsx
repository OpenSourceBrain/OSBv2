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
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";

import CircularProgress from "@mui/material/CircularProgress";
import ShowMoreText from "react-show-more-text";

// style
import {
  paragraph,
  linkColor,
  chipTextColor,
  chipBg,
  secondaryColor,
  primaryColor,
  lighterWhite,
} from "../../theme";
import styled from "@mui/system/styled";

// icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

import { CodeBranchIcon } from "../../components/icons";

//types
import {
  OSBRepository,
  RepositoryContentType,
  Tag,
} from "../../apiclient/workspaces";
import { UserInfo } from "../../types/user";
import searchFilter from "../../types/searchFilter";

interface RepositoriesProps {
  repositories: OSBRepository[];
  handleRepositoryClick: (repository: OSBRepository) => void;
  handleTagClick: (tagObject: Tag) => void;
  handleTagUnclick: (tagObject: Tag) => void;
  handleTypeClick: (type: string) => void;
  handleTypeUnclick: (type: string) => void;
  searchFilterValues: searchFilter;
  user?: UserInfo;
  loading: boolean;
}

const StyledTableContainer = styled(TableContainer)(() => ({
  "& .MuiChip-root": {
    margin: "0 8px 8px 0",
    backgroundColor: chipBg,
  },
  "& .content-types-tag": {
    color: chipTextColor,
  },
  "& .MuiButtonBase-root": {
    "&:hover": {
      color: secondaryColor,
    },
  },
  "& .MuiButton-outlined": {
    minWidth: "max-content",
    padding: "8px 12px",
    textTransform: "inherit",
    fontSize: "0.857rem",
    color: secondaryColor,
    borderRadius: 8,
    borderWidth: 1,

    "&:hover": {
      borderColor: primaryColor,
      color: `${primaryColor} !important`,
    },
  },
}));

const StyledShowMoreText = styled(ShowMoreText)(() => ({
  color: paragraph,
  marginTop: 8,
  "& a": {
    color: linkColor,
    display: "flex",
    textDecoration: "none",
    "& .MuiSvgIcon-root": {
      color: `${linkColor} !important`,
    },
  },
}));

const StyledContextButton = styled(Button)(() => ({
  color: chipTextColor,
  fontWeight: 400,
  textTransform: "capitalize",
  background: chipBg,
  borderRadius: "16px",
  maxWidth: "5.5rem",
  height: "2rem",
  overflow: "hidden",
  display: "flex",
  justifyContent: "flex-start",
  alightItems: "baseline",

  "& .MuiButton-startIcon": {
    "& .MuiSvgIcon-root": {
      fontSize: ".857rem",
    },
  },

  "&:hover": {
    backgroundColor: lighterWhite,

    "& .MuiButton-startIcon": {
      "& .MuiSvgIcon-root": {
        color: "white",
      },
    },
  },
}));

export const RepositoriesList = (props: RepositoriesProps) => {
  const {
    repositories,
    handleTagClick,
    handleTypeClick,
    handleTypeUnclick,
    handleTagUnclick,
    loading,
    searchFilterValues,
    handleRepositoryClick,
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
                {repositories &&
                  repositories.map((row) => (
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
                          <span>{row.defaultContext}</span>
                        </StyledContextButton>
                      </TableCell>
                      <TableCell style={{ width: 100 }}>
                        <Button
                          variant="outlined"
                          onClick={() => handleRepositoryClick(row)}
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

export default RepositoriesList;
