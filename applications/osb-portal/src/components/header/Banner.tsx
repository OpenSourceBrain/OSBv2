import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { UserInfo } from "../../types/user";

const createStyles = (theme: any) => {
  return {
    mainFeaturedPost: {
      position: "relative",
      backgroundImage: "url(images/banner.png)",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      height: "35vh",
    },
    mainFeaturedPostContent: {
      position: "absolute",
      bottom: 0,
      right: 0,
      left: 0,
      top: 0,
      backgroundColor: "rgba(0,0,0,.3)",
      display: "flex",
      alignItems: "flex-end",
      padding: theme.spacing(3),
    }
  }
};

export const Banner = (props: any) => {
  const theme = useTheme();
  const classes = createStyles(theme);
  const navigate = useNavigate();
  const user: UserInfo = props.user;
  const handleSignup = () => {
    props.register();
  };

  return (
    <Box sx={classes.mainFeaturedPost}>
      <Box sx={classes.mainFeaturedPostContent}>
        <Box>
          <Box display="flex" pt={1} flexDirection="row">
            {"" && ( // TODO temporarily disabled
              <Button variant="outlined">Take the tour</Button>
            )}
            {user === null ? (
              <Button variant="outlined" onClick={handleSignup}>
                Sign up
              </Button>
            ) : null}
            <Button
              variant="outlined"
              onClick={() => navigate("/repositories")}
            >
              View repositories
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                window.open(
                  "https://docs.opensourcebrain.org/OSBv2/Overview.html"
                )
              }
            >
              More information
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
