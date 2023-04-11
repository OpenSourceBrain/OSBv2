import * as React from "react";

//components
import Typography from "@mui/material/Typography";

//style
import styled from "@mui/system/styled";

export const StyledLabel = styled((props) => (
  <Typography {...props} component="label" />
))(({ theme }) => ({
  fontWeight: "bold",
  lineHeight: "2em",
  fontSize: "0.8rem",
}));

export default StyledLabel;
