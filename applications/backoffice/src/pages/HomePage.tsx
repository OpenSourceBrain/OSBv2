import * as React from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';

import makeStyles from '@mui/styles/makeStyles';

import { getUsers } from  "../service/UserService";



const useStyles = makeStyles((theme) => ({
  paper: {
    overflow: "hidden",
  },

}));


export default (props: any) => {
  const classes = useStyles();
  const [ users, setUsers ] = React.useState<any>(null);

  const fetchUsers = () => {
    getUsers().then((u) => setUsers(u.users));
  };

  React.useEffect(() => {
    fetchUsers();
  }, [ ]);

  if (!users) {
    return null;
  }

  return <>
    <Box p={1}>
      {users && users.map((user) => (
        <Grid
          container={true}
          className="row"
          spacing={0}
          key={user.username}
        >
          < Typography component="strong" >
            {user.username}
          </Typography>
        </Grid>))}
    </Box>
  </>
};
