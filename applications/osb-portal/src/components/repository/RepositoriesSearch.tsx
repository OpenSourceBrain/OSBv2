import * as React from "react";

import makeStyles from '@mui/styles/makeStyles';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import SearchIcon from "@mui/icons-material/Search";
import { bgLightestShade, paragraph } from "../../theme";

const useStyles = makeStyles((theme) => ({
  textField: {
    borderRadius: 2,
    backgroundColor: bgLightestShade,
    padding: theme.spacing(1),
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

interface RepositoriesSearchProps {
  filterChanged: (newFilter: string) => void;
}

export default (props: RepositoriesSearchProps) => {
  const classes = useStyles();

  return (
    <TextField
      variant="standard"
      id="standard-start-adornment"
      fullWidth={true}
      placeholder="Search"
      className={classes.textField}
      onChange={(e) => {
        props.filterChanged(e.target.value.toLowerCase());
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }} />
  );
};
