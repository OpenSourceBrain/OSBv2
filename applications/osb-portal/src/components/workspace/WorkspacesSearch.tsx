import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import SearchIcon from "@material-ui/icons/Search";
import { bgLightestShade, paragraph } from "../../theme";

const useStyles = makeStyles((theme) => ({
  input: {
      marginRight: theme.spacing(1),
      backgroundColor: "transparent",
      padding: theme.spacing(1),
      '& .MuiInputBase-root': {
        height: 'fit-content',
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
    padding: 0
  }

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

  }

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    setSearch(e.target.value)
    props.filterChanged(e.target.value.toLowerCase());
  }
  return (
    <>

      {searchToggled && <TextField
        id="standard-start-adornment"
        fullWidth={false}
        placeholder="Search"
        className={classes.input}
        defaultValue={search}
        onChange={onSearchChange}
      />}
      <IconButton className={classes.button} onClick={toggleSearch}><SearchIcon fontSize="small"/></IconButton>
    </>
  );
}

