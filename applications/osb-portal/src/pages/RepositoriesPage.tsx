import React, { useState } from "react";
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
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { bgRegular, linkColor, primaryColor, teal, purple, bgLightest, fontColor, paragraph, bgLightestShade } from "../theme";

const useStyles = makeStyles((theme) => ({
  root: {
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
// ToDO : to be removed once api starts returning
const mockRepositoryData = [
  {
    id: 1, name: 'NWB Showcase', repositoryType: 'Github', repositoryContentTypes: 'Experimental Data, Modelling', uri: 'https://github.com/OpenSourceBrain/OSBv2', description: 'Sample Neurophysiology experimental data from UCL labs.', userId: 'Padraig Gleeson'
  },
  {
    id: 2, name: 'HNN model', repositoryType: 'Dandi', repositoryContentTypes: 'Modelling', uri: 'https://github.com/OpenSourceBrain/OSBv2', description: 'Netpyne definition of the hnn model from Dura-Bernal lab at State University of New York.', userId: 'Salvador Dura-Bernal'
  },
  {
    id: 3, name: 'Distinct nanoscale calcium channel and synaptic vesicle topographies contribute to the diversity of synaptic function', repositoryType: 'FigShare', repositoryContentTypes: 'Experimental Data', uri: 'https://github.com/OpenSourceBrain/OSBv2', description: 'The nanoscale topographical arrangement of voltage-gated calcium channels (VGCC) and synaptic vesicles (SVs) determines synaptic strength and plasticity, but whether distinct spatial distributions underpin diversity of synaptic function is unknown. We performed single bouton Ca2+ imaging, Ca2+ chelator competition, immunogold electron microscopic (EM) localization of VGCC', userId: 'Padraig Gleeson'
  },
  {
    id: 4, name: 'Distinct nanoscale calcium channel and synaptic vesicle topographies contribute to the diversity of synaptic function', repositoryType: 'Github', repositoryContentTypes: 'Experimental Data, Modelling', uri: 'https://github.com/OpenSourceBrain/OSBv2', description: 'Sample Neurophysiology experimental data from UCL labs.', userId: 'Padraig Gleeson'
  },
  {
    id: 5, name: 'NWB Showcase', repositoryType: 'Github', repositoryContentTypes: 'Experimental Data, Modelling', uri: 'https://github.com/OpenSourceBrain/OSBv2', description: 'Sample Neurophysiology experimental data from UCL labs.', userId: 'Padraig Gleeson'
  },
  {
    id: 6, name: 'HNN model', repositoryType: 'Dandi', repositoryContentTypes: 'Modelling', uri: 'https://github.com/OpenSourceBrain/OSBv2', description: 'Netpyne definition of the hnn model from Dura-Bernal lab at State University of New York.', userId: 'Salvador Dura-Bernal'
  },
  {
    id: 7, name: 'Distinct nanoscale calcium channel and synaptic vesicle topographies contribute to the diversity of synaptic function', repositoryType: 'FigShare', repositoryContentTypes: 'Experimental Data', uri: 'https://github.com/OpenSourceBrain/OSBv2', description: 'The nanoscale topographical arrangement of voltage-gated calcium channels (VGCC) and synaptic vesicles (SVs) determines synaptic strength and plasticity, but whether distinct spatial distributions underpin diversity of synaptic function is unknown. We performed single bouton Ca2+ imaging, Ca2+ chelator competition, immunogold electron microscopic (EM) localization of VGCC', userId: 'Padraig Gleeson'
  },
  {
    id: 8, name: 'Distinct nanoscale calcium channel and synaptic vesicle topographies contribute to the diversity of synaptic function', repositoryType: 'Github', repositoryContentTypes: 'Experimental Data, Modelling', uri: 'https://github.com/OpenSourceBrain/OSBv2', description: 'Sample Neurophysiology experimental data from UCL labs.', userId: 'Padraig Gleeson'
  },
  {
    id: 9, name: 'NWB Showcase', repositoryType: 'Github', repositoryContentTypes: 'Experimental Data, Modelling', uri: 'https://github.com/OpenSourceBrain/OSBv2', description: 'Sample Neurophysiology experimental data from UCL labs.', userId: 'Padraig Gleeson'
  }
]

const myRepositoryData = [
  {
    id: 1, name: 'NWB Showcase', repositoryType: 'Github', repositoryContentTypes: 'Experimental Data, Modelling', uri: 'https://github.com/OpenSourceBrain/OSBv2', description: 'Sample Neurophysiology experimental data from UCL labs.', userId: 'Padraig Gleeson'
  },
  {
    id: 2, name: 'HNN model', repositoryType: 'Dandi', repositoryContentTypes: 'Modelling', uri: 'https://github.com/OpenSourceBrain/OSBv2', description: 'Netpyne definition of the hnn model from Dura-Bernal lab at State University of New York.', userId: 'Salvador Dura-Bernal'
  },
  {
    id: 3, name: 'Distinct nanoscale calcium channel and synaptic vesicle topographies contribute to the diversity of synaptic function', repositoryType: 'FigShare', repositoryContentTypes: 'Experimental Data', uri: 'https://github.com/OpenSourceBrain/OSBv2', description: 'The nanoscale topographical arrangement of voltage-gated calcium channels (VGCC) and synaptic vesicles (SVs) determines synaptic strength and plasticity, but whether distinct spatial distributions underpin diversity of synaptic function is unknown. We performed single bouton Ca2+ imaging, Ca2+ chelator competition, immunogold electron microscopic (EM) localization of VGCC', userId: 'Padraig Gleeson'
  },
]

export const RepositoriesPage = () => {
  const classes = useStyles();
  const [repositories, setRepositories] = useState(mockRepositoryData);
  const openRepoUrl = (uri: string) => window.open(uri, "_blank")
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event: any, newValue: number) => {
    setTabValue(newValue);
    setRepositories(newValue === 1 ? myRepositoryData : mockRepositoryData);
  }

  // ToDo use OSBrepository once api starts working
  // const [page, setPage] = React.useState(0);
  //const [repositories, setRepositories] = React.useState<OSBRepository[]>();
  // React.useEffect(() => {
  //   RepositoryService.getRepositories(page).then(repos => setRepositories(repos));
  // }, [page])

  return (
    <>
      {
        repositories && (
          <Box className={classes.root}>
            <Box className="subheader" paddingX={3}>
              <Grid container spacing={0} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Tabs
                  value={tabValue}
                  textColor="primary"
                  indicatorColor="primary"
                  onChange={handleTabChange}
                >
                  <Tab label="All repositories" />
                  <Tab label="My repositories" />
                </Tabs>
                </Grid>
                <Grid item xs={12} sm={6} justify="flex-end">
                  <Button variant="contained" disableElevation color="primary">
                    <AddIcon />
                    ADD REPOSITORY
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Box className="repository-data">
              {
                repositories.map((repository) =>
                  <Grid container spacing={0} alignItems="center" className="row" key={repository.id}>
                    <Grid item xs={12} sm={4}>
                      <Box className="col">
                        <Typography component="strong">
                          {repository.name}
                        </Typography>
                        <Typography>
                          {repository.description}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Box className="col">
                        <Typography>
                          {repository.userId}
                        </Typography>
                      </Box>

                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Box className="col" display="flex" alignItems="center" flexWrap="wrap">
                       { repository.repositoryContentTypes.split(',').map((type, index) =>
                          <Box className="tag" display="flex" alignItems="center" paddingX={1} marginY={1} key={type}>
                            <FiberManualRecordIcon color={ index%2 === 0 ? "primary" : "secondary"} />
                            {type}
                          </Box>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Box className="col" display="flex" flex={1} alignItems="center">
                        <Button variant="outlined" onClick={() => openRepoUrl(repository.uri)}>
                          SEE ON {repository.repositoryType}
                        </Button>
                        <ChevronRightIcon />
                      </Box>
                    </Grid>
                  </Grid>
                )
              }
            </Box>
          </Box>
        )
      }
    </>
  );
};

export default RepositoriesPage