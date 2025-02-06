import * as React from "react";

//components
import TextField from "@mui/material/TextField";

//icons
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

//style
import { bgRegular, chipTextColor } from "../../theme";
import styled from "@mui/system/styled";
import { debounce } from "lodash";

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
  value?: string;
}

export default (props: RepositoriesSearchProps) => {

  const handleChange = React.useCallback(debounce((event: React.ChangeEvent<HTMLInputElement>) => {
    // Timout improves responsiveness while typing
    props.filterChanged(event.target.value);
  }, 1000), []);

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
      onChange={handleChange}
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
