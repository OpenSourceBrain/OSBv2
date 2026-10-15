import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

import { RepositoryResourceNode } from "../../apiclient/workspaces";
import { bgInputs, bgLight } from "../../theme";

interface OSBChipListProps {
  chipItems: RepositoryResourceNode[];
  onDeleteChip: (pathOfChipToBeDeleted: string) => void;
}

const styles = {
  chipBox: {
    paddingTop: 2,
    "& h6": {
      fontWeight: "bold",
      color: bgInputs,
      fontSize: "0.8rem",
      marginBottom: "5px",
      marginLeft: 1,
    },
  },
  OSBChipList: {
    display: "flex",
    flexWrap: "wrap",
    "& .MuiChip-root": {
      backgroundColor: bgLight,
      marginBottom: 1,
    },
  },
  OSBChipFileExtension: {
    color: bgInputs,
  },
};

export const OSBChipList = (props: OSBChipListProps) => {

  const createChipLabel = (chipItem: RepositoryResourceNode) => {
    const splitfilename = chipItem.resource.name.split(".");
    const extension = splitfilename.length > 1 ? splitfilename.pop() : null;
    const filename = splitfilename.join(".");
    const isFolder = chipItem.children && chipItem.children.length;

    if (extension) {
      return (
        <>
          <Typography component="span">{filename}</Typography>
          <Typography component="span" sx={styles.OSBChipFileExtension}>
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
    <Box sx={styles.chipBox}>
      <Typography component="h6">Files selected</Typography>

      <Box sx={styles.OSBChipList}>
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

export default OSBChipList;