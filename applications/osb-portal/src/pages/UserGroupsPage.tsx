import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

import {
  bgDarkest,
  bgDarker,
  paragraph,
  textColor,
  bgLightest as lineColor,
} from "../theme";

import GroupsService from "../service/GroupsService";
import Tabs from "@mui/material/Tabs";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import {TableCell} from "@mui/material";
import Tab from "@mui/material/Tab";
import CircularProgress from "@mui/material/CircularProgress";
import {BitBucketIcon, GroupsIcon} from "../components/icons";
import Tooltip from "@mui/material/Tooltip";
import Link from "@mui/material/Link";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkIcon from "@mui/icons-material/Link";

const styles = {
  groupMembers: (theme) => ({
    flexDirection: "column",
    paddingBottom: "0px !important",
    backgroundColor: bgDarker,
  }),
  profileInformation: (theme) => ({
    flexDirection: "column",
    backgroundColor: bgDarker,
    borderRight: `1px solid ${lineColor}`,
    paddingRight: theme.spacing(3),
    overflowY: 'auto',
    maxHeight: "100%",

    "&::-webkit-scrollbar": {
      display: 'none',
      width: 0,
    },

    "& .MuiSvgIcon-root": {
      marginRight: "5px",
      color: paragraph,
    },
    "& .MuiAvatar-root": {
      width: "150px",
      height: "150px",
      marginBottom: theme.spacing(2),
    },
    "& .name": {
      color: textColor,
      flex: "none",
    },
    "& h2": {
      marginBottom: "0.5em",
    },
    "& .username": {},
    "& .MuiButton-root": {
      width: "100%",
    },
    "& .links": {
      "& .MuiTypography-root": {
        display: "flex",
      },
    },
    "& .groups": {
      "& .MuiTypography-root": {
        color: textColor,
      },
      "& .MuiChip-root": {
        color: paragraph,
        border: `1px solid ${paragraph}`,
      },
      "& .first-chip": {
        marginLeft: 0,
      },
    },
  }),
  dot: {
    height: "5px",
    width: "5px",
    alignSelf: "center",
    marginLeft: "5px",
  },
};


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography component="section">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
};

export const UserGroupsPage = (props: any) => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = React.useState(0);
  const [groupMembers, setGroupMembers] = React.useState(null);
  const [groupDetails, setGroupDetails] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<any>(null);

  const { groupname } = useParams<{groupname: string}>();

  const handleTabChange = (
    event: React.SyntheticEvent,
    newTabValue: number
  ) => {
    setTabValue(newTabValue);
  };

  React.useEffect(() => {
    setLoading(true)
    GroupsService.getGroup(groupname).then((details) => {
      setGroupDetails(details)
      GroupsService.getGroupMembers(groupname).then(users => {
        setGroupMembers(users)
        setLoading(false)
        setError(null)
      })
    }).catch(error => {
      setError(error)
    });
  }, [groupname]);

  if (loading && !groupDetails) {
    return <CircularProgress size={24} />
  }

  if (error) {
    throw error;
  }
  return (
    <>
      <Box className={`verticalFill`} display="flex" justifyContent="center">
        <Grid container={true} spacing={0} className="verticalFill">
          <Grid
            id="profile-info"
            item={true}
            sm={4}
            lg={3}
            sx={styles.profileInformation}
          >
            <Stack pt={5} px={4} spacing={4}>
              <Avatar alt="group-avatar" variant="rounded" src={groupDetails?.image}>
                {groupDetails?.name?.length > 0 && groupDetails?.name?.charAt(0)}
              </Avatar>
              <Typography className="name" component="h1" variant="h2">
                {groupDetails?.name}
                {
                  groupDetails?.email && <Typography
                    className="username"
                    component="p"
                    variant="subtitle2"
                  >
                    {groupDetails?.email}
                  </Typography>
                }

              </Typography>

              <Typography
                className="username"
                component="p"
                variant="subtitle2"
                lineHeight={1.5}
              >
                {groupDetails?.description}
              </Typography>

              <Box display='flex' alignItems='center'>
                <GroupsIcon sx={{fontSize: '0.9rem'}} />

                <Typography
                  className="username"
                  component="p"
                  variant="subtitle2"
                >
                  {groupMembers?.length} team members
                </Typography>
              </Box>

                {groupDetails?.links && Object.keys(groupDetails?.links).length > 0 && (
                  <Box
                    className="links"
                    display="flex"
                    flexDirection="column"
                    width="100%"
                  >
                    <Typography component="h2" variant="h5" gutterBottom={true}>
                      Links
                    </Typography>

                    {groupDetails?.links?.homepage && typeof groupDetails?.links?.homepage === "string" && (
                      <Typography
                        component="p"
                        variant="body2"
                        gutterBottom={true}
                      >
                        <LinkIcon fontSize="small" />
                        <Tooltip title="homepage">
                          <Link sx={{
                            display: "inline-block",
                            maxWidth: "100%",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                                href={groupDetails?.links?.homepage} underline="hover">
                            {groupDetails?.links?.homepage}
                          </Link>
                        </Tooltip>
                      </Typography>
                    )}

                    {groupDetails?.links?.github && typeof groupDetails?.links?.github === "string" && (
                      <Typography
                        component="p"
                        variant="body2"
                        gutterBottom={true}
                      >
                        <GitHubIcon fontSize="small" />
                        <Tooltip title="GitHub">
                          <Link
                            href={
                              groupDetails?.links?.github.includes("github.com")
                                ? groupDetails?.links?.github
                                : "https://github.com/" + groupDetails?.links?.github
                            }
                            underline="hover"
                          >
                            Github profile
                          </Link>
                        </Tooltip>
                      </Typography>
                    )}
                    {groupDetails?.links?.bitbucket && typeof groupDetails?.links?.bitbucket === "string" && (
                      <Typography
                        component="p"
                        variant="body2"
                        gutterBottom={true}
                      >
                        <BitBucketIcon fontSize="small" />
                        <Tooltip title="BitBucket">
                          <Link
                            href={
                              groupDetails?.links?.bitbucket.includes("bitbucket.org")
                                ? groupDetails?.links?.bitbucket
                                : "https://bitbucket.org/" + groupDetails?.links?.bitbucket
                            }
                            underline="hover"
                          >
                            Bitbucket profile
                          </Link>
                        </Tooltip>
                      </Typography>
                    )}
                  </Box>
                )}

              {groupDetails?.keywords && groupDetails?.keywords > 0 && (
                <Box className="groups" width="100%">
                  <Typography component="h2" variant="h5" gutterBottom={true}>
                    Groups
                  </Typography>
                  {groupDetails?.keywords.map((group, index) => {
                      return (
                        <Chip
                          className={index === 0 ? "first-chip" : ""}
                          color="secondary"
                          label={group}
                          key={group}
                          variant="outlined"
                        />
                      );
                    })}
                </Box>
              )}
            </Stack>
          </Grid>

          <Grid
            item={true}
            sm={8}
            lg={9}
            className={`verticalFit`}
            sx={styles.groupMembers}
          >
            <Box
              bgcolor={bgDarkest}
              px={(theme) => theme.spacing(4)}
              sx={{ borderBottom: `1px solid ${lineColor}` }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                aria-label="tabs"
                variant="standard"
              >
                <Tab
                  label={
                    <>
                      Members
                      <Chip
                        size="small"
                        color="primary"
                        label={groupMembers?.length || 0}
                      />
                    </>
                  }
                  {...a11yProps(0)}
                />
              </Tabs>
            </Box>
            <Box className="scrollbar" height="100%" py={4} sx={{ paddingRight: '0 !important' }}>
              {
                loading ? <CircularProgress size={24} /> : <TabPanel value={tabValue} index={0}>
                  <TableContainer>
                    <Table aria-label="spanning table">
                      <TableBody>
                        {
                          groupMembers?.length !== 0 && groupMembers?.map(member => <TableRow>
                            <TableCell component="th" scope="row">
                              <Stack spacing={2} direction="row" alignItems="center">
                                <Stack>
                                  <Avatar src={member?.avatar} sx={{width: '50px', height: '50px'}}>
                                    {(member.firstName.length > 0 && member.firstName.charAt(0)) +
                                      (member.lastName.length > 0 && member.lastName.charAt(0))}
                                  </Avatar>
                                </Stack>
                                <Stack sx={{ minWidth: 0 }}>
                                  <Typography component="h5" variant="subtitle2" color='secondary'>
                                    {member.firstName + " " + member.lastName}
                                  </Typography>
                                  <Typography
                                    className="username"
                                    component="p"
                                    variant="subtitle2"
                                  >
                                    {member.email}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </TableCell>

                            <TableCell style={{ width: 200 }} align="right">
                              <Button
                                variant="outlined"
                                color='secondary'
                                onClick={() =>navigate(`/user/${member?.username}`)}
                                sx={{
                                  borderRadius: '8px',
                                  border: '1px solid #fff',
                                  padding: '8px 12px'
                                }}
                              >
                                <Typography component="h5" variant="subtitle2" color='secondary' sx={{margin: 0}}>
                                  See Profile
                                </Typography>
                              </Button>
                            </TableCell>
                          </TableRow>)
                        }

                      </TableBody>
                    </Table>
                  </TableContainer>
                </TabPanel>
              }

            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
