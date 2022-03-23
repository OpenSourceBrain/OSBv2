
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import lessToJs from 'less-vars-to-js';

import './css/mui.less';
import './css/main.less';
import { Hidden } from '@material-ui/core';

// Read the less file in as string: using the raw-loader to override the default loader
const lessFile = require('!!raw-loader!./css/variables.less').default;
export const vars = lessToJs(lessFile, { resolveVariables: true, stripPrefix: true });

vars.gutter = vars.gutter.replace('px', '') * 1;

export const {
  primaryColor, secondaryColor, font, fontColor, linkColor, teal, purple, bgLightest, paragraph, bgLightestShade,
  bgLight, bgRegular, bgDark, bgDarker, bgDarkest, bgInputs, gutter, radius, checkBoxColor, bgLighter, textColor, inputRadius
} = vars;

const verticalFill = {
  height: 'calc(100%)',
  overflow: 'hidden'
}

const spacing = [0, gutter / 2, gutter * 2 / 3, gutter, 24, 40, 50, 100, 150, 200, 300];

const theme = {
  darkMode: true,
  spacing,
  palette: {
    type: 'dark',
    primary: {
      main: primaryColor,
      dark: secondaryColor,
      contrastText: '#ffffff'
    },
    secondary: {
      main: secondaryColor,
      dark: primaryColor,

    },
    background: {
      default: bgDarker,
      paper: bgRegular
    },
  },
  typography: {
    fontFamily: font,
    h1: {
      fontSize: '1.7rem',
      fontWeight: 700,
      marginBottom: '0.6rem'
    },

    h2: {
      fontSize: '1.1rem',
      fontWeight: 700,
      fontWeight: "bold",
      marginBottom: spacing[3],
      lineHeight: "1.25rem",
      paddingBottom: spacing[2],
      fontSize: '1.1rem',
      borderBottom: `3px solid ${bgInputs}`
    },
    h3: {
      fontSize: '1.3rem',
      fontWeight: 400,
      flex: 1,
    },
    h4: {
      fontSize: '1.2rem',
      fontWeight: 400,
      flex: 1
    },
    h5: {
      fontSize: '1rem',
      flex: 1,
      fontWeight: 400,
    },
    h6: {
      lineHeight: 1,
      fontWeight: 400,
      color: bgInputs,
      fontSize: '0.8rem',
      marginBottom: '0.3rem',
      fontWeight: 'bold',
    },
    subtitle1: {
      fontWeight: 400,
      lineHeight: 1,
      fontSize: '1rem'
    },
    subtitle2: {
      fontWeight: 400,
      lineHeight: 1,
      fontSize: '0.9em',
      marginBottom: '0.3rem',
      fontWeight: 'bold',
      '& .MuiSvgIcon-root': {
        marginRight: "0.3em"
      }
    }
  },
  overrides: {
    MuiChip: {
      root: {
        marginRight: spacing[0.5],
        marginLeft: spacing[1],
        color: fontColor,
        label: {
          fontSize: '0.8rem',
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
        
      },
      labelSmall: {
        paddingLeft: "0.8em",
        paddingRight: "0.8em"
      },
      outlined: {
        backgroundColor: bgDarker,
        border: 'none',
      },
      deleteIcon: {
        color: '#a6a6a6',
      },
    },
    MuiInput: {
      input: {
        outline: 'none !important',
        border: 'none !important',
        boxShadow: 'none !important',
      },
    
      root: { color: fontColor }

    },
    MuiOutlinedInput: {
      notchedOutline: {
        borderColor: bgLightest,
      }
    },
    MuiSelect: {
      root: {
        outline: 'none !important',
        border: 'none !important',
        boxShadow: 'none !important'
      },
      select: { "&:focus": { background: "none" } },
    },
    MuiGrid: {
      root: {
        display: 'flex'
      },
      container: {
        flex: 1
      }
    },
    MuiCard: { root: { flex: 1 } },
    MuiBottomNavigation: { root: { backgroundColor: bgRegular, marginBottom: 8, borderRadius: 4 } },
    MuiPaper: {
      root: {
        color: 'inherit', backgroundColor: bgRegular, flex: 1
      },
      rounded: {
        borderRadius: '5px'
      },
    },
    MuiBottomNavigationAction: {
      root: { color: fontColor, textTransform: 'uppercase' },
      label: { fontSize: "0.65rem", "&.Mui-selected": { fontSize: "0.65rem" } },
    },
    MuiFormControl: { root: { overflow: 'visible' } },
    MuiFab: {
    },
    MuiButton: {
      root: {

      },
      outlined: {
        borderWidth: 2,
        borderColor: fontColor,
        marginRight: gutter / 2,
        '&:last-child': {
          marginRight: 0
        }
      },
      contained: {
        "&:hover": {
          opacity: 0.9,
        },
      },
      text: {
        padding: gutter / 2
      },
      containedPrimary: {
          '&:hover': {
            backgroundColor: primaryColor,
          },
      },
    },
    MuiMenuItem: {
      root: {
        fontSize: '1em',
        paddingTop: gutter / 2,
      },
      gutters: {
        paddingLeft: gutter * 2,
        paddingRight: gutter * 2
      }

    },
    MuiDialogTitle: { root: { fontWeight: 600, fontSize: '1rem' } },
    MuiDialogContent: { root: { paddingBottom: gutter } },
    MuiCollapse: {
      container: { padding: 0 },
      wrapper: { padding: "0px!important" }
    },
    MuiIcon: { fontSizeLarge: { fontSize: '1.75rem' } },
    MuiAccordionSummary: {
      root: {
        padding: '0px!important', margin: 0, minHeight: 'unset!important', display: "flex",
        flexDirection: "row-reverse"
      },
      content: { margin: '0px!important', cursor: 'auto' },
      expandIcon: { marginRight: 0 }
    },
    MuiAccordionDetails: { root: { padding: 0, margin: 0, minHeight: 'unset!important', flexDirection: 'column' } },
    MuiAccordion: { root: { padding: 0, margin: '0px!important', minHeight: 'unset' } },
    MuiCardContent: {
      root: {
        '&:last-child': {
          paddingBottom: 16
        }
      }
    },
    MuiDrawer: {
      root: {
        ...verticalFill

      },
      paper: {
        ...verticalFill,
        'div:only-child': {
          ...verticalFill,
        }
      }
    },
    MuiTabs: {
      root: {
        '& .MuiChip-root': {
          height: '15px',
          '& .MuiChip-label': {
            fontSize: '0.75rem',
          },
        },
        '& .MuiTab-wrapper': {
          display: 'flex',
          flexDirection: 'row',
        },
      },
      indicator: {
        width: '100%',
      }
    },
    MuiTab: {
      root: {
        alignContent: 'flex-start',
        
        paddingRight: "1rem",
        paddingTop: 0,
        paddingLeft: 0,
        paddingBottom: 0,
        fontSize: '0.9rem',
        fontWeight: 700,
        border: 0,
        // minWidth: '150px !important',
        maxWidth: 'auto',
        '&:first-child': {
          borderRight: 'none',
        },
      }
    },
    MuiToolbar: {
      root: {
        minHeight: 15
      }
    },
    MuiAvatar: {
      root: {
        border: `1px solid ${bgLightest}`,
      }
      
    },
    MuiAutocomplete: {
      root: {
        border: `1px solid ${bgLightest}`,
        paddingTop: '10px',
        paddingBottom: '10px',
        borderRadius: inputRadius,
        '& div:first-child': {
            paddingBottom: '0px',
        },
        '& .MuiInputBase-root': {
          paddingTop: '0px !important',
          backgroundColor: 'transparent',
          '& .MuiAutocomplete-endAdornment': {
            display: 'none',
          },
        },
        '& .MuiFilledInput-underline::before': {
          borderBottom: 'none',
        },
        '& .MuiFilledInput-underline::after': {
          borderBottom: 'none',
        },
      },
      popupIndicator: { marginRight: 0 }
    },
  },
}

export default createMuiTheme(theme);
