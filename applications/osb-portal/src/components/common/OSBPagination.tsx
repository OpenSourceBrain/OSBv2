import React from "react";
import Pagination from "@mui/material/Pagination";
import styled from "@mui/system/styled";
import { bgLightest as lineColor, primaryColor } from "../../theme";

interface OSBPaginationProps {
  count: number;
  page: number;
  onChange: (event: React.ChangeEvent<unknown>, pageNumber: number) => void;
  showFirstButton?: boolean;
  showLastButton?: boolean;
  removeTopBorder?: boolean;
}

const StyledPagination = styled(Pagination)(() => ({
  display: "flex",
  justifyContent: "center",
  padding: ".88rem",

  width: "100%",

  "& .Mui-selected": {
    backgroundColor: `${primaryColor} !important`,
  },
}));

export default (props: OSBPaginationProps) => {
  return (
    <StyledPagination
      sx={{ borderTop: props?.removeTopBorder ? 0 : `1px solid ${lineColor}` }}
      count={props.count}
      page={props.page}
      onChange={props.onChange}
      showFirstButton={props.showFirstButton}
      showLastButton={props.showLastButton}
    />
  );
};
