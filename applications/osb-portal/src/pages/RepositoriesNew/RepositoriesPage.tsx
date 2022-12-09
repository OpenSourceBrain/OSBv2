import * as React from "react";

//components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import {
    HomePageSider,
} from "../../components";

import Repositories from "./Respositories";
//style
import makeStyles from '@mui/styles/makeStyles';

//types
import {UserInfo} from "../../types/user";
import {OSBRepository, Tag} from "../../apiclient/workspaces";
import {useHistory} from "react-router-dom";
import {useState} from "react";
import searchFilter from "../../types/searchFilter";
import RepositoryService from "../../service/RepositoryService";
import debounce from "lodash/debounce";

const useStyles = makeStyles((theme) => ({}));

enum RepositoriesTab {
    all,
    my,
}

let firstTimeFiltering = true;

export const RepositoriesPage = ({ user }: { user: UserInfo }) => {
    const history = useHistory();
    const [searchFilterValues, setSearchFilterValues] = useState<searchFilter>({
        text: undefined,
        tags: [],
        types: [],
    });
    const [repositories, setRepositories] = React.useState<OSBRepository[]>();
    const [page, setPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);

    const [tabValue, setTabValue] = React.useState(RepositoriesTab.all);

    const openRepoUrl = (repositoryId: number) => {
        history.push(`/repositories/${repositoryId}`);
    };

    const updateList = (newTabValue: RepositoriesTab = tabValue) => {
        setRepositories(null);
        switch (newTabValue) {
            case RepositoriesTab.all:
                RepositoryService.getRepositoriesDetails(page).then((reposDetails) => {
                    setRepositories(reposDetails.osbrepositories);
                    setTotal(reposDetails.pagination.total);
                });
                break;
            case RepositoriesTab.my:
                RepositoryService.getUserRepositoriesDetails(user.id, page).then(
                    (reposDetails) => {
                        setRepositories(reposDetails.osbrepositories);
                        setTotal(reposDetails.pagination.total);
                    }
                );
                break;
        }
    };

    const debouncedHandleSearchFilter = React.useCallback(
        debounce((newTextFilter: string) => {
            setSearchFilterValues({ ...searchFilterValues, text: newTextFilter });
        }, 500),
        []
    );

    React.useEffect(() => {
        if (
            searchFilterValues.tags.length === 0 &&
            searchFilterValues.types.length === 0 &&
            (typeof searchFilterValues.text === "undefined" ||
                searchFilterValues.text === "")
        ) {
            if (!firstTimeFiltering) {
                setPage(1);
            }
            RepositoryService.getRepositoriesDetails(page).then((reposDetails) => {
                setRepositories(reposDetails.osbrepositories);
                setTotal(reposDetails.pagination.total);
                firstTimeFiltering = true;
            });
        } else {
            if (firstTimeFiltering) {
                firstTimeFiltering = false;
                RepositoryService.getRepositoriesByFilter(1, searchFilterValues).then(
                    (repos) => {
                        setRepositories(repos.osbrepositories);
                        setTotal(repos.pagination.total);
                    }
                );
            } else {
                RepositoryService.getRepositoriesByFilter(
                    page,
                    searchFilterValues
                ).then((repos) => {
                    setRepositories(repos.osbrepositories);
                    setTotal(repos.pagination.total);
                });
            }
        }
    }, [page, searchFilterValues]);

    return (
        <>
            <Box className="verticalFit">
                <Grid container={true} className="verticalFill">
                    <Grid
                        item={true}
                        xs={12}
                        sm={12}
                        md={3}
                        lg={2}
                        direction="column"
                        className="verticalFill"
                    >
                        <Box width={1} className="verticalFit">
                            <HomePageSider />
                        </Box>
                    </Grid>
                    <Grid
                        item={true}
                        xs={12}
                        sm={12}
                        md={9}
                        lg={10}
                        alignItems="stretch"
                        className="verticalFill"
                    >
                        <Box width={1} className="verticalFit">
                            <div id="workspaces-list" className="verticalFit">
                                <Repositories
                                    handleRepositoryClick={(repository: OSBRepository) =>
                                    openRepoUrl(repository.id)
                                   }
                                    handleTagClick={(tag: Tag) =>
                                        searchFilterValues.tags.includes(tag.tag)
                                            ? null
                                            : setSearchFilterValues({
                                                ...searchFilterValues,
                                                tags: searchFilterValues.tags.concat(tag.tag),
                                            })
                                    }
                                    handleTagUnclick={(tag: Tag) =>
                                        setSearchFilterValues({
                                            ...searchFilterValues,
                                            tags: searchFilterValues.tags.filter((t) => t !== tag.tag),
                                        })
                                    }
                                    handleTypeClick={(type: string) =>
                                        setSearchFilterValues({
                                            ...searchFilterValues,
                                            types: searchFilterValues.types.concat(type),
                                        })
                                    }
                                    handleTypeUnclick={(type: string) =>
                                        setSearchFilterValues({
                                            ...searchFilterValues,
                                            types: searchFilterValues.types.filter((t) => t !== type),
                                        })
                                    }
                                    user={user}
                                    setPage={setPage}
                                    page={page}
                                    total={total}
                                    tabValue={tabValue}
                                    setTabValue={setTabValue}
                                    setSearchFilterValues={setSearchFilterValues}
                                    searchFilterValues={searchFilterValues}
                                    refreshRepositories={() => updateList(tabValue)}
                                    repositories={repositories}
                                    debouncedHandleSearchFilter={debouncedHandleSearchFilter}
                                />
                            </div>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default RepositoriesPage
