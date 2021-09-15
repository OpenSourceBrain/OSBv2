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
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import searchFilter from "../../types/searchFilter";
import FilterListIcon from '@material-ui/icons/FilterList';


import { EditRepoDialog } from "../../components";
import { OSBRepository, RepositoryContentType } from "../../apiclient/workspaces";
import RepositoryService from "../../service/RepositoryService";
import { UserInfo } from "../../types/user";
import useStyles from './styles';
import { Repositories } from "../../components/index";
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
  const [searchFilterValues, setSearchFilterValues] = useState<searchFilter>({
    text: undefined,
    tags: [],
    types: [],
  });
  const [searchTagOptions, setSearchTagOptions] = useState([]);

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
    if (searchFilterValues.tags.length === 0 && searchFilterValues.types.length === 0 && (typeof searchFilterValues.text === 'undefined' || searchFilterValues.text === '')) {
      if (!firstTimeFiltering) {
        setPage(1);
      }
      RepositoryService.getRepositoriesDetails(page).then((reposDetails) => {
        setRepositories(reposDetails.osbrepositories);
        setTotalPages(reposDetails.pagination.numberOfPages);
        firstTimeFiltering = true;
      });
    } else {
      if (firstTimeFiltering) {
        firstTimeFiltering = false;
        RepositoryService.getRepositoriesByFilter(1, searchFilterValues).then((repos) => {
          setRepositories(repos.osbrepositories);
          setTotalPages(repos.pagination.numberOfPages);
        });
      }
      else {
        RepositoryService.getRepositoriesByFilter(page, searchFilterValues).then((repos) => {
          setRepositories(repos.osbrepositories);
          setTotalPages(repos.pagination.numberOfPages);
        });
      }
    }
  }, [page, searchFilterValues]);

  React.useEffect(() => {
    RepositoryService.getAllTags().then((tagsInformation) => {
      const tags = tagsInformation.tags.map(tagObject => {
        return tagObject.tag;
      });
      setSearchTagOptions(tags);
    });
  }, [])

  const handleInput = (repositoryTypes: any) => {
    setSearchFilterValues({ ...searchFilterValues, types: repositoryTypes });
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
            <Autocomplete
              multiple={true}
              options={searchTagOptions}
              freeSolo={true}
              onChange={(event, value) => setSearchFilterValues({ ...searchFilterValues, tags: value })}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} size="small" {...getTagProps({ index })} key={option} />
                ))
              }
              renderInput={(params) => (
                <TextField InputProps={{ disableUnderline: true }} fullWidth={true} {...params} variant="filled" />
              )}
            />
            <Select
              value={searchFilterValues.types}
              multiple={true}
              onChange={(e) => handleInput(e.target.value)}
              IconComponent={FilterListIcon}
              renderValue={(selected) => (selected as string[]).map((value) => (
                <Chip key={value} label={value} />
              ))}
            >
              <MenuItem value={RepositoryContentType.Experimental}>
                <Checkbox size="small" color="primary" checked={searchFilterValues.types.includes(RepositoryContentType.Experimental)} />
                <ListItemText primary="NWB Experimental Data" />
              </MenuItem>
              <MenuItem value={RepositoryContentType.Modeling}>
                <Checkbox size="small" color="primary" checked={searchFilterValues.types.includes(RepositoryContentType.Modeling)} />
                <ListItemText primary="Modeling" />
              </MenuItem>
            </Select>
            <RepositoriesSearch filterChanged={(newTextFilter) => setSearchFilterValues({ ...searchFilterValues, text: newTextFilter })} />
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
            <Repositories repositories={repositories} handleRepositoryClick={(repositoryId: number) => openRepoUrl(repositoryId)} refreshRepositories={updateList} />
            {
              totalPages > 1 ?
                <OSBPagination totalPages={totalPages} handlePageChange={handlePageChange} color="primary" showFirstButton={true} showLastButton={true} />
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

      {user && dialogOpen && (
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
