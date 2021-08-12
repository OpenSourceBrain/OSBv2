import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";

import { OSBRepository } from "../../apiclient/workspaces";
import RepositoryActionsMenu from "./RepositoryActionsMenu";
import { UserInfo } from "../../types/user";
import {
  bgRegular,
  bgDarkest,
  paragraph,
  bgLightestShade,
  teal,
  purple,
} from "../../theme";

interface RepositoriesProps {
  repositories: OSBRepository[];
  showSimpleVersion?: boolean;
  handleRepositoryClick: (repositoryId: number) => void;
  user?: UserInfo;
}

const useStyles = makeStyles((theme) => ({
  repositoryData: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingRight: 0,
    overflow: "auto",
    backgroundColor: bgDarkest,
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
        padding: theme.spacing(1),
      },
      [theme.breakpoints.up("md")]: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
      },
    },
    "& .row": {
      borderWidth: `1px 0 1px 0`,
      borderStyle: "solid",
      borderColor: bgRegular,

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
            minHeight: 120,
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
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
      },
    },
  },
  repositoryActionsBox: {
    display: 'flex',
    '& .MuiButtonBase-root': {
      minWidth: `${theme.spacing(2)}px !important`,
    },
    '& .MuiIconButton-root': {
      marginLeft: theme.spacing(1),
      '& .MuiIconButton-label': {
        width: 'fit-content',
      }
    },
  },
}))

export default (props: RepositoriesProps) => {
  const classes = useStyles();

  const openRepoUrl = (uri: string) => window.open(uri, "_blank");
  const showSimpleVersion = typeof props.showSimpleVersion === 'undefined' ? false : props.showSimpleVersion;


  return (
    <Box className={`${classes.repositoryData} scrollbar virticalFill`}>
      {props.repositories.map((repository) => (
        <Grid
          container={true}
          className="row"
          spacing={0}
          key={repository.id}
        >
          <Grid item={true} xs={12} sm={showSimpleVersion ? 5 : 4} md={showSimpleVersion ? 5 : 2}
            onClick={() => props.handleRepositoryClick(repository.id)}>
            <Box className="col">
              <Typography component="strong">
                {repository.name}
              </Typography>
              <Typography>{repository.summary}</Typography>
            </Box>
          </Grid>

          {!showSimpleVersion && <Grid item={true} xs={12} sm={4} md={4} onClick={() => props.handleRepositoryClick(repository.id)}>
            <Box className="col">
              <Typography>
                {repository?.user?.firstName} {repository?.user?.lastName}
              </Typography>
            </Box>
          </Grid>}

          <Grid item={true} xs={showSimpleVersion ? 11 : 12} sm={showSimpleVersion ? 6 : 4} md={showSimpleVersion ? 6 : 3}
            onClick={() => props.handleRepositoryClick(repository.id)}>
            <Box
              className="col"
              display="flex"
              alignItems="center"
              flexWrap="wrap"
            >
              {repository.contentTypes.split(",").map((type, index) => (
                <Box
                  className="tag"
                  display="flex"
                  alignItems="center"
                  paddingX={1}
                  marginY={1}
                  key={type}
                  m={0}
                >
                  <FiberManualRecordIcon color={index % 2 === 0 ? "primary" : "secondary"} />{type}
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item={true} xs={showSimpleVersion ? 1 : 12} sm={showSimpleVersion ? 1 : 12} md={showSimpleVersion ? 1 : 3} >
            <Box
              className="col"
              display="flex"
              flex={1}
              alignItems="center"
            >
              {!showSimpleVersion && <Button
                variant="outlined"
                onClick={() => {openRepoUrl(repository.uri); props.handleRepositoryClick(repository.id); }}
              >
                See on {repository.repositoryType}
              </Button>}
              <Avatar src="/images/arrow_right.svg" onClick={() => props.handleRepositoryClick(repository.id)}/>
            </Box>
            { props.user && <Box className={classes.repositoryActionsBox}>
              <RepositoryActionsMenu repository={repository} user={props.user} />
            </Box>}
          </Grid>
        </Grid>
      ))}
    </Box>
  )
}