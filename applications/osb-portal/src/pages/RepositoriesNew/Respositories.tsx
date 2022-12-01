import * as React from "react";

//components
import {
    Box,
    Tabs,
    Tab,
    Typography,
    TableContainer,
    Chip,
    TableRow,
    TableCell,
    TableBody,
    Table,
    Button,
    TablePagination
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import ShowMoreText from "react-show-more-text";

//style
import { bgLightest as lineColor, paragraph, linkColor, chipTextColor, chipBg, secondaryColor, primaryColor} from "../../theme";
import makeStyles from '@mui/styles/makeStyles';

//icons
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import {OSBRepository, RepositoryContentType, Tag} from "../../apiclient/workspaces";
import {UserInfo} from "../../types/user";
import RepositoryService from "../../service/RepositoryService";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";



enum RepositoriesTab {
    all,
    my,
}

const useStyles = makeStyles((theme) => ({
    tab: {
        maxWidth: "33%",
        minWidth: 'fit-content',
        padding: '16px 24px'
    },
    tabTitle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& .MuiTypography-root': {
            fontSize: '0.857rem',
            fontWeight: 700,
        }
    },
    showMoreText: {
        color: paragraph,
        marginTop: 8,
        "& a": {
            color: linkColor,
            display: "flex",
            textDecoration: "none",
            "& .MuiSvgIcon-root": {
                color: `${linkColor} !important`,
            },
        },
    },
    repositoryData: {
        '& .MuiChip-root': {
            margin: '0 8px 8px 0',
            backgroundColor: chipBg,
        },
        '& .content-types-tag': {
            color: chipTextColor,
        },
        '& .MuiButtonBase-root': {
            '&:hover': {
                backgroundColor: 'transparent',
                color: secondaryColor
            }
        },
        '& .MuiButton-outlined': {
            minWidth: 'max-content',
            padding: '8px 12px',
            textTransform: 'inherit',
            fontSize: '0.857rem',
            color: secondaryColor,
            borderRadius: 8,
            borderWidth: 1,

            '&:hover': {
                borderColor: primaryColor,
                color: `${primaryColor} !important`
            }
        }
    },
}));

export const RepositoriesList = ({ user }: { user: UserInfo }) => {
    const classes = useStyles();
    const [repositories, setRepositories] = React.useState<OSBRepository[]>();
    const [page, setPage] = React.useState(1);
    const [total, setTotal] = React.useState(0);

    const [tabValue, setTabValue] = React.useState(RepositoriesTab.all);
    const [expanded, setExpanded] = React.useState(false);

    const handleTabChange = (event: any, newValue: RepositoriesTab) => {
        setTabValue(newValue);
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const openRepoUrl = (uri: string) => window.open(uri, "_blank");

    const handleTagClick = (tagObject: Tag) => {
        console.log(tagObject)
    };

    const handleTypeClick = (type: string) => {
        console.log(type)
    }

    const handleChangePage = (event: unknown, current: number) => {
        setPage(current)
    }

    React.useEffect(() => {
        RepositoryService.getRepositoriesDetails(page).then((reposDetails) => {
            setRepositories(reposDetails.osbrepositories);
            setTotal(reposDetails.pagination.total);
        });
    }, [page])

return (
    <>
        <Box borderBottom={`2px solid ${lineColor}`}>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    textColor="primary"
                    indicatorColor="primary"
                >
                    <Tab label={
                        <div className={classes.tabTitle}>
                            <Typography>All repositories</Typography>
                        </div>
                    } className={classes.tab} />
                    {
                        user &&  <Tab label={
                            <div className={classes.tabTitle}>
                                <Typography>My repositories</Typography>
                            </div>
                        } className={classes.tab} />
                    }

                </Tabs>
            </Box>
        </Box>

        {!repositories && (
            <Box
                flex={1}
                px={2}
                py={2}
                display="flex"
                alignContent="center"
                alignItems="center"
                justifyContent="center"
            >
                <CircularProgress />
            </Box>
        )}

        {
            repositories &&
            <Box
                className="verticalFill"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <TableContainer className={classes.repositoryData}>
                    <Table aria-label="simple table">
                        <TableBody>
                            {repositories.map((row) => (
                                <TableRow
                                    key={row.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell style={{ minWidth: 300 }} component="th" scope="row">
                                        <Box className="col">
                                            <Typography  component="strong">{row.name}</Typography>
                                            {row.summary && (
                                                <ShowMoreText
                                                    className={classes.showMoreText}
                                                    lines={2}
                                                    more={<>See more <ExpandMoreIcon /></>}
                                                    less={<>See less<ExpandLessIcon /></>}
                                                    onClick={handleExpandClick}
                                                    expanded={expanded}
                                                    width={400}
                                                >
                                                    {row.summary}
                                                </ShowMoreText>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell style={{ minWidth: 100 }}>{row.user.username}</TableCell>
                                    <TableCell style={{ minWidth: 100 }}>
                                        <Button
                                            sx={{textTransform: 'capitalize'}}
                                            endIcon={<OpenInNewIcon />}
                                            onClick={() => openRepoUrl(row.uri)}
                                        >
                                            {row.repositoryType}
                                        </Button>
                                    </TableCell>
                                    <TableCell style={{ minWidth: 200 }}>
                                        <Box mb={'.5'}>
                                            {
                                                row.contentTypes.split(',').map((type) =>
                                                 <Chip
                                                    avatar={
                                                        <FiberManualRecordIcon
                                                            color={
                                                                type === RepositoryContentType.Experimental
                                                                    ? "primary"
                                                                    : "secondary"
                                                            }
                                                        />
                                                    }
                                                    onClick={() => handleTypeClick(type)}
                                                    key={type}
                                                    label={type}
                                                    clickable={true}
                                                    className='content-types-tag'
                                                />)
                                            }
                                        </Box>
                                        <Box>
                                            {
                                                row.tags.map((tagObject) =>
                                                    <Chip
                                                        onClick={() => handleTagClick(tagObject)}
                                                        key={tagObject.id}
                                                        label={tagObject.tag}
                                                        clickable={true}
                                                    />
                                                )
                                            }
                                        </Box>
                                    </TableCell>
                                    <TableCell style={{ width: 100 }}>
                                        <Button variant="outlined">Open Details</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={total}
                        rowsPerPage={10}
                        rowsPerPageOptions={[]}
                        page={page}
                        onPageChange={handleChangePage}
                    />
                </TableContainer>
            </Box>
        }
    </>
);
};

export default RepositoriesList
