import React, { useState } from "react";
import { useHistory } from 'react-router-dom';

import Box from "@material-ui/core/Box";

import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";


import { EditRepoDialog } from "../../components/repository/EditRepoDialog";
import { OSBRepository, RepositoryContentType } from "../../apiclient/workspaces";
import RepositoryService from "../../service/RepositoryService";
import { UserInfo } from "../../types/user";
import useStyles from './styles';
import Repositories from "../../components/repository/Repositories";
import MainMenu from "../../components/menu/MainMenu";
import OSBPagination from "../../components/common/OSBPagination";
import RepositoriesSearch from "../../components/repository/RepositoriesSearch";

enum RepositoriesTab {
  all,
  my,
}

let firstTimeFiltering = true;

export const RepositoriesPage = ({ user }: { user: UserInfo }) => {
  const classes = useStyles();
  const history = useHistory();
  const [repositories, setRepositories] = React.useState<OSBRepository[]>();
  const [tabValue, setTabValue] = useState(RepositoriesTab.all);
  const [filter, setFilter] = useState("");
  const [selectedRepositoryContentTypes, setSelectedRepositoryContentTypes] = useState([]);
  const [searchTags, setSearchTags] = useState([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = () => setDialogOpen(true);

  const [page, setPage] = React.useState(1);

  const [totalPages, setTotalPages] = React.useState(0);

  const openRepoUrl = (repositoryId: number) => {
    history.push(`/repositories/${repositoryId}`);
  }

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
    if (typeof filter === 'undefined' || filter.length === 0){
      if (!firstTimeFiltering){
        setPage(1);
      }
      RepositoryService.getRepositoriesDetails(page).then((reposDetails) => {
        setRepositories(reposDetails.osbrepositories);
        setTotalPages(reposDetails.pagination.numberOfPages);
        firstTimeFiltering = true;
      });
    } else{
      if (firstTimeFiltering){
        firstTimeFiltering = false;
        RepositoryService.getRepositoriesByFilter(1, filter).then((repos) => {
          setRepositories(repos.osbrepositories);
          setTotalPages(repos.pagination.numberOfPages);
        });
      }
      else {
        RepositoryService.getRepositoriesByFilter(page, filter).then((repos) => {
          setRepositories(repos.osbrepositories);
          setTotalPages(repos.pagination.numberOfPages);
        });
      }
    }
  }, [page, filter, selectedRepositoryContentTypes]);

  const handleInput = (value: any) => {
    console.log('Inside handleInput value', value);
    setSelectedRepositoryContentTypes(value);
  }


  return (
    <>
      <MainMenu />
      <Box className={`${classes.root} verticalFit`}>
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
          <Box className={classes.filterAndSearchBox}>
          {/* <Autocomplete
          // className={classes.autoComplete}
          multiple={true}
          options={tagOptions}
          freeSolo={true}
          // defaultValue={workspace?.tags}
          options={tagOptions}
          defaultValue={defaultTags}
          onChange={ (event, value) => setWorkspaceTags(value)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
             <Chip variant="outlined" label={option} {...getTagProps({index})} key={option} />
           ))
          }
          renderInput={(params) => (
            <TextField InputProps={{ disableUnderline: true }} fullWidth={true} {...params} variant="filled" placeholder="Workspace tags" />
          )}
          /> */}
          <Select
              value={selectedRepositoryContentTypes}
              multiple={true}
              onChange={(e) => handleInput(e.target.value)}
              IconComponent={KeyboardArrowDownIcon}
              renderValue={(selected) => (selected as string[]).join(', ')}
            >
              <MenuItem value={RepositoryContentType.Experimental}>
                <Checkbox color="primary" checked={selectedRepositoryContentTypes.includes(RepositoryContentType.Experimental)} />
                <ListItemText primary="NWB Experimental Data" />
              </MenuItem>
              <MenuItem value={RepositoryContentType.Modeling}>
                <Checkbox color="primary" checked={selectedRepositoryContentTypes.includes(RepositoryContentType.Modeling)}/>
                <ListItemText primary="Modeling" />
              </MenuItem>
            </Select>
            <RepositoriesSearch filterChanged={(newFilter) => setFilter(newFilter)} />
            {user && (
              <>
              <Divider orientation="vertical" flexItem={true} className={classes.divider} />
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
              </>
            )}
          </Box>
        </Box>

        {repositories ?
          <Box className="verticalFill" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Repositories repositories={repositories} handleRepositoryClick={(repositoryId: number) => openRepoUrl(repositoryId)} />
            {
              totalPages > 1 ?
              <OSBPagination totalPages={totalPages} handlePageChange={handlePageChange} color="primary" showFirstButton={true} showLastButton={true}/>
              : null
            }
          </Box>
          :
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
        }
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
