
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import lessToJs from 'less-vars-to-js';

require('./css/mui.less');
require('./css/main.less');
// Read the less file in as string: using the raw-loader to override the default loader
export const vars = lessToJs(require('!!raw-loader!./css/variables.less'), { resolveVariables: true, stripPrefix: true });

vars.gutter = vars.gutter.replace('px', '') * 1;

export const {
  primaryColor, secondaryColor, font, fontColor,
  bgLight, bgRegular, bgDark, bgDarker, bgDarkest, bgInputs, gutter, radius
} = vars;


const theme = {
  darkMode: true,
  spacing: [0, gutter / 2, gutter * 2 / 3, gutter, 30, 40, 50, 100, 150, 200],
  typography: {
    useNextVariants: true,
    htmlFontSize: 12,
    fontSize: 10,
    fontFamily: font,
    button: {
      textTransform: "none",
      fontSize: "1.0rem"
    }
  },
  palette: {
    type: 'dark',
    primary: {
      main: primaryColor, 
      dark: secondaryColor
    },
    secondary: { 
      main: secondaryColor, 
      dark: primaryColor 
    },
    background: {
      default: bgDarker,
      paper: bgRegular
    },
  },
  typography: {
    fontFamily: font,
    h1: {
      fontSize: '1.9rem',
      fontWeight: 400,
      flex: 1
    },
    
    h2: {
      fontSize: '1.5rem',
      fontWeight: 400,
      flex: 1
    },
    h3: {
      fontSize: '1.4rem',
      fontWeight: 400,
      flex: 1
    },
    h4: {
      fontSize: '1.3rem',
      fontWeight: 400,
      flex: 1
    },
    h5: {
      fontSize: '1.2rem',
      flex: 1,
      fontWeight: 400,
    },
    h6: {
      fontSize: '1rem',
      flex: 1,
      lineHeight: 1,
      fontWeight: 400,
    },
    subtitle1: {
      fontWeight: 400,
      lineHeight: 1,
      fontSize: '1rem'
    },
    subtitle2: {
      fontWeight: 400,
      lineHeight: 1,
    }
  },
  overrides: {
    MuiInput: {
      input: {
        outline: 'none !important', 
        border: 'none !important', 
        boxShadow: 'none !important',
      },
      root:{ color: fontColor }

    },
    MuiSelect: {
      root: {
        outline: 'none !important', 
        border: 'none !important', 
        boxShadow: 'none !important'
      },
      select: { "&:focus" :{ background: "none" } },
    },
    MuiGrid: {
     root: {
       display: 'flex'
     }
    },
    MuiCard: { root: { flex: 1 } },
    MuiBottomNavigation: { root: { backgroundColor: bgRegular, marginBottom: 8, borderRadius: 4 } },
    MuiPaper: { root: { color: 'inherit', backgroundColor: bgRegular, flex: 1 } },
    MuiBottomNavigationAction: { 
      root: { color: fontColor, textTransform: 'uppercase' },
      label: { fontSize: "0.65rem", "&.Mui-selected": { fontSize: "0.65rem" } },
    },
    MuiFormControl: { root: { overflow: 'visible' } },
    MuiFab:{ 
    },
    MuiButton: { 
      root: {
        
      },
      outlined: {
        borderWidth: 2,
        borderColor: fontColor,
        marginRight: gutter * 3 / 2,
        '&:last-child': {
          marginRight: 0
        }
      },
      text: {
        padding: gutter / 2
      }
    },
    MuiMenuItem: { 
      root:{
        fontSize: '1em',
        paddingTop: gutter / 2, 
      },
      gutters: {
        paddingLeft: gutter * 2,
        paddingRight: gutter * 2
      }
       
    },
    MuiDialogTitle: { root: { fontWeight: 600, fontSize: '1rem' } },
    MuiDialogContent: { root: { paddingBottom: gutter} },
    MuiCollapse: { 
      container: { padding: 0 },
      wrapper: { padding: "0px!important" }
    },
    MuiIcon: { fontSizeLarge: { fontSize: '1.75rem' } },
    MuiExpansionPanelSummary: { 
      root: { padding: '0px!important', margin: 0, minHeight: 'unset!important' },
      content: { margin: '0px!important', cursor: 'auto' },
      expandIcon: { marginRight: 0 }
    },
    MuiExpansionPanelDetails: { root: { padding: 0, margin: 0, minHeight: 'unset!important', flexDirection: 'column' } },
    MuiExpansionPanel: { root: { padding: 0, margin: '0px!important', minHeight: 'unset' } },
    MuiAutocomplete: { popupIndicator: { marginRight: 0 } },
    MuiCardContent: { 
      root: {
        '&:last-child': {
          paddingBottom: 16
        }
      }
     },
    MuiTab: {
      root: {
        textTransform: 'none',
        fontSize: '1.1rem',
        fontWeight: 400,
        paddingBottom: 0
      }
    },
    MuiToolbar: {
      root: {
        minHeight: 15
      }
    }
  }
}

export default createMuiTheme(theme);