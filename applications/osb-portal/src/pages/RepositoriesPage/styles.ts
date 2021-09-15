import { makeStyles } from "@material-ui/core/styles";

import {
  bgLightest,
  fontColor,
  bgDarkest,
  bgInputs,
  bgLightestShade,
} from "../../theme";

export default makeStyles((theme) => ({
  root: {
    backgroundColor: bgDarkest,
    "& .subheader": {
      display: "flex",
      background: bgLightest,
      alignItems: "center",
      height: "4.062rem",
      justifyContent: "space-between",

      "& h1": {
        fontSize: ".88rem",
        lineHeight: 1,
      },
      "& .MuiTabs-root": {
        height: "auto",
      },
      "& .MuiTab-root": {
        minWidth: "inherit !important",
        lineHeight: 1,
        paddingLeft: "1.25rem",
        height: "1.875rem",
        [theme.breakpoints.down("xs")]: {
          paddingLeft: ".8rem",
        },
        "&:first-child": {
          borderRightColor: bgInputs,
          paddingLeft: 0,
          paddingRight: "1.25rem",
          [theme.breakpoints.down("xs")]: {
            paddingRight: ".8em",
          },
        },
        "& .MuiTouchRipple-root": {
          display: "none",
        },
        "& .MuiTab-wrapper": {
          lineHeight: 1,
          fontSize: ".88rem",
        },
      },
      "& .MuiButton-contained": {
        [theme.breakpoints.down("sm")]: {
          paddingLeft: 0,
          paddingRight: 0,
          minWidth: "2.25rem",
        },
        [theme.breakpoints.up("sm")]: {
          minWidth: "11.5rem",
        },
        [theme.breakpoints.up("md")]: {
          marginRight: "2rem",
        },
        "& .MuiButton-label": {
          color: fontColor,
          [theme.breakpoints.down("xs")]: {
            fontSize: 0,
          },
        },
      },
      "& .MuiSvgIcon-root": {
        [theme.breakpoints.up("sm")]: {
          marginRight: theme.spacing(1),
        },
      },
    },
  },
  paginationBar: {
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    "& .MuiPagination-root": {
      "& .MuiPagination-ul": {
        "& li": {
          "& .MuiPaginationItem-root": {
            color: 'white',
          },
        },
      },
    },
  },
  divider: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  filterAndSearchBox: {
    display: 'flex',
    '& .MuiInputBase-root': {
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
      height: 'fit-content',
    },
    '& .MuiAutocomplete-root': {
      paddingTop: '0px',
      paddingBottom: '0px',
      backgroundColor: bgLightestShade,
      marginRight: theme.spacing(1),
    },
    "& .MuiTextField-root": {
      minWidth: '20vw',
    },
  },
}));