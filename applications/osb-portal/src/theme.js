
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import lessToJs from 'less-vars-to-js';
require('./css/mui.less');
require('./css/main.less');
// Read the less file in as string: using the raw-loader to override the default loader
export const vars = lessToJs(require('!!raw-loader!./css/variables.less'), { resolveVariables: true, stripPrefix: true });


export const {
  primaryColor, secondaryColor, font, fontColor,
  bgLight, bgRegular, bgDark, bgDarker, bgDarkest, bgInputs, gutter, radius
} = vars;


const theme = {
  darkMode: true,
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
      default: bgDarkest,
      paper: bgRegular
    },
  },
  typography: {
    fontFamily: font,
    h1: {
      fontSize: '3rem',
      fontWeight: 400
    },
    
    h2: {
      fontSize: '2.5rem',
      fontWeight: 400
    },
    h3: {
      fontSize: '2.1rem',
      fontWeight: 400
    },
    h4: {
      fontSize: '1.8rem',
      fontWeight: 400
    },
    h5: {
      fontSize: '1.5rem'
    },
    h6: {
      fontSize: '1.1rem'
    },
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
     
    },
    MuiCard: { root: { backgroundColor: bgDarker, overflowY: 'auto', flex: 1 } },
    MuiBottomNavigation: { root: { backgroundColor: bgRegular, marginBottom: 8, borderRadius: 4 } },
    MuiPaper: { root: { color: 'inherit', backgroundColor: bgRegular } },
    MuiBottomNavigationAction: { 
      root: { color: fontColor, textTransform: 'uppercase' },
      label: { fontSize: "0.65rem", "&.Mui-selected": { fontSize: "0.65rem" } },
    },
    MuiFormControl: { root: { overflow: 'visible' } },
    MuiFab:{ 
      secondary: { color: fontColor },
      primary: { color: fontColor } 
    },
    MuiButton: { 
      contained: { 
        color: fontColor,
        backgroundColor: bgInputs
      },
      containedSecondary: { color: fontColor },
      containedPrimary: { color: fontColor },
    },
    MuiMenuItem: { 
      root:{
        color: fontColor,
        paddingTop: gutter / 2, 
        fontSize: '1.0rem', 
        fontWeight: 200
      },
      gutters: {
        paddingLeft: gutter * 2,
        paddingRight: gutter * 2
      }
       
    },
    MuiDialogTitle: { root: { color: fontColor } },
    MuiTypography: { root: { color: fontColor } },
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
    MuiCardContent: { root: { padding: 8 } },
    MuiToolbar: {
      root: {
        minHeight: 15
      }
    }
  }
}

export default createMuiTheme(theme);