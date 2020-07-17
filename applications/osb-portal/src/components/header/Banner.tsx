import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { UserInfo } from "../../types/user";

const useStyles = makeStyles((theme) => ({
  mainFeaturedPost: {
    position: "relative",
    backgroundImage: "url(images/banner.png)",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,

    backgroundColor: "rgba(0,0,0,.3)",
  },
  mainFeaturedPostContent: {
    position: "relative",
    padding: theme.spacing(3),
    paddingTop: "8vh",
  },
}));

export const Banner = (props: any) => {
  const classes = useStyles();
  const user: UserInfo = props.user;
  const handleSignup = () => {
    props.register();
  };

  const text1 =
    user === null ? "Let us show you around" : `Welcome back ${user.firstname}`;
  const text2 =
    user === null
      ? "Get started in OSB with our short guided tour."
      : "Let's do some science.";

  return (
    <section
      className={classes.mainFeaturedPost}
      style={{ backgroundImage: `url(images/banner.png)` }}
    >
      {/* Increase the priority of the hero background image */}
      {
        <img
          style={{ display: "none" }}
          src="images/banner.png"
          alt="Let us show you around"
        />
      }
      <div className={classes.overlay} />
      <div className={classes.mainFeaturedPostContent}>
        <Box pt={8}>
          <Typography component="h2" variant="h1" gutterBottom={true}>
            {text1}
          </Typography>
          <Typography variant="subtitle1" paragraph={true}>
            {text2}
          </Typography>
          <Box display="flex" pt={1} flexDirection="row">
            <Button variant="outlined">Take the tour</Button>
            {user === null ? (
              <Button onClick={handleSignup}>
                Sign in
              </Button>
            ) : null}
          </Box>
        </Box>
      </div>
    </section>
  );
};
