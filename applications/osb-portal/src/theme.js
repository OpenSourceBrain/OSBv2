import { adaptV4Theme, createTheme } from "@mui/material/styles";
import lessToJs from "less-vars-to-js";

import "./css/mui.less";
import "./css/main.less";

// Read the less file in as string: using the raw-loader to override the default loader
const lessFile = require("!!raw-loader!./css/variables.less").default;
export const vars = lessToJs(lessFile, {
  resolveVariables: true,
  stripPrefix: true,
});

vars.gutter = vars.gutter.replace("px", "") * 1;

export const {
  primaryColor,
  secondaryColor,
  font,
  fontColor,
  linkColor,
  teal,
  purple,
  bgLightest,
  paragraph,
  bgLightestShade,
  bgLight,
  bgRegular,
  bgDark,
  bgDarker,
  bgDarkest,
  bgInputs,
  gutter,
  radius,
  checkBoxColor,
  bgLighter,
  textColor,
  inputRadius,
  headerBg,
  drawerText,
  chipTextColor,
  chipBg,
  selectedMenuItemBg,
  lightText,
  dialogBoxShadow,
  badgeBgLight,
  lightWhite,
  cardIconFill,
  lighterWhite,
  orangeText, workspaceItemBg, repoPageContentBg, infoBoxBg, greyishTextColor, grey
} = vars;

const verticalFill = {
  height: "calc(100%)",
  overflow: "hidden",
};

const spacing = [
  0,
  gutter / 2,
  (gutter * 2) / 3,
  gutter,
  24,
  40,
  50,
  100,
  150,
  200,
  300,
];

const theme = {
  darkMode: true,
  spacing,
  palette: {
    mode: "dark",
    primary: {
      main: primaryColor,
      dark: secondaryColor,
      contrastText: "#ffffff",
    },
    secondary: {
      main: secondaryColor,
      dark: primaryColor,
    },
    background: {
      default: bgDarker,
      paper: bgRegular,
    },
  },
  typography: {
    fontFamily: font,
    h1: {
      fontSize: "1.7rem",
      fontWeight: 700,
      marginBottom: "0.6rem",
    },

    h2: {
      fontWeight: "bold",
      lineHeight: "1.25rem",
      fontSize: "1.1rem",
    },
    h3: {
      fontSize: "1.3rem",
      fontWeight: 400,
      flex: 1,
    },
    h4: {
      fontSize: "1.2rem",
      fontWeight: 400,
      flex: 1,
    },
    h5: {
      fontSize: "1rem",
      flex: 1,
      fontWeight: 400,
    },
    h6: {
      lineHeight: 1,
      color: bgInputs,
      fontSize: "0.8rem",
      marginBottom: "0.3rem",
      fontWeight: "bold",
    },
    subtitle1: {
      fontWeight: 400,
      lineHeight: 1,
      fontSize: "1rem",
    },
    subtitle2: {
      lineHeight: 1,
      fontSize: "0.9rem",
      marginTop: "0.5em",
      color: paragraph,
      "& .MuiSvgIcon-root": {
        marginRight: "0.3em",
      },
    },
    body1: {  
      fontSize: "0.875rem",
      color: paragraph,
    }
  },
  components: {
    
    MuiChip: {
      styleOverrides: {
      root: {
        marginRight: spacing[0.5],
        marginLeft: spacing[1],
        color: fontColor,
        label: {
          fontSize: "0.8rem",
        },

        "& .MuiChip-avatar": {
          width: ".63rem",
          height: ".63rem",
          "&.MuiSvgIcon-colorPrimary": {
            color: teal,
          },
          "&.MuiSvgIcon-colorSecondary": {
            color: purple,
          },
        },

        '& .greenStatusDot': {
          '&.MuiSvgIcon-root': {
            width: 6,
            height: 6,
            color: teal
          }
        },
        '& .purpleStatusDot': {
          '&.MuiSvgIcon-root': {
            width:6,
            height: 6,
            color: purple
          }
        }

      },
      labelSmall: {
        paddingLeft: "0.8em",
        paddingRight: "0.8em",
      },
      outlined: {
        backgroundColor: bgDarker,
        border: "none",
      },
      deleteIcon: {
        color: "#a6a6a6",
      },
    }},
    MuiInput: {
      styleOverrides: {
      input: {
        outline: "none !important",
        border: "none !important",
        boxShadow: "none !important",
      },

      root: { color: fontColor },
    }},
    MuiOutlinedInput: {
      styleOverrides: {
      notchedOutline: {
        borderColor: bgLightest,
      },
    }},
    MuiSelect: {
      styleOverrides: {
      root: {
        outline: "none !important",
        border: "none !important",
        boxShadow: "none !important",
      },
      select: { "&:focus": { background: "none" } },
    }},
    MuiGrid: {
      styleOverrides: {
      root: {
        display: "flex",
      },
      container: {
        flex: 1,
      },
    }},
    MuiCard: {styleOverrides: { root: { flex: 1 } }},
    MuiBottomNavigation: {
      styleOverrides: {
      root: { backgroundColor: bgRegular, marginBottom: 8, borderRadius: 4 },
    }},
    MuiPaper: {
      styleOverrides: {
      root: {
        color: "inherit",
        backgroundColor: bgRegular,
        flex: 1,
      },
      rounded: {
        borderRadius: "5px",
      },
    }},
    MuiBottomNavigationAction: {
      styleOverrides: {
      root: { color: fontColor, textTransform: "uppercase" },
      label: { fontSize: "0.65rem", "&.Mui-selected": { fontSize: "0.65rem" } },
    }},
    MuiFormControl: {styleOverrides: { root: { overflow: "visible" } }},
    MuiFab: {},
    MuiButton: {
      styleOverrides: {
      root: {},
      outlined: {
        borderWidth: 2,

        "&:hover": {borderWidth: 2,},
        marginRight: gutter / 2,
        "&:last-child": {
          marginRight: 0,
        },
      },
      contained: {
        "&:hover": {
          opacity: 0.9,
        },
      },
      text: {
        padding: gutter / 2,
      },
      containedPrimary: {
        "&:hover": {
          backgroundColor: primaryColor,
        },
      },
    }},
    MuiMenuItem: {
      styleOverrides: {
      root: {
        fontSize: "1em",
        paddingTop: gutter / 2,
      },
      gutters: {
        paddingLeft: gutter * 2,
        paddingRight: gutter * 2,
      },
    }},
    MuiDialogTitle: { styleOverrides: {root: { fontWeight: 600, fontSize: "1rem" } }},
    MuiDialogContent: { styleOverrides: {root: { paddingBottom: gutter } }},
    MuiCollapse: {
      styleOverrides: {
      container: { padding: 0 },
      wrapper: { padding: "0px!important" },
      }
    },
    MuiIcon: { styleOverrides: {fontSizeLarge: { fontSize: "1.75rem" } }},
    MuiAccordionSummary: {
      styleOverrides: {
      root: {
        padding: "0px!important",
        margin: 0,
        minHeight: "unset!important",
        display: "flex",
        flexDirection: "row-reverse",
      },
      content: { margin: "0px!important", cursor: "auto" },
      expandIcon: { marginRight: 0 },
    }},
    MuiAccordionDetails: {
      styleOverrides: {
      root: {
        padding: 0,
        margin: 0,
        minHeight: "unset!important",
        flexDirection: "column",
      },
    }},
    MuiAccordion: {
      styleOverrides: {
      root: { padding: 0, margin: "0px!important", minHeight: "unset" },
      }
    },
    MuiCardContent: {
      styleOverrides: {
      root: {
        "&:last-child": {
          paddingBottom: 16,
        },
      },
    }},
    MuiDrawer: {
      styleOverrides: {
      root: {
        ...verticalFill,
      },
      paper: {
        ...verticalFill,
        top: "initial",
        "div:only-child": {
          ...verticalFill,
        },
      },
    }},
    MuiTabs: {
      styleOverrides: {
      root: ({theme}) => ({
        width: "100%",

        "& .MuiChip-root": {
          height: "15px",
          "& .MuiChip-label": {
            fontSize: "0.75rem",
          },
        },
        "& .MuiTab-wrapper": {
          display: "flex",
          flexDirection: "row",
        },
        "& .MuiTabs-flexContainer": {
          flexWrap: "wrap",
        },
      }),
      indicator: {
        width: "100%",
      },
    }},
    MuiTab: {
      styleOverrides: {
      root: {
        alignContent: "flex-start",


        overflow: "auto",
        fontSize: "0.9rem",
        fontWeight: 700,
        border: 0,
        maxWidth: "33%",
        minWidth: "fit-content",
        padding: "16px 0",
        marginRight: "1em",
      
        "& .tabTitle": {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          "& .MuiTypography-root": {
            fontSize: "0.857rem",
            fontWeight: 700,
          },
        },
        "&:first-of-type": {
          borderRight: "none",
        },
      },
    }},
    MuiToolbar: {
      styleOverrides: {
      root: {
        minHeight: 15,
      },
    }},
    MuiAvatar: {
      styleOverrides: {
      root: {
        border: `1px solid ${bgLightest}`,
      },
    }},
    MuiLink: {
      styleOverrides: {
      root: {
        textDecoration: "none",
        "&:hover": {
          textDecoration: "underline"
        }
      }
    }},
    MuiAutocomplete: {
      styleOverrides: {
      root: {
        border: `1px solid ${bgLightest}`,
        paddingTop: "10px",
        paddingBottom: "10px",
        borderRadius: inputRadius,
        // '& div:first-of-type': {
        //   paddingBottom: '0px',
        // },
        '& .MuiInputBase-root': {
          // paddingTop: '0px !important',
          backgroundColor: 'transparent',
          '& .MuiAutocomplete-endAdornment': {
            display: 'none',
          },
        },
        "& .MuiFilledInput-underline::before": {
          borderBottom: "none",
        },
        "& .MuiFilledInput-underline::after": {
          borderBottom: "none",
        },
      },
      popupIndicator: { marginRight: 0 },
    }},
  },
};

export default createTheme(theme);
