import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Tab from "@mui/material/Tab";
import {
  bgDarkest,
  bgDarker,
  paragraph,
  bgLightest as lineColor,
} from "../theme";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import {UserPageLayout} from "../components/user/UserPageLayout";
import Tabs from "@mui/material/Tabs";

const styles = {
  repositoriesAndWorkspaces: (theme) => ({
    flexDirection: "column",
    paddingBottom: "0px !important",
    backgroundColor: bgDarker,
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
}

export const UserGroupsPage = (props: any) => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (
    event: React.SyntheticEvent,
    newTabValue: number
  ) => {
    setTabValue(newTabValue);
  };

  return (
    <UserPageLayout>
      <Grid
        item={true}
        sm={8}
        lg={9}
        className={`verticalFit`}
        sx={styles.repositoriesAndWorkspaces}
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
                    label={4}
                  />
                </>
              }
              {...a11yProps(0)}
            />
          </Tabs>
        </Box>
        <Box className="scrollbar" height="100%" py={4}>
          <TabPanel value={tabValue} index={0}>
            <TableContainer>
              <Table aria-label="spanning table">
                <TableBody>

                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Stack spacing={2} direction="row" alignItems="center">
                        <Stack>
                          <Avatar sx={{width: '50px', height: '50px'}}>W</Avatar>
                        </Stack>
                        <Stack sx={{ minWidth: 0 }}>
                          <Typography component="h5" variant="subtitle2" color='secondary'>
                            Afonso Pinto
                          </Typography>
                          <Typography
                            className="username"
                            component="p"
                            variant="subtitle2"
                          >
                            @afonsobspinto
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>

                    <TableCell style={{ width: 300 }} align="right">
                      <Typography display="flex" flexDirection="row" color={paragraph}>
                        <Stack spacing={1} direction="row" alignItems="center">
                          <FolderOpenIcon fontSize="small" />
                          <span>4 workspaces</span>
                        </Stack>

                        <Stack spacing={1} direction="row" alignItems="center">
                          <FiberManualRecordIcon sx={styles.dot} fontSize="small" />
                          <AccountTreeOutlinedIcon fontSize="small" />
                          <span>4 repositories</span>
                        </Stack>
                      </Typography>
                    </TableCell>


                    <TableCell style={{ width: 150 }} align="right">
                      <Button
                        variant="outlined"
                        color='secondary'
                        sx={{
                          borderRadius: '8px',
                          border: '1px solid #fff'
                        }}
                      >
                        <Typography component="h5" variant="subtitle2" color='secondary'>
                          See Profile
                        </Typography>
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Box>
      </Grid>
    </UserPageLayout>
  );
};
