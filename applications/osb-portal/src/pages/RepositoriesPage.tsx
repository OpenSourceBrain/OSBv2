import React, { useState } from "react";
import { OSBRepository, RepositoryContentType } from "../apiclient/workspaces";
import RepositoryService from "../service/RepositoryService";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CircularProgress from "@material-ui/core/CircularProgress";
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
} from "../theme";
import { EditRepoDialog } from "../components/repository/EditRepoDialog";
import { UserInfo } from "../types/user";
import Avatar from "@material-ui/core/Avatar";

enum RepositoriesTab {
  all,
  my,
}

const useStyles = makeStyles((theme) => ({
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
        "&:hover": {
          "& .MuiButton-label": {
            color: primaryColor,
          },
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
      paddingRight: 0,
      overflow: "auto",
      backgroundColor: bgDarkest,
      height: "calc(100vh - 8.8rem)",
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
}));

export const RepositoriesPage = ({ user }: { user: UserInfo }) => {
  const classes = useStyles();
  const [repositories, setRepositories] = React.useState<OSBRepository[]>();

  const openRepoUrl = (uri: string) => window.open(uri, "_blank");
  const [tabValue, setTabValue] = useState(RepositoriesTab.all);
  const handleTabChange = (event: any, newValue: RepositoriesTab) => {
    setTabValue(newValue);
    updateList();
  };

  const updateList = () => {
    switch (tabValue) {
      case RepositoriesTab.all:
        RepositoryService.getRepositories(page).then((repos) =>
          setRepositories(repos)
        );
        break;
      case RepositoriesTab.my:
        RepositoryService.getUserRepositories(user.id, page).then((repos) =>
          setRepositories(repos)
        );
        break;
    }
  };
  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = () => setDialogOpen(true);

  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    RepositoryService.getRepositories(page).then((repos) =>
      setRepositories(repos)
    );
  }, [page]);

  return (
    <>
      {repositories ? (
        <Box className={classes.root}>
          <Box
            className="subheader"
            paddingX={3}
            justifyContent="space-between"
          >
            <Box>
              {user ? (
                <Tabs
                  value={tabValue}
                  textColor="primary"
                  indicatorColor="primary"
                  onChange={handleTabChange}
                >
                  <Tab label="All repositories" />
                  <Tab label="My repositories" />
                </Tabs>
              ) : (
                <Typography component="h1" color="primary">
                  All repositories
                </Typography>
              )}
            </Box>
            {user && (
              <Box>
                <Button
                  variant="contained"
                  disableElevation={true}
                  color="primary"
                  onClick={openDialog}
                >
                  <AddIcon />
                  Add repository
                </Button>
              </Box>
            )}
          </Box>

          <Box className="repository-data scrollbar">
            {repositories.map((repository) => (
              <Grid
                container={true}
                className="row"
                spacing={0}
                key={repository.id}
              >
                <Grid item={true} xs={12} sm={4} md={4}>
                  <Box className="col">
                    <Typography component="strong">
                      {repository.name}
                    </Typography>
                    <Typography>{repository.summary}</Typography>
                  </Box>
                </Grid>
                <Grid item={true} xs={12} sm={4} md={2}>
                  <Box className="col">
                    <Typography>
                      {repository?.user?.firstName} {repository?.user?.lastName}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item={true} xs={12} sm={4} md={3}>
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
                      >
                        <FiberManualRecordIcon
                          color={index % 2 === 0 ? "primary" : "secondary"}
                        />
                        {type}
                      </Box>
                    ))}
                  </Box>
                </Grid>
                <Grid item={true} xs={12} sm={12} md={3}>
                  <Box
                    className="col"
                    display="flex"
                    flex={1}
                    alignItems="center"
                  >
                    <Button
                      variant="outlined"
                      onClick={() => openRepoUrl(repository.uri)}
                    >
                      See on {repository.repositoryType}
                    </Button>
                    <Avatar src="/images/arrow_right.svg" />
                  </Box>
                </Grid>
              </Grid>
            ))}
          </Box>
        </Box>
      ) : (
        <CircularProgress
          size={48}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: -24,
            marginLeft: -24,
          }}
        />
      )}
      {user && (
        <EditRepoDialog
          user={user}
          title="Add repository"
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          onSubmit={updateList}
        />
      )}
    </>
  );
};

export default RepositoriesPage;
