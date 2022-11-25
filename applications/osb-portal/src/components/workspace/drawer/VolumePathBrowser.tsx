import * as React from "react";
import { useTheme } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import Box from "@mui/material/Box";

import ArrowUpIcon from "@mui/icons-material/ArrowDropUp";

import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import ArrowDownIcon from "@mui/icons-material/ArrowDropDown";

import { FileLinkIcon, LoadingIcon, FolderIcon } from "../../icons";

const useStyles = makeStyles((theme) => ({
  drawerContent: {
    maxWidth: 400,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  expandHeader: {
    display: "flex",
    flexDirection: "row-reverse",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },

  content: {
    flex: 1,
    display: "flex",
  },
  loading: {
    color: theme.palette.grey[600],
  },
  FlexDisplay: {
    display: "flex",
  },
  FlexGrowOne: {
    flex: 1,
  },
}));

const LinkItem = (props: any) => {
  const classes = useStyles();
  return (
    <div className={classes.FlexDisplay}>
      <FileLinkIcon />
      <div>{props.name}</div>
    </div>
  );
};

const FolderItem = (props: any) => {
  const classes = useStyles();
  return (
    <div className={classes.FlexDisplay}>
      <FolderIcon />
      <div>{props.name}</div>
    </div>
  );
};

const LoadingItem = (props: any) => {
  const classes = useStyles();
  return (
    <div className={classes.FlexDisplay}>
      <div className={classes.FlexGrowOne}>Loading {props.name}</div>
      <LoadingIcon />
    </div>
  );
};

interface VolumeProps {
  volumeId: string; // Will get the volume from the id when needed
  path: string;
}

// TODO Just static stubs for now

export default (props: VolumeProps) => (
  <Box p={1}>
    <TreeView
      defaultCollapseIcon={<ArrowDownIcon />}
      defaultExpandIcon={<ArrowUpIcon />}
      defaultExpanded={["1", "10"]}
    >
      {props.volumeId ? (
        <>
          <TreeItem nodeId="3" label={<LinkItem name="Ferguson 0.nwb" />} />
          <TreeItem nodeId="4" label={<LinkItem name="Ferguson 1.nwb" />} />
          <TreeItem nodeId="4" label={<LinkItem name="Ferguson 2.nwb" />} />
          <TreeItem nodeId="5" label={<LinkItem name="Ferguson 3.nwb" />} />
          <TreeItem nodeId="7" label="test.json" />
          <TreeItem nodeId="8" label={<LoadingItem name="test.nwb" />} />
          <TreeItem nodeId="8" label={<FolderItem name="folder 1" />} />
          <TreeItem nodeId="9" label={<FolderItem name="folder 2" />} />
        </>
      ) : (
        <>
          <TreeItem nodeId="10" label={<FolderItem name="every_workspace" />}>
            <TreeItem nodeId="11" label="can.npy" />
            <TreeItem nodeId="12" label="see_these.nwb" />
            <TreeItem nodeId="13" label="resources.json" />
          </TreeItem>
          <TreeItem nodeId="14" label="Material-UI">
            <TreeItem nodeId="15" label="src">
              <TreeItem nodeId="16" label="index.js" />
              <TreeItem nodeId="17" label="tree-view.js" />
            </TreeItem>
          </TreeItem>
        </>
      )}
    </TreeView>
  </Box>
);
