import * as React from "react";

// components
import Paper from "@mui/material/Paper";

// style
import {
    infoBoxBg,
    inputRadius
} from "../../theme";
import styled from "@mui/system/styled";


export const AboutOSBPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    background: infoBoxBg,
    borderRadius: inputRadius,
    marginTop: theme.spacing(2),
    overflow: "auto",
  }));