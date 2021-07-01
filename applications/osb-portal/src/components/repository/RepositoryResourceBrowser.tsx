import * as React from "react";

import Typography from "@material-ui/core/Typography";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import SearchIcon from "@material-ui/icons/Search";
import Link from "@material-ui/core/Link";
import Avatar from "@material-ui/core/Avatar";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Box from "@material-ui/core/Box";
import Checkbox from "@material-ui/core/Checkbox";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import FolderIcon from "@material-ui/icons/Folder";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";

import { OSBRepository, RepositoryResourceNode } from "../../apiclient/workspaces";
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

    "& .flex-grow-1": {
      borderBottom: `1px solid ${bgRegular}`,
      borderTop: `1px solid ${bgRegular}`,
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      marginLeft: theme.spacing(2),
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

export default ({ repository, checkedChanged, backAction, refresh }: { repository: OSBRepository, checkedChanged: (checked: RepositoryResourceNode[]) => any, backAction?: () => void, refresh?: boolean }) => {
  const [checked, setChecked] = React.useState<{ [id: string]: RepositoryResourceNode }>({});
  const [currentPath, setCurrentPath] = React.useState<RepositoryResourceNode[]>([repository.contextResources]);
  const [filter, setFilter] = React.useState<string>();
  const handleToggle = (value: any) => () => '';
  const classes = useStyles();
  React.useEffect(() => {
    setChecked({});
  }, [refresh])

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
  }



  return <>
    <Box display="flex" flex-direction="row" alignItems="center">
      {backAction &&
        <IconButton onClick={() => backAction()}>
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>
      }
      <Breadcrumbs
        separator={<Avatar src="/images/separator.svg" />}
        aria-label="breadcrumb"
        className={classes.breadcrumbs}
      >
        {
          currentPath.map((element, i) =>
            <Link
              key={element.resource.name}
              color="inherit"
              onClick={() => setCurrentPath(currentPath.slice(0, i + 1))}
            >
              {i > 0 ? element.resource.name : repository.name}
            </Link>)
        }
      </Breadcrumbs>
    </Box>
    <TextField
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
      }}
    />

    <Box mt={1} className="scrollbar">
      <List className={classes.list}>
        {currentPath.slice(-1)[0].children.filter(e => !filter || e.resource.name.toLowerCase().includes(filter)).map((value, index) => {
          const labelId = `checkbox-list-label-${value}`;

          const splitfilename = value.resource.name.split(".");
          const extension = splitfilename.length > 1 ? splitfilename.pop() : null;
          const filename = splitfilename.join('.');
          const isFolder = value.children && value.children.length;
          return (
            <ListItem
              key={value.resource.name}
              role={undefined}
              dense={true}
              button={true}
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={Boolean(checked[value.resource.path])}
                  tabIndex={-1}
                  disableRipple={true}
                  inputProps={{ "aria-labelledby": labelId }}
                  onChange={(e) => onCheck(e.target.checked, value)}
                />
              </ListItemIcon>
              <Box
                className="flex-grow-1"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                onClick={isFolder ? () => addToCurrentPath(value) : null}
              >
                <Box display="flex" alignItems="center">
                  <Box pr={1} className={'icon' + (!isFolder ? '' : ' file')}>
                    {isFolder ? <FolderIcon color="primary" /> : <InsertDriveFileIcon color="disabled" />}
                  </Box>
                  <Typography component="p">
                    {filename}
                    {extension && <Typography component="span">.{extension}</Typography>}
                  </Typography>
                </Box>
                {/* <Typography component="strong">
      {value.resource.}
      </Typography> */}
              </Box>
            </ListItem>
          );
        })}
      </List>
    </Box>
  </>
}