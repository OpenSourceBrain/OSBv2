import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { UserInfo } from "../../types/user";
import { RootState } from "../../store/rootReducer";
import { userLogin } from "../../store/actions/user";

export const Banner = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user: UserInfo = useSelector((state: RootState) => state.user);
  
  const handleSignup = () => {
    // For now, using userLogin since register action doesn't exist yet
    // This should be replaced with proper registration action when implemented
    dispatch(userLogin());
  };

  return (
    <Box
      sx={{
        position: "relative",
        backgroundImage: "url(images/banner.png)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "35vh",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
          top: 0,
          backgroundColor: "rgba(0,0,0,.3)",
          display: "flex",
          alignItems: "flex-end",
          padding: 3,
        }}
      >
        <Box>
          <Box display="flex" pt={1} flexDirection="row">
            {// TODO temporarily disabled
              <Button variant="outlined" sx={{ display: "none" }}>Take the tour</Button>
            }
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
