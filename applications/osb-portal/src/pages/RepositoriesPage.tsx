import React, { useState } from "react";
import { OSBRepository, RepositoryContentType } from "../apiclient/workspaces";
import RepositoryService from "../service/RepositoryService";
import Box from '@material-ui/core/Box';
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Grid from '@material-ui/core/Grid';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CircularProgress from '@material-ui/core/CircularProgress';
import { bgRegular, linkColor, primaryColor, teal, purple, bgLightest, fontColor, paragraph, bgLightestShade } from "../theme";
import { EditRepoDialog } from "../components/repository/EditRepoDialog";
import { UserInfo } from "../types/user";

enum RepositoriesTab {
  all, my
}

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    '& .subheader': {
      display: 'flex',
      background: bgLightest,
      alignItems: 'center',
      height: '3.5rem',
      justifyContent: 'space-between',
      '& .MuiButton-contained': {
        minWidth: '11.5rem',
        marginRight: '2.125rem',
        '&:hover': {
          '& .MuiButton-label': {
            color: primaryColor,
          },
        },
        '& .MuiButton-label': {
          color: fontColor,
        },
      },
      '& .MuiSvgIcon-root': {
        marginRight: theme.spacing(1),
      }
    },
    '& p': {
      fontSize: '1rem',
      lineHeight: 1,
      letterSpacing: '.02rem',
      color: linkColor,
    },
    '& .repository-data': {
      overflow: 'auto',
      maxHeight: '100vh',
      '& strong': {
        display: 'block',
        marginBottom: theme.spacing(1),
        fontSize: '.88rem',
        letterSpacing: '0.02rem',
        fontWeight: '500',
        lineHeight: 1.5,
      },
      '& p': {
        lineHeight: 1.5,
        fontSize: '.88rem',
        letterSpacing: '0.01rem',
        color: paragraph,
        [theme.breakpoints.down('sm')]: {
          marginBottom: theme.spacing(1),
        }
      },

      '& .tag': {
        background: bgLightestShade,
        borderRadius: '1rem',
        fontSize: '.88rem',
        color: paragraph,
        height: '1.9rem',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        marginRight: theme.spacing(1),
        '& .MuiSvgIcon-root': {
          width: '.63rem',
          height: '.63rem',
          marginRight: theme.spacing(1),
          '&.MuiSvgIcon-colorPrimary': {
            color: teal
          },
          '&.MuiSvgIcon-colorSecondary': {
            color: purple
          },
        },
      },

      '& .col': {
        [theme.breakpoints.down('sm')]: {
          paddingLeft: theme.spacing(3),
          paddingRight: theme.spacing(3),
          paddingTop: theme.spacing(0),
          paddingBottom: theme.spacing(0),
        },
        [theme.breakpoints.up('sm')]: {
          padding: theme.spacing(3),
        },
      },
      '& .row': {
        '& .MuiButtonBase-root': {
          minWidth: '11.5rem',
          marginRight: theme.spacing(1),
        },
        '&:hover': {
          backgroundColor: bgRegular,
          cursor: 'pointer',
          '& strong': {
            textDecoration: 'underline',
          },

        },
        '& .MuiGrid-root': {
          '&:last-child': {
            '& .col': {
              justifyContent: 'flex-end',
              [theme.breakpoints.down('sm')]: {
                marginTop: theme.spacing(2),
                '& .MuiButton-outlined': {
                  flexGrow: 1
                }
              },
            },
          },
        },
        border: 'none',
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: bgRegular,
        [theme.breakpoints.down('sm')]: {
          paddingTop: theme.spacing(2),
          paddingBottom: theme.spacing(2),
        },
      },
    },
  }
}));


export const RepositoriesPage = ({ user }: { user: UserInfo }) => {
  const classes = useStyles();
  const [repositories, setRepositories] = React.useState<OSBRepository[]>();

  const openRepoUrl = (uri: string) => window.open(uri, "_blank")
  const [tabValue, setTabValue] = useState(RepositoriesTab.all);
  const handleTabChange = (event: any, newValue: RepositoriesTab) => {
    setTabValue(newValue);
    updateList();

  }

  const updateList = () => {
    switch (tabValue) {
      case RepositoriesTab.all:
        RepositoryService.getRepositories(page).then(repos => setRepositories(repos));
        break;
      case RepositoriesTab.my:
        RepositoryService.getUserRepositories(user.id, page).then(repos => setRepositories(repos));
        break;
    }
  }
  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = () => setDialogOpen(true)

  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    RepositoryService.getRepositories(page).then(repos => setRepositories(repos));
  }, [page])

  return (
    <>
      {
        repositories ? (
          <Box className={classes.root}>

            <Box className="subheader" paddingX={3} justifyContent="space-between">

              <Box >
                {user ?
                  <Tabs
                    value={tabValue}
                    textColor="primary"
                    indicatorColor="primary"
                    onChange={handleTabChange}
                  >
                    <Tab label="All repositories" />
                    {<Tab label="My repositories" />}
                  </Tabs>
                  : <Typography component="h1" color="primary" >All repositories</Typography>
                }
              </Box>
              {user &&
                <Box>
                  <Button variant="contained" disableElevation={true} color="primary" onClick={openDialog}>
                    <AddIcon />
                    Add repository
                  </Button>
                </Box>
              }

            </Box>

            <Box className="repository-data scrollbar">
              {
                repositories.map((repository) =>
                  <Grid container={true} spacing={0} alignItems="center" className="row" key={repository.id}>
                    <Grid item={true} xs={12} sm={4}>
                      <Box className="col">
                        <Typography component="strong">
                          {repository.name}
                        </Typography>
                        <Typography>
                          {repository.summary}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item={true} xs={12} sm={2}>
                      <Box className="col">
                        <Typography>
                          {repository?.user?.firstName} {repository?.user?.lastName}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item={true} xs={12} sm={3}>
                      <Box className="col" display="flex" alignItems="center" flexWrap="wrap">
                        {repository.contentTypes.split(',').map((type, index) =>
                          <Box className="tag" display="flex" alignItems="center" paddingX={1} marginY={1} key={type}>
                            <FiberManualRecordIcon color={index % 2 === 0 ? "primary" : "secondary"} />
                            {type}
                          </Box>
                        )}
                      </Box>
                    </Grid>
                    <Grid item={true} xs={12} sm={3}>
                      <Box className="col" display="flex" flex={1} alignItems="center">
                        <Button variant="outlined" onClick={() => openRepoUrl(repository.uri)}>
                          See on {repository.repositoryType}
                        </Button>
                        <ChevronRightIcon />
                      </Box>
                    </Grid>
                  </Grid>
                )
              }
            </Box>
          </Box>
        ) : <CircularProgress
          size={48}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -24,
            marginLeft: -24,
          }}
        />
      }
      { user && <EditRepoDialog user={user} title="Add repository" dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} onSubmit={updateList} />}
    </>
  );
};

export default RepositoriesPage