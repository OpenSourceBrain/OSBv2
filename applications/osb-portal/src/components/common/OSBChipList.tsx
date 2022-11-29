import * as React from "react";

import makeStyles from '@mui/styles/makeStyles';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

import { RepositoryResourceNode } from "../../apiclient/workspaces";
import { bgInputs, bgLight } from "../../theme";

interface OSBChipListProps {
  chipItems: RepositoryResourceNode[];
  onDeleteChip: (pathOfChipToBeDeleted: string) => void;
}

const useStyles = makeStyles((theme) => ({
  chipBox: {
    backgroundColor: bgLight,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    marginBottom: theme.spacing(2),
    "& h6": {
      fontWeight: "bold",
      color: bgInputs,
      fontSize: "0.8rem",
      marginBottom: "5px",
      marginLeft: theme.spacing(1),
    },
  },
  OSBChipList: {
    display: "flex",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: 0,
      backgroundColor: "transparent",
    },
  },
  OSBChipFileExtension: {
    color: bgInputs,
  },
}));

export default (props: OSBChipListProps) => {
  const classes = useStyles();

  const createChipLabel = (chipItem: RepositoryResourceNode) => {
    const splitfilename = chipItem.resource.name.split(".");
    const extension = splitfilename.length > 1 ? splitfilename.pop() : null;
    const filename = splitfilename.join(".");
    const isFolder = chipItem.children && chipItem.children.length;

    if (extension) {
      return (
        <>
          <Typography component="span">{filename}</Typography>
          <Typography component="span" className={classes.OSBChipFileExtension}>
            .{extension}
          </Typography>
        </>
      );
    } else {
      return (
        <>
          <Typography component="span">{filename}</Typography>
        </>
      );
    }
  };

  return (
    <Box className={classes.chipBox}>
      <Typography component="h6">Files selected</Typography>

      <Box className={classes.OSBChipList}>
        {props.chipItems.map((chipItem) => {
          return (
            <Chip
              key={chipItem.resource.path}
              label={createChipLabel(chipItem)}
              variant="outlined"
              size="medium"
              onDelete={() => props.onDeleteChip(chipItem.resource.path)}
            />
          );
        })}
      </Box>
    </Box>
  );
};
