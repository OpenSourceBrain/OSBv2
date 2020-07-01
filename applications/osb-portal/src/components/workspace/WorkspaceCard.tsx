import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Link from "@material-ui/core/Link";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import FolderIcon from "@material-ui/icons/Folder";

import { Workspace } from "../../types/workspace";

interface Props {
  workspace: Workspace;
}

const cardWidth = 15;

const useStyles = makeStyles((theme) => ({
  card: {
    width: `${cardWidth}em`,
    flex: 1,
    height: `${cardWidth * 1.14}em`
  },
  icon: {
    fontSize: "8em",
  },
  actions: {
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
        <Link href={`/workspace/${workspace.id}`} color="inherit">
          {!workspace.image ? (
            <FolderIcon className={classes.icon} />
          ) : (
            <img src={workspace.image} title={openTitle} alt={openTitle} />
          )}
        </Link>
      </CardActions>
      <CardContent>
        <Typography component="h2" variant="h5">
          {workspace.name}
        </Typography>
        {workspace.lastEdited ? (
          <Typography variant="subtitle2">
            Last edited: {workspace.lastApplicationEdit}, {workspace.lastEdited}
          </Typography>
        ) : null}
      </CardContent>
    </Card>
  );
};

export default WorkspaceCard;
