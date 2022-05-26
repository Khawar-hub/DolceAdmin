import React, { useEffect } from "react";
import { Divider, Typography, Grid } from "@mui/material";

const Users = () => {
  useEffect(() => {}, []);

  return (
    <div>
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={12}>
          <Divider textAlign="left">
            <Typography variant="h5" color="primary">
              Users
            </Typography>
          </Divider>
        </Grid>
      </Grid>
    </div>
  );
};

export default Users;
