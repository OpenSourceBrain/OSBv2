import * as React from "react";

//components
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";


//style
import { paragraph, chipTextColor, chipBg, bgRegular, bgInputs} from "../../theme";
import makeStyles from '@mui/styles/makeStyles';

import { RepositoryContentType} from "../../apiclient/workspaces";
import searchFilter from "../../types/searchFilter";
import RepositoriesSearch from "../../components/repository/RepositoriesSearch";
import FilterListIcon from "@mui/icons-material/FilterList";
import Popover from "@mui/material/Popover";
import Autocomplete from "@mui/material/Autocomplete";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import {FormControl, FormControlLabel, FormGroup, InputAdornment} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";


interface SearchReposWorkspacesProps {
    searchFilterValues?: searchFilter;
    filterChanged?: (filter: string) => void;
    debouncedHandleSearchFilter?: (text: string) => void;
    setSearchFilterValues?: (searchFilter) => void,
    debouncedTagInputUpdate?: (value: string, page: number) => void,
    searchTagOptions?: string[],
    tagPage?: number,
    totalTagPages?: number,
    handleInput?: () => void
}


const useStyles = makeStyles((theme) => ({
    filterButton: {
        borderRadius: '0px 8px 8px 0px',
        textTransform: "capitalize",
        "&:hover": {
            backgroundColor: "transparent",
        },
        minWidth: "fit-content !important",
        backgroundColor: bgRegular,
        "& .MuiTouchRipple-root:hover": {
            backgroundColor: "transparent",
        },
        "& .MuiSvgIcon-root": {
            fontSize: "1.3rem",
            color: chipTextColor,
        },
        "& .MuiTypography-root": {
            fontSize: "0.857rem",
            color: chipTextColor,
            fontWeight: 500
        },
    },
    popover: {
        "& .MuiPaper-root": {
            top: '88px !important',
            left: '1023px !important',
            background: chipBg,
            minWidth: "390px !important",
            padding: theme.spacing(3),
            boxShadow: '0px 10px 60px rgba(0, 0, 0, 0.5)',
            "& .MuiSvgIcon-root": {
                cursor: "pointer",
            },
            "& .MuiAutocomplete-root": {
                display: "flex",
                alignItems: "center",
                paddingTop: 0,
                paddingBottom: 0,
                marginBottom: '.88rem',
                "& .MuiSvgIcon-root": {
                    marginLeft: theme.spacing(1),
                    color: paragraph,
                },
                "& .MuiInputBase-root": {
                    paddingLeft: 0,
                },
                '& .MuiFilledInput-root': {
                    '&:hover, &:before': {
                        backgroundColor: 'transparent',
                        border: 'none'
                    },
                },
                '& .Mui-focused': {
                    backgroundColor: 'transparent',
                    border: 'none'
                },
            },
        },
    },
    label: {
        color: bgInputs,
        fontWeight: 700,
        fontSize: '.88rem',
        marginBottom: theme.spacing(1),
        display: 'inline-block'
    },
}));

export const SearchReposWorkspaces = (props: SearchReposWorkspacesProps) => {
    const classes = useStyles();
    const {
        debouncedHandleSearchFilter,
        searchFilterValues,
        setSearchFilterValues,
        debouncedTagInputUpdate,
        searchTagOptions,
        tagPage,
        totalTagPages,
        handleInput
    } = props

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [tagSearchValue, setTagSearchValue] = React.useState("");

    const open = Boolean(anchorEl);

    const id = open ? "popover" : undefined;

    const handlePopoverClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const handleTagInput = (value?: any, tagpage?: number) => {
        setTagSearchValue(value);
        debouncedTagInputUpdate(value, tagpage);
    };


    return (
       <>
           <RepositoriesSearch
               filterChanged={(newTextFilter) =>
                   debouncedHandleSearchFilter(newTextFilter)
               }
           />
           <Button
               aria-describedby={id}
               variant="contained"
               onClick={handlePopoverClick}
               className={classes.filterButton}
               startIcon={<FilterListIcon />}
           >
               <Typography component="label">Filter</Typography>
           </Button>
           <Popover
               id={id}
               open={open}
               anchorEl={anchorEl}
               className={classes.popover}
               onClose={handlePopoverClose}
               anchorOrigin={{
                   vertical: "bottom",
                   horizontal: "left",
               }}
               transformOrigin={{
                   vertical: "top",
                   horizontal: "center",
               }}
           >
               <Typography component="label" className={classes.label}>
                   Tags
               </Typography>
               <Autocomplete
                   value={searchFilterValues.tags}
                   inputValue={tagSearchValue}
                   multiple={true}
                   options={searchTagOptions}
                   freeSolo={true}
                   onInputChange={(event, value) => {
                       handleTagInput(value);
                   }}
                   onChange={(event, value) =>
                       setSearchFilterValues({ ...searchFilterValues, tags: value })
                   }
                   onClose={(event, reason) => handleTagInput("")}
                   renderTags={(value, getTagProps) =>
                       value.map((option, index) => (
                           <Chip
                               variant="outlined"
                               label={option}
                               size="small"
                               {...getTagProps({ index })}
                               key={option}
                           />
                       ))
                   }
                   renderInput={(params) => (
                       <>
                           <SearchIcon />
                           <TextField
                               InputProps={{
                                   startAdornment: (
                                       <InputAdornment position="start">
                                           <SearchIcon />
                                       </InputAdornment>
                                   ),
                               }}
                               fullWidth={true}
                               {...params}
                               variant="filled"
                           />
                       </>
                   )}
                   ListboxProps={{
                       onScroll: (event: React.SyntheticEvent) => {
                           const listboxNode = event.currentTarget;
                           if (
                               listboxNode.scrollTop + listboxNode.clientHeight ===
                               listboxNode.scrollHeight
                           ) {
                               if (tagPage < totalTagPages) {
                                   handleTagInput(tagSearchValue, tagPage + 1);
                               }
                           }
                       },
                   }}
               />
               <FormControl variant="standard" component="fieldset">
                   <FormGroup>
                       <Typography component="label" className={classes.label}>
                           Types
                       </Typography>
                       <FormControlLabel
                           control={
                               <Checkbox
                                   color="primary"
                                   checked={searchFilterValues.types.includes(
                                       RepositoryContentType.Experimental
                                   )}
                                   onChange={handleInput}
                                   name={RepositoryContentType.Experimental}
                               />
                           }
                           label="Experimental"
                       />
                       <FormControlLabel
                           control={
                               <Checkbox
                                   color="primary"
                                   checked={searchFilterValues.types.includes(
                                       RepositoryContentType.Modeling
                                   )}
                                   onChange={handleInput}
                                   name={RepositoryContentType.Modeling}
                               />
                           }
                           label="Modeling"
                       />
                       <FormControlLabel
                           control={
                               <Checkbox
                                   color="primary"
                                   checked={searchFilterValues.types.includes(
                                       "Development"
                                   )}
                                   onChange={handleInput}
                                   name="Development"
                               />
                           }
                           label="Development"
                       />
                   </FormGroup>
               </FormControl>
           </Popover>
       </>
    );
};

export default SearchReposWorkspaces
