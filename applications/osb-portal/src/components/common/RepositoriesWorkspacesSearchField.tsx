import * as React from "react";

//components
import TextField from "@mui/material/TextField";

//icons
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

//style
import { bgRegular, chipTextColor } from "../../theme";
import styled from "@mui/system/styled";

const StyledTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: bgRegular,
  padding: theme.spacing(1),
  marginRight: "0.286rem",
  "& .MuiSvgIcon-root": {
    width: "1.25rem",
    borderRadius: 0,
    color: chipTextColor,
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
    color: chipTextColor,
    fontWeight: 500,
  },
}));

interface RepositoriesSearchProps {
  filterChanged: (newFilter: string) => void;
  borderRadius?: number;
}

export default (props: RepositoriesSearchProps) => {
  return (
    <StyledTextField
      variant="standard"
      id="standard-start-adornment"
      fullWidth={true}
      sx={{
        borderRadius: props?.borderRadius
          ? `${props?.borderRadius}px`
          : "8px 0px 0px 8px",
      }}
      placeholder="Search"
      onChange={(e) => {
        props.filterChanged(e.target.value.toLowerCase());
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};
