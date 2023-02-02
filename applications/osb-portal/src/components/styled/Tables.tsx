import * as React from "react";

import TableContainer from "@mui/material/TableContainer";

import ShowMoreText from "react-show-more-text";


// style
import {
  paragraph,
  linkColor,
  chipTextColor,
  chipBg,
} from "../../theme";
import styled from "@mui/system/styled";



export const StyledTableContainer = styled(TableContainer)(() => ({
    overflow: "scroll",
    "&::-webkit-scrollbar": {
      width: 2,
      height: 2,
    },
    "& .MuiChip-root": {
      backgroundColor: chipBg,
    },
    "& .content-types-tag": {
      color: chipTextColor,
    },
    "& td a": {
      fontWeight: 600,
    },
    "& td button": {
      fontWeight: 600,
    }
   
    
  }));
  
  export const StyledShowMoreText = styled(ShowMoreText)(() => ({
    color: paragraph,
    marginTop: 8,
    display: "inline-block",
    fontSize: "0.857rem",
    "& a": {
      textDecoration: "none",
    },
    "& a .seemore": {
      color: linkColor,
      display: "flex",
      marginTop: "0.3em",
      fontWeight: 600,
      textDecoration: "none",
      "& .MuiSvgIcon-root": {
        color: `${linkColor} !important`,
      },
    },
  }));