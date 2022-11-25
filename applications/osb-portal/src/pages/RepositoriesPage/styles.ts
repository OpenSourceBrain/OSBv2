import makeStyles from '@mui/styles/makeStyles';

import {
  bgLightest,
  fontColor,
  bgDarkest,
  bgInputs,
  bgLightestShade,
  paragraph,
  textColor,
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
        marginBottom: -12,
        fontSize: "1rem",
      },
      "& .MuiTab-root": {
        paddingLeft: 0,
        paddingRight: 0,
        marginRight: theme.spacing(2),
        paddingBottom: 16,
      },
      "& .MuiButton-contained": {
        [theme.breakpoints.down('md')]: {
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
          [theme.breakpoints.down('sm')]: {
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
    display: "flex",
    justifyContent: "center",
    "& .MuiPagination-root": {
      "& .MuiPagination-ul": {
        "& li": {
          "& .MuiPaginationItem-root": {
            color: "white",
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
    display: "flex",
    "& .MuiInputBase-root": {
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1),
      height: "fit-content",
    },
    "& .MuiTextField-root": {
      minWidth: "20vw",
    },
  },
  filterButton: {
    textTransform: "capitalize",
    "& :hover": {
      backgroundColor: "transparent",
    },
    minWidth: "fit-content !important",
    backgroundColor: bgLightestShade,
    "& .MuiButton-label": {
      color: `${paragraph} !important`,
    },
    "& .MuiTouchRipple-root:hover": {
      backgroundColor: "transparent",
    },
  },
  label: {
    color: bgInputs,
    fontWeight: 700,
  },
  popover: {
    "& .MuiPaper-root": {
      minWidth: "350px !important",
      padding: theme.spacing(3),
      "& .MuiSvgIcon-root": {
        cursor: "pointer",
      },
      "& .MuiAutocomplete-root": {
        display: "flex",
        alignItems: "center",
        paddingTop: 0,
        paddingBottom: 0,
        marginBottom: theme.spacing(1),
        "& .MuiSvgIcon-root": {
          marginLeft: theme.spacing(1),
          color: paragraph,
        },
        "& .MuiInputBase-root": {
          paddingLeft: 0,
        },
      },
    },
  },
}));
