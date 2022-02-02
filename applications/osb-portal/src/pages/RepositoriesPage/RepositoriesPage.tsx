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
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import Popover from "@material-ui/core/Popover";
import searchFilter from "../../types/searchFilter";
import FilterListIcon from '@material-ui/icons/FilterList';
import SearchIcon from "@material-ui/icons/Search";


import { EditRepoDialog } from "../../components";
import { Tag, OSBRepository, RepositoryContentType } from "../../apiclient/workspaces";
import RepositoryService from "../../service/RepositoryService";
import { UserInfo } from "../../types/user";
import useStyles from './styles';
import { Repositories, MainMenu } from "../../components/index";
import OSBPagination from "../../components/common/OSBPagination";
import RepositoriesSearch from "../../components/repository/RepositoriesSearch";
import { FormControl, FormControlLabel, FormGroup, InputAdornment } from "@material-ui/core";

enum RepositoriesTab {
  all,
  my,
}

let firstTimeFiltering = true;

export const RepositoriesPage = ({ user }: { user: UserInfo }) => {
  const classes = useStyles();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [repositories, setRepositories] = React.useState<OSBRepository[]>();
  const [tabValue, setTabValue] = useState(RepositoriesTab.all);
  const [searchFilterValues, setSearchFilterValues] = useState<searchFilter>({
    text: undefined,
    tags: [],
    types: [],
  });

  const [searchTagOptions, setSearchTagOptions] = useState([]);
  const [tagPage, setTagPage] = React.useState(1);
  const [totalTagPages, setTotalTagPages] = React.useState(0);
  const [tagSearchValue, setTagSearchValue] = React.useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = () => setDialogOpen(true);

  const [page, setPage] = React.useState(1);

  const [totalPages, setTotalPages] = React.useState(0);

  const open = Boolean(anchorEl);
  const id = open ? 'popover' : undefined;

  const openRepoUrl = (repositoryId: number) => {
    history.push(`/repositories/${repositoryId}`);
  }

  const handlePopoverClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  }

  const handlePopoverClose = () => {
    setAnchorEl(null);
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

  React.useEffect(() => handleTagInput(""), [])

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    let repositoryTypes: string[] = [];
    if (event.target.checked) {
      repositoryTypes = searchFilterValues.types;
      repositoryTypes.push(event.target.name);
    }
    else {
      for (const type of searchFilterValues.types) {
        if (type !== event.target.name) {
          repositoryTypes.push(event.target.name);
        }
      }
    }
    setSearchFilterValues({ ...searchFilterValues, types: repositoryTypes });
  }

  /* This function handles changes to the input in the Autocomplete tag box.
   *
   * Initially, when the autocomplete box is populated, no text is provided to
   * filter tags on, so we get only the first set of tags from the API. If the
   * user enters some value, we only fetch tags using the provided text as a
   * filter.
   *
   * The function also takes the tag page number as argument, which is used to
   * implement infinite scroll
   */
  const handleTagInput = (value?: any, tagpage?: number) => {
    let query: any;
    if ((value !== "") && (value !== undefined)){
      query = "tag__like=" + value;
    }
    RepositoryService.getAllTags(tagpage, undefined, query).then((tagsInformation) => {
      const tags = tagsInformation.tags.map(tagObject => {
        return tagObject.tag;
      });
      setTagSearchValue(value);
      setTagPage(tagsInformation.pagination.currentPage);
      setTotalTagPages(tagsInformation.pagination.numberOfPages);
      if (tagpage !== undefined) {
        setSearchTagOptions(searchTagOptions.concat(tags.sort((a: string, b: string) => a.localeCompare(b))));
      }
      else {
        setSearchTagOptions(tags.sort((a: string, b: string) => a.localeCompare(b)));
      }
    });
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
            <Button aria-describedby={id} variant="contained" onClick={handlePopoverClick} className={classes.filterButton} startIcon={<FilterListIcon />}>
              <Typography component="label">Filter</Typography>
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              className={classes.popover}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <Typography component="label" className={classes.label}>Tags</Typography>
              <Autocomplete
                value={searchFilterValues.tags}
                inputValue={tagSearchValue}
                multiple={true}
                options={searchTagOptions}
                freeSolo={true}
                onInputChange={(event, value) => {
                  handleTagInput(value);
                }}
                onChange={(event, value) => setSearchFilterValues({ ...searchFilterValues, tags: value })}
                onClose={(event, reason) => handleTagInput("")}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} size="small" {...getTagProps({ index })} key={option} />
                  ))
                }
                renderInput={(params) => (
                  <><SearchIcon /><TextField InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }} fullWidth={true} {...params} variant="filled" /></>
                )}
                ListboxProps={{
                  onScroll: (event: React.SyntheticEvent) => {
                    const listboxNode = event.currentTarget;
                    if (listboxNode.scrollTop + listboxNode.clientHeight === listboxNode.scrollHeight) {

                      if (tagPage < totalTagPages){
                        handleTagInput(tagSearchValue, tagPage + 1);
                      }
                    }
                  }
                }}
              />
              <FormControl component="fieldset" >
                <FormGroup>
                  <Typography component="label" className={classes.label}>Types</Typography>
                  <FormControlLabel control={<Checkbox color="primary" checked={searchFilterValues.types.includes(RepositoryContentType.Experimental)} onChange={handleInput} name={RepositoryContentType.Experimental} />} label="Experimental" />
                  <FormControlLabel control={<Checkbox color="primary" checked={searchFilterValues.types.includes(RepositoryContentType.Modeling)} onChange={handleInput} name={RepositoryContentType.Modeling} />} label="Modeling" />
                  <FormControlLabel control={<Checkbox color="primary" checked={searchFilterValues.types.includes("Development")} onChange={handleInput} name="Development" />} label="Development" />
                </FormGroup>
              </FormControl>
            </Popover>

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
            <Repositories repositories={repositories} handleRepositoryClick={(repositoryId: number) => openRepoUrl(repositoryId)} refreshRepositories={() => updateList(tabValue)} handleTagClick={ (tag: Tag) => searchFilterValues.tags.indexOf(tag.tag) === -1 ? setSearchFilterValues({ ...searchFilterValues, tags: searchFilterValues.tags.concat(tag.tag)}) : console.log("Tag exists, no op.") } handleTagUnclick={ (tag: Tag) => setSearchFilterValues({ ...searchFilterValues, tags: searchFilterValues.tags.filter(t => t !== tag.tag) })} searchFilterValues={searchFilterValues}/>
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
          onSubmit={() => updateList(tabValue)}
        />
      )}
    </>
  );
};

export default RepositoriesPage;
