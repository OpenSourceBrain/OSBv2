import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";

import ArrowUpIcon from "@mui/icons-material/ArrowDropUp";

import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import ArrowDownIcon from "@mui/icons-material/ArrowDropDown";

import { FileLinkIcon, LoadingIcon, FolderIcon } from "../../icons";

// Module-level styles
const styles = {
  flexDisplay: {
    display: "flex",
  },
  flexGrowOne: {
    flex: 1,
  },
};

const LinkItem = (props: any) => {
  return (
    <Box sx={styles.flexDisplay}>
      <FileLinkIcon />
      <div>{props.name}</div>
    </Box>
  );
};

const FolderItem = (props: any) => {
  return (
    <Box sx={styles.flexDisplay}>
      <FolderIcon />
      <div>{props.name}</div>
    </Box>
  );
};

const LoadingItem = (props: any) => {
  return (
    <Box sx={styles.flexDisplay}>
      <Box sx={styles.flexGrowOne}>Loading {props.name}</Box>
      <LoadingIcon />
    </Box>
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
