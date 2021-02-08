import * as React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline, makeStyles } from "@material-ui/core";


import { Provider } from 'react-redux';

import theme from "../theme";
import { Header, ErrorDialog } from "../components";
import store from '../store/store';

import SentryErrorBoundary from "../components/sentry/SentryErrorBoundary";



import { Workspace } from "../types/workspace";




interface InitialProps {
    cookies: unknown,
    location: string,
    publicWorkspaces: Workspace[],
    userWorkspaces: Workspace[]

}

const useStyles = makeStyles(() => ({
    mainContainer: {
        overflow: "auto",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.up("md")]: {
            maxHeight: "100vh",
            overflow: "hidden",
        }
    },
}));

export const App = ({ frontMatter, children }: any) => {
    const classes = useStyles();
    return <>
        <h1>{frontMatter.title}</h1>
        {children}
    </>

};



export default App;