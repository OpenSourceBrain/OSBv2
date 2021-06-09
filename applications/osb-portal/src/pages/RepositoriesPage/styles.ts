import { makeStyles } from "@material-ui/core/styles";

import {
  bgRegular,
  linkColor,
  primaryColor,
  teal,
  purple,
  bgLightest,
  fontColor,
  bgDarkest,
  paragraph,
  bgLightestShade,
  bgInputs,
} from "../../theme";

export default makeStyles((theme) => ({
  root: {
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
    "& p": {
      fontSize: "1rem",
      lineHeight: 1,
      letterSpacing: ".02rem",
      color: linkColor,
      marginBottom: 0,
    },
    "& .repository-data": {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingRight: 0,
      overflow: "auto",
      backgroundColor: bgDarkest,
      height: "calc(100vh - 8.8rem)",
      "& .repository-data-items": {
        "& strong": {
          display: "block",
          marginBottom: theme.spacing(1),
          fontSize: ".88rem",
          letterSpacing: "0.02rem",
          fontWeight: "500",
          lineHeight: 1.5,
        },
        "& p": {
          lineHeight: 1.5,
          fontSize: ".88rem",
          letterSpacing: "0.01rem",
          color: paragraph,
          [theme.breakpoints.down("xs")]: {
            marginBottom: theme.spacing(1),
          },
        },

        "& .tag": {
          background: bgLightestShade,
          textTransform: "capitalize",
          borderRadius: "1rem",
          fontSize: ".88rem",
          color: paragraph,
          height: "1.9rem",
          margin: ".5rem .5rem .5rem 0",
          "& .MuiSvgIcon-root": {
            width: ".63rem",
            height: ".63rem",
            marginRight: theme.spacing(1),
            "&.MuiSvgIcon-colorPrimary": {
              color: teal,
            },
            "&.MuiSvgIcon-colorSecondary": {
              color: purple,
            },
          },
        },

        "& .col": {
          borderWidth: 0,
          "& .MuiSvgIcon-root": {
            color: paragraph,
          },
          "& .MuiAvatar-root": {
            width: ".5rem",
            height: "auto",
          },
          [theme.breakpoints.down("xs")]: {
            paddingTop: theme.spacing(0),
            paddingBottom: theme.spacing(0),
          },
          [theme.breakpoints.up("sm")]: {
            padding: theme.spacing(3),
          },
          [theme.breakpoints.up("md")]: {
            borderWidth: `1px 0 1px 0`,
            borderStyle: "solid",
            borderColor: bgRegular,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
          },
        },
        "& .row": {
          paddingLeft: theme.spacing(3),
          paddingRight: theme.spacing(3),
          "& .MuiButtonBase-root": {
            minWidth: "11.5rem",
            marginRight: "1.312rem",
          },
          "&:hover": {
            backgroundColor: bgRegular,
            cursor: "pointer",
            "& strong": {
              textDecoration: "underline",
            },
          },
          "& .MuiGrid-root": {
            "&:first-child": {
              "& .col": {
                paddingLeft: 0,
              },
            },
            "&:last-child": {
              "& .col": {
                paddingRight: 0,
                justifyContent: "flex-end",
                flexDirection: "row",
                alignItems: "center",
                [theme.breakpoints.down("md")]: {
                  paddingLeft: 0,
                },
                [theme.breakpoints.down("xs")]: {
                  marginTop: theme.spacing(2),
                },
                [theme.breakpoints.down("sm")]: {
                  "& .MuiButton-outlined": {
                    flexGrow: 1,
                  },
                },
              },
            },
          },
          [theme.breakpoints.down("sm")]: {
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            borderWidth: `1px 0 1px 0`,
            borderStyle: "solid",
            borderColor: bgRegular,
          },
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
}));