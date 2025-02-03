import * as React from "react";
import debounce from "lodash/debounce";

//components
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FilterListIcon from "@mui/icons-material/FilterList";
import Popover from "@mui/material/Popover";
import Autocomplete from "@mui/material/Autocomplete";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import RepositoriesWorkspacesSearchField from "../../components/common/RepositoriesWorkspacesSearchField";

//style
import {
  paragraph,
  chipTextColor,
  chipBg,
  bgRegular,
  bgInputs,
} from "../../theme";
import styled from "@mui/system/styled";

//types
import { RepositoryContentType } from "../../apiclient/workspaces";
import searchFilter from "../../types/searchFilter";

//services
import RepositoryService from "../../service/RepositoryService";
import { Badge } from "@mui/material";

interface SearchReposWorkspacesProps {
  searchFilterValues: searchFilter;
  filterChanged: (filter: string) => void;
  setSearchFilterValues: (searchFilter) => void;
  hasTypes?: boolean;
  setLoading?: (loading: boolean) => void;
}

const StyledLabel = styled(Typography)(({ theme }) => ({
  color: bgInputs,
  fontWeight: 700,
  fontSize: ".88rem",
  marginBottom: theme.spacing(1),
  display: "inline-block",
}));

const StyledPopover = styled(Popover)(({ theme }) => ({
  "& .MuiPaper-root": {
    background: chipBg,
    minWidth: "350px !important",
    padding: theme.spacing(3),
    boxShadow: "0px 10px 60px rgba(0, 0, 0, 0.5)",
    "& .MuiSvgIcon-root": {
      cursor: "pointer",
    },
    "& .MuiAutocomplete-root": {
      display: "flex",
      alignItems: "center",
      paddingTop: 0,
      paddingBottom: 0,
      marginBottom: ".88rem",
      "& .MuiSvgIcon-root": {
        marginLeft: theme.spacing(1),
        color: paragraph,
      },
      "& .MuiInputBase-root": {
        paddingLeft: 0,
      },
      "& .MuiFilledInput-root": {
        "&:hover, &:before": {
          backgroundColor: "transparent",
          border: "none",
        },
      },
      "& .Mui-focused": {
        backgroundColor: "transparent",
        border: "none",
      },
    },
  },
}));

const StyledFilterButton = styled(Button)(({ theme }) => ({
  borderRadius: "0px 8px 8px 0px",
  textTransform: "capitalize",
  boxShadow: "none",
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
    fontWeight: 500,
  },
}));

export const SearchFilterReposWorkspaces = (
  props: SearchReposWorkspacesProps
) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [tagSearchValue, setTagSearchValue] = React.useState("");
  const [searchTagOptions, setSearchTagOptions] = React.useState([]);
  const [tagPage, setTagPage] = React.useState(1);
  const [totalTagPages, setTotalTagPages] = React.useState(0);

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

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    let repositoryTypes = [...props?.searchFilterValues.types];

    if (event.target.checked) {
      repositoryTypes = [...props?.searchFilterValues.types, event.target.name];
    } else {
      repositoryTypes = repositoryTypes.filter(
        (row) => row !== event.target.name
      );
    }

    props?.setSearchFilterValues({
      ...props?.searchFilterValues,
      types: repositoryTypes,
    });
  };

  const debouncedTagInputUpdate = React.useCallback(
    debounce((value?: any, tagpage?: number) => {
      let query: any;
      if (value !== "" && value !== undefined) {
        query = "tag__like=" + value;
      }
      RepositoryService.getAllTags(tagpage, undefined, query).then(
        (tagsInformation) => {
          const tags = tagsInformation.tags.map((tagObject) => {
            return tagObject.tag;
          });
          setTagPage(tagsInformation.pagination.currentPage);
          setTotalTagPages(tagsInformation.pagination.numberOfPages);
          if (tagpage !== undefined) {
            setSearchTagOptions(
              searchTagOptions.concat(
                tags.sort((a: string, b: string) => a.localeCompare(b))
              )
            );
          } else {
            setSearchTagOptions(
              tags.sort((a: string, b: string) => a.localeCompare(b))
            );
          }
        }
      );
    }, 500),
    [] );

  const  handleTagsChange = React.useCallback((event, value) => props?.setSearchFilterValues({
      ...props?.searchFilterValues,
      tags: value,
    })
  , [props?.searchFilterValues]);
  
  return (
    <>
      <RepositoriesWorkspacesSearchField value={props.searchFilterValues.text} filterChanged={props?.filterChanged} />
      <StyledFilterButton
        aria-describedby={id}
        aria-haspopup="true"
        variant="contained"
        onClick={handlePopoverClick}
        startIcon={<Badge variant="dot" color="primary" badgeContent={props?.searchFilterValues.tags?.length || props?.searchFilterValues.types?.length}><FilterListIcon /></Badge>}
      >
        <Typography component="label">Filter</Typography>
      </StyledFilterButton>
      <StyledPopover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <StyledLabel>Tags</StyledLabel>
        <Autocomplete
          sx={{
            "& .MuiFormControl-root": {
              "& .MuiInputBase-root": {
                padding: "7px",
              },
            },
          }}
          value={props?.searchFilterValues.tags}
          inputValue={tagSearchValue}
          multiple={true}
          options={searchTagOptions}
          freeSolo={true}
          onInputChange={(event, value) => {
            handleTagInput(value);
          }}
          onChange={handleTagsChange}
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
        {props?.hasTypes && (
          <FormControl variant="standard" component="fieldset">
            <FormGroup>
              <StyledLabel>Types</StyledLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={props?.searchFilterValues.types.includes(
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
                    checked={props?.searchFilterValues.types.includes(
                      RepositoryContentType.Modeling
                    )}
                    onChange={handleInput}
                    name={RepositoryContentType.Modeling}
                  />
                }
                label="Modeling"
              />
            </FormGroup>
          </FormControl>
        )}
      </StyledPopover>
    </>
  );

  
};

export default SearchFilterReposWorkspaces;
