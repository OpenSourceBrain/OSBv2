import * as React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import gfm from "remark-gfm";
import Box from "@mui/material/Box";

import {
  bgRegular,
  linkColor,
  bgLightest,
  fontColor,
  bgLightestShade,
  bgInputs,
  radius,
} from "../../theme";


const boxStyle = {
  color: "white",
  backgroundColor: "transparent",
  "& .preview-box": {
    overflowWrap: "anywhere",
    maxWidth: "100%",
    flexGrow: 1,
    "& a": {
      color: linkColor,
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    "&  code": {
      backgroundColor: bgLightestShade,
    },
    "& pre": {
      padding: 2,
      backgroundColor: bgLightestShade,
      borderRadius: radius,
      "&::-webkit-scrollbar": {
        height: "5px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: bgInputs,
      },
      "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
      },
    },
    "& blockquote": {
      padding: "0 1em",
      borderLeft: `0.25em solid ${bgLightestShade}`,
      marginLeft: 0,
      "& p": {
        padding: 0,
      },
    },
    "& h1": {
      marginTop: 0,
      fontWeight: "normal",
    },
    "& h2": {
      marginTop: 2,
      fontWeight: "500",
      paddingBottom: "5px",
    },
    "& h1, h2": {
      borderBottom: `1px solid ${bgRegular}`,
    },
    "& p": {
      color: "rgba(255, 255, 255, 0.8)",
      fontWeight: "normal",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#c4c4c4",
    },
    "& p img": {
      maxWidth: "100%",
      md: {
        maxWidth: "75vw",
      },
    },
    "& .subheader": {
      display: "flex",
      background: bgLightest,
      alignItems: "center",
      height: "4.062rem",
      justifyContent: "space-between",
      "& .MuiSvgIcon-root": {
        width: "1rem",
        marginRight: 1,
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
          "&:first-of-type": {
            color: fontColor,
          },
        },
      },
    },
  },
}

export const MarkdownViewer = ({
  children,
  className
}: {
  children: any,
  className?: string;
}) => {

  return (
    <Box className={`verticalFit ${className}`} sx={boxStyle}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, gfm]}
        className={`preview-box scrollbar `}
      >
        {children}
      </ReactMarkdown> 
   </Box>
  );
};

export default MarkdownViewer;
