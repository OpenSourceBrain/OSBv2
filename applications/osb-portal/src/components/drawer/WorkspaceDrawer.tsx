import * as React from 'react';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import SvgIcon from '@material-ui/core/SvgIcon';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  treeRoot: {
    height: '87vh',
    flexGrow: 1,
    maxWidth: 400,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    top: 'initial',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    top: 'initial',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    top: 'initial',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: 0,
  },
  closedTextBottom: {
    writingMode: 'vertical-lr',
    textOrientation: 'mixed',
    transform: 'rotate(-180deg)',
    margin: 'auto',
    position: 'relative',
    bottom: 0,
    height: '70vh',
  },
  closedText: {
    writingMode: 'vertical-lr',
    textOrientation: 'mixed',
    transform: 'rotate(-180deg)',
    margin: 'auto',
  },
  rotate180: {
    transform: 'rotate(-180deg)',
  },
  svgIconRight: {
    paddingTop: 6,
    paddingLeft: 4,
    float: 'right',
  },
  svgIconLeft: {
    paddingTop: 6,
    paddingLeft: 4,
    float: 'left',
  },
  loading: {
    color: theme.palette.grey[600],
  }
}));

const LinkItem = (props: any) => {
  const classes = useStyles();
  return (
    <div>
      <SvgIcon className={classes.svgIconLeft} viewBox={'0 0 16 16'}>
        <path d="M10.3438 0.65625C11.2604 0.65625 12.0417 0.989583 12.6875 1.65625C13.3333 2.30208 13.6562 3.08333 13.6562 4C13.6562 4.91667 13.3333 5.70833 12.6875 6.375C12.0417 7.02083 11.2604 7.34375 10.3438 7.34375H7.65625V6.0625H10.3438C10.9062 6.0625 11.3854 5.86458 11.7812 5.46875C12.1979 5.05208 12.4062 4.5625 12.4062 4C12.4062 3.4375 12.1979 2.95833 11.7812 2.5625C11.3854 2.14583 10.9062 1.9375 10.3438 1.9375H7.65625V0.65625H10.3438ZM4.34375 4.65625V3.34375H9.65625V4.65625H4.34375ZM2.1875 2.5625C1.79167 2.95833 1.59375 3.4375 1.59375 4C1.59375 4.5625 1.79167 5.05208 2.1875 5.46875C2.60417 5.86458 3.09375 6.0625 3.65625 6.0625H6.34375V7.34375H3.65625C2.73958 7.34375 1.95833 7.02083 1.3125 6.375C0.666667 5.70833 0.34375 4.91667 0.34375 4C0.34375 3.08333 0.666667 2.30208 1.3125 1.65625C1.95833 0.989583 2.73958 0.65625 3.65625 0.65625H6.34375V1.9375H3.65625C3.09375 1.9375 2.60417 2.14583 2.1875 2.5625Z" fill="white"/>
      </SvgIcon>
      {props.name}
    </div>
  )
}

const FolderItem = (props: any) => {
  const classes = useStyles();
  return (
    <div>
      <SvgIcon className={classes.svgIconLeft} viewBox={'0 0 16 16'}>
        <path d="M5.65625 0.65625L7 2H12.3438C12.6979 2 13 2.13542 13.25 2.40625C13.5208 2.67708 13.6562 2.98958 13.6562 3.34375V10C13.6562 10.3542 13.5208 10.6667 13.25 10.9375C13 11.2083 12.6979 11.3438 12.3438 11.3438H1.65625C1.30208 11.3438 0.989583 11.2083 0.71875 10.9375C0.46875 10.6667 0.34375 10.3542 0.34375 10V2C0.34375 1.64583 0.46875 1.33333 0.71875 1.0625C0.989583 0.791667 1.30208 0.65625 1.65625 0.65625H5.65625Z" fill="white"/>
      </SvgIcon>
      {props.name}
    </div>
  )
}

const LoadingItem = (props: any) => {
  const classes = useStyles();
  return (
    <div className={classes.loading}>
      Loading {props.name}
      <SvgIcon className={classes.svgIconRight} viewBox={'0 0 16 16'}>
        <path d="M8.46094 8.46094L8.92578 7.69531L6.30078 6.10938V3.07422H5.42578V6.57422L8.46094 8.46094ZM1.87109 1.89844C3.01953 0.75 4.39583 0.175781 6 0.175781C7.60417 0.175781 8.97135 0.75 10.1016 1.89844C11.25 3.02865 11.8242 4.39583 11.8242 6C11.8242 7.60417 11.25 8.98047 10.1016 10.1289C8.97135 11.2591 7.60417 11.8242 6 11.8242C4.39583 11.8242 3.01953 11.2591 1.87109 10.1289C0.740885 8.98047 0.175781 7.60417 0.175781 6C0.175781 4.39583 0.740885 3.02865 1.87109 1.89844Z" fill="white"/>
      </SvgIcon>
    </div>
  )
}

export const WorkspaceDrawer = (props: any) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const open = props.drawer;

  const handleToggleDrawer = () => props.onToggleDrawer();

  const drawerContent = (open)
  ? <>
      <TreeItem
        nodeId="1"
        label={
          <div>Workspace XYZ
            <SvgIcon className={classes.svgIconRight} viewBox={'0 0 16 16'}>
              <path d="M9.5 8.37891C9.97396 8.37891 10.375 8.55208 10.7031 8.89844C11.0312 9.22656 11.1953 9.61849 11.1953 10.0742C11.1953 10.5482 11.0221 10.9583 10.6758 11.3047C10.3477 11.6328 9.95573 11.7969 9.5 11.7969C9.04427 11.7969 8.64323 11.6328 8.29687 11.3047C7.96875 10.9583 7.80469 10.5482 7.80469 10.0742C7.80469 9.89193 7.8138 9.76432 7.83203 9.69141L3.70312 7.28516C3.35677 7.59505 2.95573 7.75 2.5 7.75C2.02604 7.75 1.61589 7.57682 1.26953 7.23047C0.923177 6.88411 0.75 6.47396 0.75 6C0.75 5.52604 0.923177 5.11589 1.26953 4.76953C1.61589 4.42318 2.02604 4.25 2.5 4.25C2.95573 4.25 3.35677 4.40495 3.70312 4.71484L7.80469 2.33594C7.76823 2.15365 7.75 2.01693 7.75 1.92578C7.75 1.45182 7.92318 1.04167 8.26953 0.695312C8.61589 0.348958 9.02604 0.175781 9.5 0.175781C9.97396 0.175781 10.3841 0.348958 10.7305 0.695312C11.0768 1.04167 11.25 1.45182 11.25 1.92578C11.25 2.39974 11.0768 2.8099 10.7305 3.15625C10.3841 3.5026 9.97396 3.67578 9.5 3.67578C9.0625 3.67578 8.66146 3.51172 8.29687 3.18359L4.19531 5.58984C4.23177 5.77214 4.25 5.90885 4.25 6C4.25 6.09115 4.23177 6.22786 4.19531 6.41016L8.35156 8.81641C8.67969 8.52474 9.0625 8.37891 9.5 8.37891Z" fill="white"/>
            </SvgIcon>
          </div>
        }
      >
        <Divider />
          <ListItem button={true}>
              <ListItemIcon><AddIcon /></ListItemIcon>
              <ListItemText primary={'Add resource'} />
          </ListItem>
        <Divider />
        <TreeItem nodeId="3" label={<LinkItem name="Ferguson 0.nwb" />} />
        <TreeItem nodeId="4" label={<LinkItem name="Ferguson 1.nwb" />} />
        <TreeItem nodeId="4" label={<LinkItem name="Ferguson 2.nwb" />} />
        <TreeItem nodeId="5" label={<LinkItem name="Ferguson 3.nwb" />} />
        <TreeItem nodeId="7" label="test.json" />
        <TreeItem nodeId="8" label={<LoadingItem name="test.nwb" />} />
        <TreeItem nodeId="8" label={<FolderItem name="folder 1" />} />
        <TreeItem nodeId="9" label={<FolderItem name="folder 2" />} />
      </TreeItem>
      <TreeItem
        nodeId="1"
        label={
          <div>User shared space
            <SvgIcon  className={classes.svgIconRight} viewBox={'0 0 16 16'}>
              <path d="M9.5 8.37891C9.97396 8.37891 10.375 8.55208 10.7031 8.89844C11.0312 9.22656 11.1953 9.61849 11.1953 10.0742C11.1953 10.5482 11.0221 10.9583 10.6758 11.3047C10.3477 11.6328 9.95573 11.7969 9.5 11.7969C9.04427 11.7969 8.64323 11.6328 8.29687 11.3047C7.96875 10.9583 7.80469 10.5482 7.80469 10.0742C7.80469 9.89193 7.8138 9.76432 7.83203 9.69141L3.70312 7.28516C3.35677 7.59505 2.95573 7.75 2.5 7.75C2.02604 7.75 1.61589 7.57682 1.26953 7.23047C0.923177 6.88411 0.75 6.47396 0.75 6C0.75 5.52604 0.923177 5.11589 1.26953 4.76953C1.61589 4.42318 2.02604 4.25 2.5 4.25C2.95573 4.25 3.35677 4.40495 3.70312 4.71484L7.80469 2.33594C7.76823 2.15365 7.75 2.01693 7.75 1.92578C7.75 1.45182 7.92318 1.04167 8.26953 0.695312C8.61589 0.348958 9.02604 0.175781 9.5 0.175781C9.97396 0.175781 10.3841 0.348958 10.7305 0.695312C11.0768 1.04167 11.25 1.45182 11.25 1.92578C11.25 2.39974 11.0768 2.8099 10.7305 3.15625C10.3841 3.5026 9.97396 3.67578 9.5 3.67578C9.0625 3.67578 8.66146 3.51172 8.29687 3.18359L4.19531 5.58984C4.23177 5.77214 4.25 5.90885 4.25 6C4.25 6.09115 4.23177 6.22786 4.19531 6.41016L8.35156 8.81641C8.67969 8.52474 9.0625 8.37891 9.5 8.37891Z" fill="white"/>
            </SvgIcon>
          </div>
        }
      >
        <TreeItem nodeId="10" label={<FolderItem name="every_workspace" />}>
          <TreeItem nodeId="11" label="can.npy" />
          <TreeItem nodeId="12" label="see_these.nwb" />
          <TreeItem nodeId="13" label="resources.json" />
        </TreeItem>
        <TreeItem nodeId="14" label="Material-UI">
          <TreeItem nodeId="15" label="src">
            <TreeItem nodeId="16" label="index.js" />
            <TreeItem nodeId="17" label="tree-view.js" />
          </TreeItem>
        </TreeItem>
      </TreeItem>
    </>
  : <>
      <div className={classes.closedText}>+ Workspace XYZ&nbsp;&nbsp;
        <SvgIcon className={[classes.svgIconRight, classes.rotate180].join(' ')} viewBox={'0 0 16 16'}>
          <path d="M9.5 8.37891C9.97396 8.37891 10.375 8.55208 10.7031 8.89844C11.0312 9.22656 11.1953 9.61849 11.1953 10.0742C11.1953 10.5482 11.0221 10.9583 10.6758 11.3047C10.3477 11.6328 9.95573 11.7969 9.5 11.7969C9.04427 11.7969 8.64323 11.6328 8.29687 11.3047C7.96875 10.9583 7.80469 10.5482 7.80469 10.0742C7.80469 9.89193 7.8138 9.76432 7.83203 9.69141L3.70312 7.28516C3.35677 7.59505 2.95573 7.75 2.5 7.75C2.02604 7.75 1.61589 7.57682 1.26953 7.23047C0.923177 6.88411 0.75 6.47396 0.75 6C0.75 5.52604 0.923177 5.11589 1.26953 4.76953C1.61589 4.42318 2.02604 4.25 2.5 4.25C2.95573 4.25 3.35677 4.40495 3.70312 4.71484L7.80469 2.33594C7.76823 2.15365 7.75 2.01693 7.75 1.92578C7.75 1.45182 7.92318 1.04167 8.26953 0.695312C8.61589 0.348958 9.02604 0.175781 9.5 0.175781C9.97396 0.175781 10.3841 0.348958 10.7305 0.695312C11.0768 1.04167 11.25 1.45182 11.25 1.92578C11.25 2.39974 11.0768 2.8099 10.7305 3.15625C10.3841 3.5026 9.97396 3.67578 9.5 3.67578C9.0625 3.67578 8.66146 3.51172 8.29687 3.18359L4.19531 5.58984C4.23177 5.77214 4.25 5.90885 4.25 6C4.25 6.09115 4.23177 6.22786 4.19531 6.41016L8.35156 8.81641C8.67969 8.52474 9.0625 8.37891 9.5 8.37891Z" fill="white"/>
        </SvgIcon>
      </div>
      <div className={classes.closedTextBottom}>Global Quota Usage: 30%</div>
    </>

  return (
    <div className={classes.root}>
      <Drawer
        variant="permanent"
        anchor="left"
        open={open}
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div>
          <TreeView
            className={classes.treeRoot}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            defaultExpanded={['1', '10']}
          >
            {drawerContent}
          </TreeView>
        </div>
        <Divider />
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleToggleDrawer}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
      </Drawer>
      <main className={classes.content}>
        {props.children}
      </main>
    </div>
  );
}