import * as React from "react";
import { OSBRepository } from "../apiclient/workspaces";
import RepositoryService from "../service/RepositoryService";
import Box from '@material-ui/core/Box';
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Grid from '@material-ui/core/Grid';
import { bgRegular, linkColor, primaryColor, teal, purple, bgLightest, fontColor, paragraph, bgLightestShade } from "../theme";

const useStyles = makeStyles((theme) => ({
  root: {
    '& .subheader': {
      display: 'flex',
      background: bgLightest,
      alignItems: 'center',
      height: '3.5rem',
      justifyContent: 'space-between',
      '& .MuiButtonBase-root': {
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



export const RepositoriesPage = () => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [repositories, setRepositories] = React.useState<OSBRepository[]>();
  React.useEffect(() => {
    RepositoryService.getRepositories(page).then(repos => setRepositories(repos));
  }, [page])

  return (
    <>
      {
        repositories && (
          <Box className={classes.root}>
            <Box className="subheader" paddingX={3}>
              <Typography>All Repositories</Typography>
              <Button variant="contained" disableElevation color="primary">
                <AddIcon />
                ADD REPOSITORY
              </Button>
            </Box>

            <Box className="repository-data">
              <Grid container spacing={0} alignItems="center" className="row">
                <Grid item xs={12} sm={4}>
                  <Box className="col">
                    <Typography component="strong">
                      NWB Showcase
                    </Typography>
                    <Typography>
                      Sample Neurophysiology experimental data from UCL labs.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Box className="col">
                    <Typography>
                      Padraig Gleeson
                    </Typography>
                  </Box>

                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box className="col" display="flex" alignItems="center" flexWrap="wrap">
                    <Box className="tag" display="flex" alignItems="center" paddingX={1} marginY={1}>
                      <FiberManualRecordIcon color="primary" />
                      Experimental Data
                    </Box>
                    <Box className="tag" display="flex" alignItems="center" paddingX={1}>
                      <FiberManualRecordIcon color="secondary" />
                      Modeling
                    </Box>
                  </Box>

                </Grid>
                <Grid item xs={12} sm={2}>
                  <Box className="col" display="flex" flex={1} alignItems="center">
                    <Button variant="outlined">
                      SEE ON GITHUB
                    </Button>
                    <ChevronRightIcon />
                  </Box>
                </Grid>
              </Grid>

              <Grid container spacing={0} alignItems="center" className="row">
                <Grid item xs={12} sm={4}>
                  <Box className="col">
                    <Typography component="strong">
                      NWB Showcase
                    </Typography>
                    <Typography>
                      Sample Neurophysiology experimental data from UCL labs.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Box className="col">
                    <Typography>
                      Padraig Gleeson
                    </Typography>
                  </Box>

                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box className="col" display="flex" alignItems="center" flexWrap="wrap">
                    <Box className="tag" display="flex" alignItems="center" paddingX={1} marginY={1}>
                      <FiberManualRecordIcon color="primary" />
                      Experimental Data
                    </Box>
                    <Box className="tag" display="flex" alignItems="center" paddingX={1}>
                      <FiberManualRecordIcon color="secondary" />
                      Modeling
                    </Box>
                  </Box>

                </Grid>
                <Grid item xs={12} sm={2}>
                  <Box className="col" display="flex" flex={1} alignItems="center">
                    <Button variant="outlined">
                      SEE ON GITHUB
                    </Button>
                    <ChevronRightIcon />
                  </Box>
                </Grid>
              </Grid>


              <Grid container spacing={0} alignItems="center" className="row">
                <Grid item xs={12} sm={4}>
                  <Box className="col">
                    <Typography component="strong">
                      NWB Showcase
                    </Typography>
                    <Typography>
                      Sample Neurophysiology experimental data from UCL labs.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Box className="col">
                    <Typography>
                      Padraig Gleeson
                    </Typography>
                  </Box>

                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box className="col" display="flex" alignItems="center" flexWrap="wrap">
                    <Box className="tag" display="flex" alignItems="center" paddingX={1} marginY={1}>
                      <FiberManualRecordIcon color="primary" />
                      Experimental Data
                    </Box>
                    <Box className="tag" display="flex" alignItems="center" paddingX={1}>
                      <FiberManualRecordIcon color="secondary" />
                      Modeling
                    </Box>
                  </Box>

                </Grid>
                <Grid item xs={12} sm={2}>
                  <Box className="col" display="flex" flex={1} alignItems="center">
                    <Button variant="outlined">
                      SEE ON GITHUB
                    </Button>
                    <ChevronRightIcon />
                  </Box>
                </Grid>
              </Grid>


              <Grid container spacing={0} alignItems="center" className="row">
                <Grid item xs={12} sm={4}>
                  <Box className="col">
                    <Typography component="strong">
                      NWB Showcase
                    </Typography>
                    <Typography>
                      Sample Neurophysiology experimental data from UCL labs.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Box className="col">
                    <Typography>
                      Padraig Gleeson
                    </Typography>
                  </Box>

                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box className="col" display="flex" alignItems="center" flexWrap="wrap">
                    <Box className="tag" display="flex" alignItems="center" paddingX={1} marginY={1}>
                      <FiberManualRecordIcon color="primary" />
                      Experimental Data
                    </Box>
                    <Box className="tag" display="flex" alignItems="center" paddingX={1}>
                      <FiberManualRecordIcon color="secondary" />
                      Modeling
                    </Box>
                  </Box>

                </Grid>
                <Grid item xs={12} sm={2}>
                  <Box className="col" display="flex" flex={1} alignItems="center">
                    <Button variant="outlined">
                      SEE ON GITHUB
                    </Button>
                    <ChevronRightIcon />
                  </Box>
                </Grid>
              </Grid>

            </Box>
          </Box>
        )
      }
    </>
  );
};

export default RepositoriesPage