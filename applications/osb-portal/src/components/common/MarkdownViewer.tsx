import * as React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import gfm from 'remark-gfm';
import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";


import {
  bgRegular,
  linkColor,
  bgLightest,
  fontColor,
  bgLightestShade,
  bgInputs,
  radius,
} from "../../theme";


const useStyles = makeStyles((theme) => ({
  root: {
    "& .preview-box": {
      padding: theme.spacing(3),
      border: `3px solid #1e1e1e`,
      backgroundColor: "#191919",
      overflowWrap: 'anywhere',
      flexGrow: 1,
      "& a": {
        color: linkColor,
        textDecoration: 'none',
        "&:hover": {
          textDecoration: 'underline',
        },
      },
      "& pre": {
        padding: theme.spacing(2),
        backgroundColor: bgLightestShade,
        borderRadius: radius,
        "&::-webkit-scrollbar": {
          height: '5px',
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: bgInputs,
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: 'transparent',
        },
      },
      "& h1": {
        marginTop: 0,
        fontWeight: 'normal',
      },
      "& h2": {
        marginTop: theme.spacing(5),
        fontWeight: '500',
        paddingBottom: '5px',
      },
      "& h1, h2": {
        borderBottom: `1px solid ${bgRegular}`,
      },
      "& p": {
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: 'normal',
        fontSize: '0.8rem',
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: 'transparent',
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: '#c4c4c4',
      },
      "& p img": {
        maxWidth: '30vw',
        [theme.breakpoints.down("sm")]: {
          maxWidth: '75vw',
        },
      },
    }
  },
  "& .subheader": {
    display: "flex",
    background: bgLightest,
    alignItems: "center",
    height: "4.062rem",
    justifyContent: "space-between",
    "& .MuiSvgIcon-root": {
      width: "1rem",
      marginRight: theme.spacing(1),
      height: "auto",
      cursor: "pointer",
    },

    "& h1": {
      fontSize: ".88rem",
      lineHeight: 1,
      display: "flex",
      alignItems: "center",
      "& span": {
        fontSize: ".88rem",
        lineHeight: 1,
        fontWeight: "bold",
        "&:not(:last-child)": {
          cursor: "pointer",
          fontWeight: "normal",
          marginRight: ".5rem",
          "&:after": {
            content: '"/"',
            display: "inline-block",
            paddingLeft: ".5rem",
          },
        },
        "&:first-child": {
          color: fontColor,
        },
      },
    },

  },

}));



export const MarkdownViewer = ({ text }: { text: string }) => {



  const classes = useStyles();




  return (
    <Paper className={`verticalFit ${classes.root}`}>
      <ReactMarkdown rehypePlugins={[rehypeRaw, gfm]} className="preview-box scrollbar">
        {text}
      </ReactMarkdown>
    </Paper>

  );
};

export default MarkdownViewer;
