import * as React from "react";

// components

import Typography from "@mui/material/Typography";

// style
import {
  chipTextColor,
} from "../../theme";
import styled from "@mui/system/styled";


export const CardFooter = styled(Typography)(() => ({
    lineHeight: 1.143,
    fontSize: ".857rem",
    color: chipTextColor,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  
    "& .MuiSvgIcon-root": {
      fontSize: ".857rem",
    },
  
    "& .MuiButtonBase-root": {
      textTransform: "capitalize",
      padding: "0.286rem 0.857rem 0.286rem 0rem",
      color: chipTextColor,
      fontWeight: 400,
      justifyContent: "flex-start",
    },
  
    "& .repoType": {
      "&:hover": {
        backgroundColor: "transparent",
        textDecoration: "underline",
      },
    },
  }));

export default CardFooter;