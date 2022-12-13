import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useParams } from "react-router-dom";
import { MainMenu } from "../components/index";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core";
import AppsIcon from "@material-ui/icons/Apps";
import PersonIcon from "@material-ui/icons/Person";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import ArrowRight from "@material-ui/icons/ArrowRight";
import Link from "@material-ui/core/Link";

import { OSBSplitButton } from "../components/common/OSBSpliButton";
import { bgDarker, bgLight, bgLighter, bgRegular, paragraph } from "../theme";
import WorkspaceService from "../service/WorkspaceService";
import { Workspace, WorkspaceResource, OSBApplications } from "../types/workspace";
import OSBDialog from "../components/common/OSBDialog";
import { WorkspaceEditor, WorkspaceInteractions } from "../components";
import MarkdownViewer from "../components/common/MarkdownViewer";
import { canEditWorkspace } from '../service/UserService';

const useStyles = makeStyles((theme: any) => ({
  workspaceToolbar: {
    cursor: 'pointer',
    padding: theme.spacing(1),
    '& .MuiGrid-root': {
      marginRight: '10px',
    },
    [theme.breakpoints.down("xs")]: {
      flexDirection: 'column-reverse',
      position: 'fixed',
      bottom: 0,
      width: '100%',
      padding: 0,
      '& .MuiBox-root': {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        width: '100%',
        justifyContent: 'center',
      },
      '& .buttons': {
        borderBottom: `1px solid rgb(255, 255, 255, 0.12)`,
      },
      '& .MuiGrid-container': {
        maxWidth: 'fit-content',
      },
    },
  },
  accordion: {
    '& .MuiAccordionSummary-root': {
      color: paragraph,
      '& .MuiSvgIcon-root': {
        color: paragraph,
      },
    },
    [theme.breakpoints.up("md")]: {
      display: 'none',
    },
  },
  workspaceInformation: {
    borderBottom: `1px solid ${bgLighter}`,
    '& span': {
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiBox-root': {
      [theme.breakpoints.up("md")]: {
        '& .MuiTypography-root:nth-child(2)': {
          marginLeft: theme.spacing(2),
        },
      },
      [theme.breakpoints.down("sm")]: {
        flexDirection: 'column',
        '& .MuiTypography-root:nth-child(2)': {
          marginTop: theme.spacing(1),
        },
      },
    },
    '& .MuiChip-root': {
      backgroundColor: '#3c3c3c',
    },
  },
  workspaceResourcesInformation: {

    '& .MuiAccordion-root': {
      borderRight: `1px solid ${bgLighter}`,
      position: 'fixed',
      width: '20%',
      maxWidth: 400,
      borderRadius: 0,
      [theme.breakpoints.down("sm")]: {
        display: 'none',
      },
    },
  },
  workspaceDescriptionBox: {

    [theme.breakpoints.down("md")]: {
      paddingLeft: '20%',
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: 0,
    },
    '& .inner-description': {
      maxWidth: 850,
    },
    '& hr': {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
    },
    '& .MuiTypography-root': {

      textAlign: 'center',
      marginBottom: theme.spacing(1),


      [theme.breakpoints.down("xs")]: {
        paddingBottom: theme.spacing(7),
      },
      '& .preview-box': {
        backgroundColor: bgDarker,
        border: 'none',
      },
      '& .MuiPaper-elevation1': {
        boxShadow: 'none',
      }
    },
  },
  imageBox: {
    width: '100%',
    maxHeight: 300,
    "& img": {
      height: 300,
      width: "100%",
      objectFit: "contain",
    }
  }
}));

export const WorkspacePage = (props: any) => {

  const classes = useStyles();
  const history = useHistory();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const workspace = props.workspace;
  const user = props.user;
  const [editWorkspaceOpen, setEditWorkspaceOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(true);
  const [error, setError] = React.useState<any>(null);
  let options;

  const PREFIX_TEXT = "Open with "
  if (!workspace) {
    props.selectWorkspace(workspaceId);
  } else {
    const apps = workspace ? workspace.lastOpen.type.application.name ? [PREFIX_TEXT + workspace.lastOpen.type.application.name] : [] : null;
    for (const app of Object.keys(OSBApplications)) {
        if (!apps.includes(PREFIX_TEXT + OSBApplications[app].name)) {
            apps.push(PREFIX_TEXT + OSBApplications[app].name);
        }
      }
    options = apps;
  }


  if (error) {
    throw error;
  }
  const handleCloseEditWorkspace = () => {
      props.refreshWorkspace(workspaceId)
      setEditWorkspaceOpen(false);
  }

  const handleResourceClick = (resource: WorkspaceResource) => {
    openWithApp(resource.type.application.name);
  }


  // open application that is default for selected resource,
  // or option selected from app selection drop down
  const openWithApp = (selectedOption: string) => {
    for (const app of Object.keys(OSBApplications)) {
      if ((PREFIX_TEXT + OSBApplications[app].name).includes(selectedOption)) {
        history.push(`/workspace/open/${workspaceId}/${app}`);
      }
    }
  }

  const canEdit = canEditWorkspace(props.user, workspace);

  return (
    workspace && <Box className="verticalFit">
      {<>
        <Box className="wrapper-for-now">
          <Divider />
          <MainMenu />
          <Divider />
          {
            /*
              Top panel.
            */
          }
          <Box display="flex" alignItems="center" justifyContent="space-between" bgcolor={bgLight} className={classes.workspaceToolbar}>
            <Box display="flex" onClick={() => history.push('/')}>
              <AppsIcon color="primary" fontSize="small" />
              <Typography component="a" color="primary">See all workspaces</Typography>
            </Box>

            <Box display="flex" className="buttons">
              {canEdit && <Button variant="outlined" disableElevation={true} color="secondary" style={{ borderColor: 'white' }} onClick={() => setEditWorkspaceOpen(true)}>
                Edit
              </Button>}
              <OSBSplitButton options={options} handleClick={openWithApp} />
            </Box>
          </Box>
          {
            /*
              Alternative accordion for us in small displays.
            */
          }
          <Accordion className={classes.accordion}>
            <AccordionSummary expandIcon={<ArrowRight />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography>Resources</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <WorkspaceInteractions workspace={workspace} open={true} user={props.user} openResource={handleResourceClick} />
            </AccordionDetails>
          </Accordion>

          {
            /*
               Mid panel: workspace metadata
            */
          }
          <Box bgcolor={bgRegular} minHeight="20vh" display="flex" alignItems="center" justifyContent="center" flexDirection="column" p={1} className={classes.workspaceInformation}>
            <Typography component="h1" variant="h1">{workspace.name}</Typography>
            <Box display="flex" flexDirection="row" color={paragraph} mb={2} alignItems="center">
              {(workspace.user && (workspace.user.firstName || workspace.user.lastName)) ? <Typography component="span" variant="subtitle2"><PersonIcon fontSize="small" /> By{<Link href={`/user/${workspace.user.id}`}>{workspace.user.firstName + " " + workspace.user.lastName}</Link>}</Typography> : null}
              {workspace.timestampUpdated && <Typography component="span" variant="subtitle2"><CalendarTodayIcon fontSize="small" /> Last Updated on {workspace.timestampUpdated.toDateString()}</Typography>}
            </Box>
            <Box>{workspace.tags && workspace.tags.map(tagObject => { return <Chip label={tagObject.tag} key={tagObject.id} /> })}</Box>
          </Box>
        </Box>

          {
            /*
              Bottom: workspace resource panel and thumbnail
            */
          }
        <Box className={`verticalFit ${classes.workspaceResourcesInformation}`} display="flex" flexDirection="row">
          <WorkspaceInteractions workspace={workspace} open={true} user={props.user} refreshWorkspacePage={() => { setRefresh(!refresh) }} openResource={handleResourceClick} />
          <Box className={`${classes.workspaceDescriptionBox} scrollbar`} width="100%" display="flex" flexDirection="column" alignItems="center">
            <Box className={`inner-description`} p={4}>
              {workspace.thumbnail &&
                <>
                  <Box className={classes.imageBox}>
                    <img src={`/proxy/workspaces/${workspace.thumbnail}?v=${workspace.timestampUpdated.getMilliseconds()}`} alt="Workspace thumbnail" />
                  </Box>
                  <Divider />
                </>}

              <Typography component="div" variant="body1"><MarkdownViewer text={workspace.description} /></Typography>
            </Box>

          </Box>
        </Box>

        {canEdit && editWorkspaceOpen && <WorkspaceEditor
          open={editWorkspaceOpen}
          title={"Edit workspace: " + workspace.name}
          closeHandler={handleCloseEditWorkspace}
          workspace={workspace} onLoadWorkspace={handleCloseEditWorkspace} user={user}/>
        }
      </>}
    </Box>
  )
}

export default WorkspacePage;
