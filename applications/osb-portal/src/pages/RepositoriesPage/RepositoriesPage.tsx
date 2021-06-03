import React, { useState } from "react";
import { useHistory } from 'react-router-dom';

import Box from "@material-ui/core/Box";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";
import Pagination from '@material-ui/lab/Pagination';

import { EditRepoDialog } from "../../components/repository/EditRepoDialog";
import { OSBRepository } from "../../apiclient/workspaces";
import RepositoryService from "../../service/RepositoryService";
import { UserInfo } from "../../types/user";
import useStyles from './styles';

enum RepositoriesTab {
  all,
  my,
}


export const RepositoriesPage = ({ user }: { user: UserInfo }) => {
  const classes = useStyles();
  const history = useHistory();
  const [repositories, setRepositories] = React.useState<OSBRepository[]>();

  const openRepoUrl = (uri: string) => window.open(uri, "_blank");
  const [tabValue, setTabValue] = useState(RepositoriesTab.all);

  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = () => setDialogOpen(true);

  const [page, setPage] = React.useState(1);

  const [totalPages, setTotalPages] = React.useState(0);

  const handleTabChange = (event: any, newValue: RepositoriesTab) => {
    setTabValue(newValue);
    updateList(newValue);
  };

  const updateList = (newTabValue: RepositoriesTab = tabValue) => {
    setRepositories(null);
    switch (newTabValue) {
      case RepositoriesTab.all:
        RepositoryService.getRepositoriesDetails(page).then((reposDetails) => {
          setRepositories(reposDetails.osbrepositories);
          setTotalPages(reposDetails.pagination.numberOfPages);
        });
        break;
      case RepositoriesTab.my:
        RepositoryService.getUserRepositoriesDetails(user.id, page).then((reposDetails) => {
          setRepositories(reposDetails.osbrepositories);
          setTotalPages(reposDetails.pagination.numberOfPages);
        });
        break;
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, pageNumber: number) => {
    setPage(pageNumber);
  }

  React.useEffect(() => {
    RepositoryService.getRepositoriesDetails(page).then((reposDetails) => {
      setRepositories(reposDetails.osbrepositories);
      setTotalPages(reposDetails.pagination.numberOfPages);
    });
  }, [page]);

  return (
    <>
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

        {repositories ?
          <Box className="repository-data scrollbar">
            <Box className="repository-data-items">
              {repositories.map((repository) => (
                <Grid
                  container={true}
                  className="row"
                  spacing={0}
                  key={repository.id}
                  onClick={() => history.push(`/repositories/${repository.id}`)}
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

            {totalPages > 1 ?
              <Box className={classes.paginationBar}>
              <Pagination count={totalPages} color="primary" showFirstButton={true} showLastButton={true} onChange={handlePageChange} />
              </Box> : null
            }
          </Box>
          : (
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
      </Box>

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
