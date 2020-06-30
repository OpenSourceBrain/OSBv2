import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  mainFeaturedPost: {
    position: 'relative',
    backgroundImage: 'url(images/banner.png)',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    overflow: 'hidden'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  mainFeaturedPostContent: {
    position: 'relative',
    padding: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6),
      paddingRight: 0,
    },
  },
 
}));

export const Banner = (props: any) => {
  const classes = useStyles();
  const user = props.user;
  const handleSignup = () => {
    props.keycloak.register();
  }

  const text1 = user === null ? "Let us show you around" : `Welcome back ${user.firstName}`;
  const text2 = user === null ? "Get started in OSB with our short guided tour." : "Let's do some science.";

  return (
    <Paper className={classes.mainFeaturedPost} style={{ backgroundImage: `url(images/banner.png)` }}>
      {/* Increase the priority of the hero background image */}
      {<img style={{ display: 'none' }} src="images/banner.png" alt="Let us show you around" />}
      <div className={classes.overlay} />
      <Grid container={true}>
        <Grid item={true} md={6}>
          <div className={classes.mainFeaturedPostContent}>
            <Typography component="h2" variant="h3" color="inherit" gutterBottom={true}>
              {text1}
            </Typography>
            <Typography variant="h5" color="inherit" paragraph={true}>
              {text2}
            </Typography>
            <Box display="flex" pt={1} flexDirection="row">

                <Button variant="outlined" >Take the tour</Button>
                {user === null ? <Box ml={2}><Button variant="outlined"  onClick={handleSignup}>Sign Up</Button></Box> : null}       
            </Box>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}
