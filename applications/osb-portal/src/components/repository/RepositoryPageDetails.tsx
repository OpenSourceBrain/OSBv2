import * as React from "react";

//theme
import { styled } from "@mui/styles";
import {
  paragraph,
  chipBg,
  bgRegular as lineColor,
  checkBoxColor as chipTextColor,
  bgInputs,
  repoPageContentBg,
  infoBoxBg,
  inputRadius,
  greyishTextColor,
  badgeBgLight,
} from "../../theme";

//components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import InputAdornment from "@mui/material/InputAdornment";
import TableContainer from "@mui/material/TableContainer";
import prettyBytes from "pretty-bytes";
import TableHead from "@mui/material/TableHead";

//icons
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import LanOutlinedIcon from "@mui/icons-material/LanOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";

//types
import {
  OSBRepository,
  RepositoryContentType,
  RepositoryResourceNode,
} from "../../apiclient/workspaces";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Resources from "./resources";
import { EditRepoDialog } from "..";
import { UserInfo } from "../../types/user";
import { canEditRepository } from "../../service/UserService";
import RepositoryMarkdownViewer from "./RepositoryMarkdownViewer";

const RepoDetailsIconButton = styled(IconButton)(({ theme }) => ({
  "&:hover": {
    background: "transparent",
  },
  "& .MuiSvgIcon-root": {
    color: paragraph,
    width: 16,
    height: 16,
  },
}));

const RepoDetailsChip = styled(Chip)(({ theme }) => ({
  margin: 0,
  background: chipBg,
  color: chipTextColor,
}));

const RepoDetailsSearchField = styled(TextField)(({ theme }) => ({
  background: lineColor,
  borderRadius: "8px",
  marginRight: "3px",
  flex: 1,
  "& .MuiInputBase-root.MuiOutlinedInput-root": {
    borderRadius: "8px",
    fontSize: "0.857rem",
  },
  "& .MuiInputBase-input.MuiOutlinedInput-input": {
    padding: "8px",
  },
  "& .MuiSvgIcon-root": {
    color: chipTextColor,
  },
}));

const RepoDetailsBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  color: bgInputs,
  lineHeight: 1,

  "& .MuiTypography-root": {
    fontSize: "0.857rem",
    textDecoration: "none",
  },

  "& .MuiBreadcrumbs-ol": {
    "& .MuiBreadcrumbs-li": {
      color: badgeBgLight,
      cursor: "pointer",
      "&:hover": {
        textDecoration: "underline",
      },
      "&:last-child": {
        color: `${paragraph} !important`,
        cursor: "initial",

        "&:hover": {
          textDecoration: "none",
        },
      },
    },
  },
}));

const StyledViewButton = styled(Button)(({ theme }) => ({
  padding: "0px",
  fonSize: ".8rem",
  border: 0,
  minWidth: "fit-content",
  textTransform: "none",
  lineHeight: 0,
  "&:hover": {
    backgroundColor: "transparent",
  },
}));

const RepositoryPageDetails = ({
  repository,
  openRepoUrl,
  checkedChanged,
  user,
  onAction,
  resetChecked,
  setResetChecked
}: {
  repository: OSBRepository;
  openRepoUrl: () => void;
  checkedChanged: (checked: RepositoryResourceNode[]) => any;
  user: UserInfo;
  onAction: (r: OSBRepository) => void;
  resetChecked: boolean;
  setResetChecked: (value: boolean) => any;
}) => {
  const [currentPath, setCurrentPath] = React.useState<
    RepositoryResourceNode[]
  >([repository?.contextResources]);
  const [filter, setFilter] = React.useState<string>();
  const [checked, setChecked] = React.useState<{
    [id: string]: RepositoryResourceNode;
  }>({});
  const [repositoryEditorOpen, setRepositoryEditorOpen] = React.useState(false);

  const canEdit = canEditRepository(user, repository);

  const resourcesList = currentPath
    ?.slice(-1)[0]
    ?.children?.filter(
      (e) => !filter || e.resource.name.toLowerCase().includes(filter)
    );

  let resourcesListObject: {[id: string]: RepositoryResourceNode} = resourcesList?.reduce(
    (resourcesListObject, item) => {
      resourcesListObject[item.resource.path] = item.children;
      return resourcesListObject;
    },
    {}
  );

  const handleToggle = (value: any) => () => "";

  const onCheck = (isChecked: boolean, value: RepositoryResourceNode) => {
    if (isChecked) {
      checked[value.resource.path] = value;
    } else {
      delete checked[value.resource.path];
    }
    setChecked({ ...checked });
    checkedChanged(Object.values(checked));
    setResetChecked(false);
  };

  const addToCurrentPath = (n: RepositoryResourceNode) => {
    setCurrentPath([...currentPath, n]);
  };

  const onSelectAllFiles = (value) => {
    if (value) {
      setChecked(resourcesListObject);
      checkedChanged(resourcesList);
      setResetChecked(false);
    } else {
      setChecked({});
      checkedChanged([])
    }
  };

  const handleOnSubmit = (r: OSBRepository) => {
    onAction(r);
  };

  const handleClickEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    setRepositoryEditorOpen(true);
  };

  const handleCloseDialog = () => {
    setRepositoryEditorOpen(false);
  };

  React.useEffect(() => {
    if(resetChecked){
      setChecked({})
    }
  },[resetChecked])

  return (
    repository && (
      <Box
        sx={{
          background: repoPageContentBg,
          height: "100%",
          padding: "24px",
          overflow: "auto",
        }}
      >
        <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className="verticalFill">
          <Grid item xs={12} md={6} direction="column" className="verticalFit">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="start"
              borderBottom={`1px solid ${lineColor}`}
            >
              <Box display="flex" alignItems="center" mb={"4px"}>
                <Typography variant="h5">Overview</Typography>
                <Tooltip
                  title={
                    <>
                      Repositories provide views of files in public resources
                      that have been indexed in OSBv2 by users. Use the
                      Repository Contents pane on the right to select files from
                      this repository to add to your workspaces.{" "}
                      <Link
                        href="https://docs.opensourcebrain.org/OSBv2/Repositories.html"
                        target="_blank"
                        underline="hover"
                      >
                        Learn more...
                      </Link>
                    </>
                  }
                >
                  <RepoDetailsIconButton sx={{ padding: "0 0 0 10px" }}>
                    <InfoOutlinedIcon />
                  </RepoDetailsIconButton>
                </Tooltip>
              </Box>
              {canEdit && (
                <StyledViewButton
                  variant="text"
                  endIcon={<ModeEditIcon />}
                  size="small"
                  onClick={handleClickEdit}
                >
                  Edit
                </StyledViewButton>
              )}
            </Box>

            {/*tags*/}
            <Box>
              <Stack mt={3} mb={3} spacing={1} direction="column" >
                <Typography variant="body2" sx={{ color: greyishTextColor }}>
                  Created:{" "}
                  {repository?.timestampCreated &&
                    repository?.timestampCreated?.toDateString()}
                </Typography>
                <Stack direction="row" spacing={1}>
                  {repository?.defaultContext && (
                    <RepoDetailsChip
                      icon={
                        <LanOutlinedIcon
                          sx={{ fill: paragraph, fontSize: "1rem" }}
                        />
                      }
                      label={repository?.defaultContext}
                      key={repository?.defaultContext}
                    />
                  )}
                  {repository?.contentTypes?.split(",").map((type) => (
                    <RepoDetailsChip
                      key={type}
                      label={type}
                      avatar={
                        <FiberManualRecordIcon
                          color={
                            type === RepositoryContentType.Experimental
                              ? "primary"
                              : "secondary"
                          }
                        />
                      }
                    />
                  ))}
                </Stack>
              </Stack>
            </Box>
            {/**/}
            <Box className="verticalFit">
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="start"
                pb={"4px"}
                
                borderBottom={`1px solid ${lineColor}`}
              >
                <Typography variant="h5">Repository preview</Typography>
                <Link href="#" onClick={openRepoUrl} fontSize="small" sx={{display: "flex", alignItems: "center"}}>
                  View on{" "}
                  {Resources[repository?.repositoryType] ||
                    repository?.repositoryType}
                  <OpenInNewIcon fontSize="small" sx={{paddingLeft: "0.3em"}} />
                </Link>
              </Box>
              <Box className="verticalFit">
                <Paper className={`verticalFit`} 
                  sx={{
                    padding: 2,
                    background: infoBoxBg,
                    borderRadius: inputRadius,
                    marginTop: 2,
                    overflow: "auto",
                  }}>
                  <RepositoryMarkdownViewer
                    text={repository?.description}
                    repository={repository}
                  />
                </Paper>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6} direction="column" className="verticalFit">
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="start"
              borderBottom={`1px solid ${lineColor}`}
            >
              <Box display="flex" alignItems="center" mb={"4px"}>
                <Typography variant="h5">Select content</Typography>
                <Tooltip
                  title={
                    <>
                      {`The file list below shows the latest (current) version and contents of the repository. Select files and folders below to add to your workspaces. To see the previous version and contents of the repository, please view the repository on ${
                        Resources[repository?.repositoryType] ||
                        repository?.repositoryType
                      }.`}{" "}
                      <Link
                        href="https://docs.opensourcebrain.org/OSBv2/Repositories.html"
                        target="_blank"
                      >
                        Learn more...
                      </Link>
                    </>
                  }
                >
                  <RepoDetailsIconButton sx={{ padding: "0 0 0 10px" }}>
                    <InfoOutlinedIcon />
                  </RepoDetailsIconButton>
                </Tooltip>
              </Box>
            </Box>

            <Box>
              <Stack mt={3} mb={3} spacing={1} direction="column">
                <RepoDetailsBreadcrumbs separator="›" aria-label="breadcrumb">
                  {currentPath?.map((element, i) => (
                    <Link
                      key={element?.resource?.name}
                      color="inherit"
                      onClick={() =>
                        setCurrentPath(currentPath?.slice(0, i + 1))
                      }
                    >
                      {i > 0 ? element?.resource?.name : repository?.name}
                    </Link>
                  ))}
                </RepoDetailsBreadcrumbs>
                <RepoDetailsSearchField
                  id="standard-start-adornment"
                  fullWidth={true}
                  placeholder="Search"
                  onChange={(e) => setFilter(e.target.value.toLowerCase())}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Box>

            <Box className="verticalFit">
              <Paper
                elevation={0}
                className="verticalFit"
                sx={{
                  width: "100%",
                  background: "none",
                  overflow: "auto",
                }}
              >
                <TableContainer component="div" className="scrollbar">
                  <Table aria-label="repository resources">
                    <TableHead
                      sx={{
                        "& .MuiTableCell-root": {
                          padding: "8px 8px 8px 0",

                          "& .MuiButtonBase-root": {
                            padding: 0,
                          },
                        },
                      }}
                    >
                      <TableRow>
                        <TableCell padding="checkbox" sx={{ width: "1.8em" }}>
                          <Checkbox
                            color="primary"
                            checked={
                              Object.keys(checked)?.length ===
                              resourcesList?.length
                            }
                            onChange={(e) => onSelectAllFiles(e.target.checked)}
                            inputProps={{
                              "aria-label": "select all desserts",
                            }}
                          />
                        </TableCell>
                        <TableCell component="th">
                          <Typography component="p">Name</Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody
                      sx={{
                        "& .MuiTableCell-root": {
                          border: 0,
                        },
                      }}
                    >
                      {currentPath
                        .slice(-1)[0]
                        .children.filter(
                          (e) =>
                            !filter ||
                            e.resource.name.toLowerCase().includes(filter)
                        )
                        .map((value, index) => {
                          const labelId = `checkbox-list-label-${value}`;

                          const splitfilename = value.resource.name.split(".");
                          const extension =
                            splitfilename.length > 1
                              ? splitfilename.pop()
                              : null;
                          const filename = splitfilename.join(".");
                          const isFolder =
                            value.children && value.children.length;
                          return (
                            <TableRow
                              key={value.resource.name}
                              onClick={handleToggle(value)}
                            >
                              <TableCell
                                padding="checkbox"
                                sx={{ width: "1.8em" }}
                              >
                                <Checkbox
                                  edge="start"
                                  checked={Boolean(
                                    checked[value.resource.path]
                                  )}
                                  tabIndex={-1}
                                  disableRipple={true}
                                  inputProps={{ "aria-labelledby": labelId }}
                                  onChange={(e) =>
                                    onCheck(e.target.checked, value)
                                  }
                                />
                              </TableCell>
                              <TableCell scope="row" padding="none">
                                <Box
                                  display="flex"
                                  alignItems="left"
                                  alignContent="center"
                                  justifyContent="space-between"
                                  onClick={
                                    isFolder
                                      ? () => addToCurrentPath(value)
                                      : null
                                  }
                                >
                                  <Box display="flex" alignItems="center">
                                    <Box
                                      pr={1}
                                      display="flex"
                                      alignItems="center"
                                      alignContent="center"
                                      className={
                                        "icon" + (!isFolder ? "" : " file")
                                      }
                                    >
                                      {isFolder ? (
                                        <FolderIcon color="primary" />
                                      ) : (
                                        <InsertDriveFileIcon color="disabled" />
                                      )}
                                    </Box>
                                    <Typography
                                      component="p"
                                      sx={{
                                        "&:hover": {
                                          cursor: isFolder
                                            ? "pointer"
                                            : "initial",
                                        },
                                      }}
                                    >
                                      {filename}
                                      {extension && (
                                        <Typography component="span">
                                          .{extension}
                                        </Typography>
                                      )}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              {value.resource.size && (
                                <TableCell>
                                  {prettyBytes(value.resource.size)}
                                </TableCell>
                              )}
                              {value.resource.timestampModified && (
                                <TableCell>
                                  {value.resource.timestampModified.toLocaleDateString(
                                    "en-US"
                                  )}
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </Grid>
        </Grid>

        {repositoryEditorOpen && (
          <EditRepoDialog
            user={user}
            title="Edit repository"
            dialogOpen={repositoryEditorOpen}
            handleClose={handleCloseDialog}
            onSubmit={handleOnSubmit}
            repository={repository}
          />
        )}
      </Box>
    )
  );
};

export default RepositoryPageDetails;
