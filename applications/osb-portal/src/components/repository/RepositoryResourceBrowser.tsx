import * as React from "react";

import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import Link from "@mui/material/Link";
import Avatar from "@mui/material/Avatar";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import IconButton from "@mui/material/IconButton";
import makeStyles from '@mui/styles/makeStyles';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import prettyBytes from "pretty-bytes";

import {
  OSBRepository,
  RepositoryResourceNode,
} from "../../apiclient/workspaces";
import {
  bgRegular,
  linkColor,
  bgLightest,
  fontColor,
  checkBoxColor,
  paragraph,
  bgLightestShade,
  bgInputs,
} from "../../theme";

const useStyles = makeStyles((theme) => ({
  textField: {
    borderRadius: 4,
    marginTop: theme.spacing(2),
    backgroundColor: bgLightestShade,
    padding: theme.spacing(2),
    "& .MuiSvgIcon-root": {
      width: "1.25rem",
      borderRadius: 0,
      color: paragraph,
      height: "auto",
    },
    "& .MuiInput-root": {
      "&:before": {
        display: "none",
      },
      "&:after": {
        display: "none",
      },
    },
    "& .MuiInputBase-input": {
      padding: theme.spacing(0),
      fontSize: ".88rem",
    },
  },
  list: {
    "& .MuiCheckbox-colorSecondary": {
      color: checkBoxColor,
      "&.Mui-checked": {
        color: linkColor,
      },
    },

    "& .MuiListItemIcon-root": {
      minWidth: 1,
    },
    "& .MuiListItemText-root": {
      margin: 0,
    },
    "& p": {
      fontSize: ".913rem",
      display: "flex",
      alignItems: "flex-end",
      color: fontColor,
      "& span": {
        fontSize: ".913rem",
        color: bgInputs,
      },
    },
    "& strong": {
      fontSize: ".793rem",
      fontWeight: "bold",
      color: bgInputs,
    },

    "& .MuiAvatar-root": {
      width: "1.5rem",
      borderRadius: 0,
      height: "auto",
    },
    "& .MuiIconButton-root": {
      margin: 0,
      padding: 0,
    },
    "& .MuiListItem-root": {
      borderRadius: 4,
      padding: 0,
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      "&:first-child": {
        "& .flex-grow-1": {
          borderTop: 0,
        },
      },
      "&:last-child": {
        "& .flex-grow-1": {
          borderBottomWidth: 2,
        },
      },
      "&:hover": {
        backgroundColor: bgLightest,
      },
    },
  },
  breadcrumbs: {
    lineHeight: 1,
    "& .MuiAvatar-root": {
      width: "auto",
      borderRadius: 0,
      height: "auto",
    },
    "& .MuiBreadcrumbs-separator": {
      fontSize: ".693rem",
      lineHeight: 1,
      color: paragraph,
      fontWeight: "bold",
    },
    "& .MuiBreadcrumbs-li": {
      lineHeight: 1,
      "& .MuiTypography-root": {
        fontSize: ".693rem",
        fontWeight: "bold",
        color: paragraph,
        lineHeight: 1,
      },
      "& .MuiLink-root": {
        fontSize: ".693rem",
        lineHeight: 1,
        fontWeight: "bold",
        display: "block",
        color: bgInputs,
        cursor: "pointer",
      },
    },
  },
}));

export default ({
  repository,
  checkedChanged,
  backAction,
  refresh,
}: {
  repository: OSBRepository;
  checkedChanged: (checked: RepositoryResourceNode[]) => any;
  backAction?: () => void;
  refresh?: boolean;
}) => {
  const [checked, setChecked] = React.useState<{
    [id: string]: RepositoryResourceNode;
  }>({});
  const [currentPath, setCurrentPath] = React.useState<
    RepositoryResourceNode[]
  >([repository.contextResources]);
  const [filter, setFilter] = React.useState<string>();
  const handleToggle = (value: any) => () => "";
  const classes = useStyles();
  React.useEffect(() => {
    setChecked({});
  }, [refresh]);

  const onCheck = (isChecked: boolean, value: RepositoryResourceNode) => {
    if (isChecked) {
      checked[value.resource.path] = value;
    } else {
      delete checked[value.resource.path];
    }
    setChecked({ ...checked });
    checkedChanged(Object.values(checked));
  };

  const addToCurrentPath = (n: RepositoryResourceNode) => {
    setCurrentPath([...currentPath, n]);
  };

  return <>
    <Box display="flex" flex-direction="row" alignItems="center">
      {backAction && (
        <IconButton onClick={() => backAction()} size="large">
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>
      )}
      <Breadcrumbs
        separator={<Avatar src="/images/separator.svg" />}
        aria-label="breadcrumb"
        className={classes.breadcrumbs}
      >
        {currentPath.map((element, i) => (
          <Link
            key={element.resource.name}
            color="inherit"
            onClick={() => setCurrentPath(currentPath.slice(0, i + 1))}
            underline="hover">
            {i > 0 ? element.resource.name : repository.name}
          </Link>
        ))}
      </Breadcrumbs>
    </Box>
    <TextField
      variant="standard"
      id="standard-start-adornment"
      fullWidth={true}
      placeholder="Search"
      className={classes.textField}
      onChange={(e) => setFilter(e.target.value.toLowerCase())}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }} />

    <Box mt={1} className="scrollbar">
      <TableContainer component="div">
        <Table className={classes.list} aria-label="repository resources">
          <TableBody>
            {currentPath
              .slice(-1)[0]
              .children.filter(
                (e) =>
                  !filter || e.resource.name.toLowerCase().includes(filter)
              )
              .map((value, index) => {
                const labelId = `checkbox-list-label-${value}`;

                const splitfilename = value.resource.name.split(".");
                const extension =
                  splitfilename.length > 1 ? splitfilename.pop() : null;
                const filename = splitfilename.join(".");
                const isFolder = value.children && value.children.length;
                return (
                  <TableRow
                    key={value.resource.name}
                    onClick={handleToggle(value)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        edge="start"
                        checked={Boolean(checked[value.resource.path])}
                        tabIndex={-1}
                        disableRipple={true}
                        inputProps={{ "aria-labelledby": labelId }}
                        onChange={(e) => onCheck(e.target.checked, value)}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      <Box
                        display="flex"
                        alignItems="left"
                        alignContent="center"
                        justifyContent="space-between"
                        pt={2}
                        pb={2}
                        onClick={
                          isFolder ? () => addToCurrentPath(value) : null
                        }
                      >
                        <Box display="flex" alignItems="center">
                          <Box
                            pr={1}
                            display="flex"
                            alignItems="center"
                            alignContent="center"
                            className={"icon" + (!isFolder ? "" : " file")}
                          >
                            {isFolder ? (
                              <FolderIcon color="primary" />
                            ) : (
                              <InsertDriveFileIcon color="disabled" />
                            )}
                          </Box>
                          <Typography component="p">
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
    </Box>
  </>;
};
