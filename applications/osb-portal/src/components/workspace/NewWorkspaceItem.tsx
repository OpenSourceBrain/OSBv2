import * as React from "react";
import { Typography, Box, ButtonBase, Button } from "@material-ui/core";

import { OSBApplication } from "../../types/global";

interface ItemProps {
  icon: React.ElementType;
  title: string;
  application: OSBApplication;
}

export default (props: ItemProps) => (
  <Button style={{ textTransform: "none" }}>
    <Box textAlign="center">
      <props.icon fontSize="large" />
      <Typography variant="subtitle1">{props.title}</Typography>
      <Typography variant="caption">{props.application}</Typography>
    </Box>
  </Button>
);
