import * as React from "react";

import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import SearchIcon from "@material-ui/icons/Search";
import { bgLightestShade, paragraph } from "../../theme";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderRadius: 2,
    backgroundColor: bgLightestShade,
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
}));

interface WorkspacesSearchProps {
  filterChanged: (newFilter: string) => void;
}

export default (props: WorkspacesSearchProps) => {

  const classes = useStyles();




  return (
    <TextField
      id="standard-start-adornment"
      fullWidth={true}
      placeholder="Search"
      className={classes.root}
      onChange={(e) => { props.filterChanged(e.target.value.toLowerCase()); }}

      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}

