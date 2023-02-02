import * as React from "react";

// components
import {

    lightWhite,
  } from "../../theme";
  import styled from "@mui/system/styled";
import Typography from "@mui/material/Typography";


export const CardTitle = styled(Typography)(() => ({
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "1rem",
    color: lightWhite,
    lineHeight: "1.429",
  }));

  export default CardTitle;