import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { useKeycloak } from '@react-keycloak/ssr';
import type { KeycloakInstance } from 'keycloak-js';
import { User } from "../../types/model";

const useStyles = makeStyles((theme) => ({
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
  },
}));

export const Banner = (props: any) => {
  const classes = useStyles();
  const { keycloak, initialized } = useKeycloak<KeycloakInstance>();

  const user : User | undefined = keycloak?.tokenParsed;
  const handleSignup = () => {
    if (keycloak) {
      window.location.href = keycloak.createRegisterUrl()
    }
  };

  const text1 =
    !user ? "Let us show you around" : `Welcome back ${user?.given_name || user?.email}`;
  const text2 =
    !user
      ? "Get started in OSB with our short guided tour."
      : "Let's do some science.";

  return (
    <Box className={classes.mainFeaturedPost}>
      <Box className={classes.mainFeaturedPostContent}>
        <Box>
          <Typography component="h2" variant="h1" gutterBottom={true}>
            {text1}
          </Typography>
          <Typography variant="subtitle1" paragraph={true}>
            {text2}
          </Typography>
          <Box display="flex" pt={1} flexDirection="row">
            <Button variant="outlined">Take the tour</Button>
            {!user && (
              <Button onClick={handleSignup}>Sign up</Button>
            ) }
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
