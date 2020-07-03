import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Card";
import Link from "@material-ui/core/Link";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import FolderIcon from "@material-ui/icons/Folder";

import { Workspace } from "../../types/workspace";
import * as Icons from "../icons";

interface Props {
  workspace: Workspace;
}

const useStyles = makeStyles((theme) => ({
  card: {
    flex: 1,
    minHeight: `18em`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  icon: {
    fontSize: "0.9em",
  },
  imageIcon: {
    fontSize: "8em",
  },
  actions: {
    display: "block",
    textAlign: "right",
  },
  image: {
    display: "flex",
    justifyContent: "center",
  },
}));

export const WorkspaceCard = (props: Props) => {
  const { workspace } = props;
  const classes = useStyles();
  const openTitle = "Open workspace";
  return (
    <Card className={classes.card} elevation={0}>
      <CardActions className={classes.actions}>
        <Icons.InfoIcon className={classes.icon} />
      </CardActions>
      <CardContent>
      <div className={classes.image}>
          <Link href={`/workspace/${workspace.id}`} color="inherit">
            {!workspace.image ? (
              <FolderIcon className={classes.imageIcon} />
            ) : (
              <img src={workspace.image} title={openTitle} alt={openTitle} />
            )}
          </Link>
        </div>
      </CardContent>
      <CardContent>
        
        <Link href={`/workspace/${workspace.id}`} color="inherit">
          <Typography component="h2" variant="h5">
            {workspace.name}
          </Typography>
        </Link>
        <Typography variant="caption">
          Last edited: {workspace.lastApplicationEdit}, {workspace.lastEdited}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default WorkspaceCard;
