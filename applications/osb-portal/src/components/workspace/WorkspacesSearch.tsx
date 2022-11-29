import * as React from "react";

import makeStyles from '@mui/styles/makeStyles';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import { bgLightestShade, paragraph } from "../../theme";

const useStyles = makeStyles((theme) => ({
  input: {
    marginRight: theme.spacing(1),
    backgroundColor: "transparent",
    padding: theme.spacing(1),
    "& .MuiInputBase-root": {
      height: "fit-content",
    },
    "& .MuiSvgIcon-root": {
      width: "1.25rem",
      borderRadius: 0,
      color: paragraph,
      height: "auto",
    },
    "& .MuiInput-root": {
      "&:before": {
        display: "none",
      },
      "&:after": {
        display: "none",
      },
    },
    "& .MuiInputBase-input": {
      padding: theme.spacing(0),
      fontSize: ".88rem",
    },
  },
  button: {
    padding: 0,
  },
}));

interface WorkspacesSearchProps {
  filterChanged: (newFilter: string) => void;
}

export default (props: WorkspacesSearchProps) => {
  const classes = useStyles();

  const [searchToggled, setSearchToggled] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const toggleSearch = () => {
    if (!search) {
      setSearchToggled(!searchToggled);
    }
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    props.filterChanged(e.target.value.toLowerCase());
  };
  return <>
    {searchToggled && (
      <TextField
        variant="standard"
        id="standard-start-adornment"
        fullWidth={false}
        placeholder="Search"
        className={classes.input}
        defaultValue={search}
        onChange={onSearchChange} />
    )}
    <IconButton className={classes.button} onClick={toggleSearch} size="large">
      <SearchIcon fontSize="small" />
    </IconButton>
  </>;
};
