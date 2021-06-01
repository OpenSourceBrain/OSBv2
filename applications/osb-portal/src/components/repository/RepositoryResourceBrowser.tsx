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

import { OSBRepository, RepositoryResourceNode } from "../../apiclient/workspaces";
import Button from "@material-ui/core/Button";

export default ({ repository, checkedChanged, backAction }: { repository: OSBRepository, checkedChanged: (checked: RepositoryResourceNode[]) => any, backAction?: () => void }) => {
  const [checked, setChecked] = React.useState<{ [id: string]: RepositoryResourceNode }>({});
  const [currentPath, setCurrentPath] = React.useState<RepositoryResourceNode[]>([repository.contextResources]);
  const handleToggle = (value: any) => () => '';

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
    <Breadcrumbs
      separator={<Avatar src="/images/separator.svg" />}
      aria-label="breadcrumb"
    >
      <Button onClick={() => backAction()}>
        <ArrowBackIosIcon fontSize="small"/>
      </Button>
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
    <TextField
      id="standard-start-adornment"
      fullWidth={true}
      placeholder="Search"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />

    <Box className="scrollbar">
      <List>
        {currentPath.slice(-1)[0].children.map((value, index) => {
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
                  <Box className={'icon' + (!isFolder ? '' : ' file')}>
                    {isFolder ? <FolderIcon /> : <InsertDriveFileIcon />}
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