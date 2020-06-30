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
import FileLinkIcon from '../../icons/svg/FileLinkIcon';
import LoadingIcon from '../../icons/svg/LoadingIcon';
import FolderIcon from '../../icons/svg/FolderIcon';
import ShareIcon from '../../icons/svg/ShareIcon';

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
  svgIcon: {
    paddingTop: 6,
    paddingLeft: 4,
  },
  loading: {
    color: theme.palette.grey[600],
  },
  FlexDisplay: {
    display: 'flex',
  },
  FlexGrowOne: {
    flexGrow: 1,
  }
}));

const LinkItem = (props: any) => {
  const classes = useStyles();
  return (
    <div className={classes.FlexDisplay}>
      <FileLinkIcon className={classes.svgIcon} viewBox={'0 0 16 16'} />
      <div>{props.name}</div>
    </div>
  )
}

const FolderItem = (props: any) => {
  const classes = useStyles();
  return (
    <div className={classes.FlexDisplay}>
      <FolderIcon className={classes.svgIcon} viewBox={'0 0 16 16'} />
      <div>{props.name}</div>
    </div>
  )
}

const LoadingItem = (props: any) => {
  const classes = useStyles();
  return (
    <div className={classes.FlexDisplay}>
      <div className={classes.FlexGrowOne}>Loading {props.name}</div>
      <LoadingIcon className={classes.svgIcon} viewBox={'0 0 16 16'} />
    </div>
  )
}

const TreeItemShare = (props: any) => {
  const classes = useStyles();
  return (
    <TreeItem
      nodeId={props.nodeId}
      label={
        <div className={classes.FlexDisplay}>
          <div className={classes.FlexGrowOne}>{props.name}</div>
          <ShareIcon className={props.iconClassName} viewBox={'0 0 16 16'} />
        </div>
      }
    >
      {props.children}
    </TreeItem>
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
      <TreeItemShare nodeId="1" name="Workspace XYZ" iconClassName={classes.svgIcon}>
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
      </TreeItemShare>
      <TreeItemShare nodeId="1" name="User shared space" iconClassName={classes.svgIcon}>
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
      </TreeItemShare>
    </>
  : <>
      <div className={classes.closedText}>+ Workspace XYZ&nbsp;&nbsp;
        <ShareIcon className={[classes.svgIcon, classes.rotate180].join(' ')} viewBox={'0 0 16 16'} />
      </div>
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
      <div className={classes.content}>
        {props.children}
      </div>
    </div>
  );
}