import {
  Divider,
  Typography,
  Card,
  CardActionArea,
  Paper,
  Grid,
  Box,
} from "@mui/material";
import dayjs from "dayjs";
import "./styles.scss";

const Stats = () => {
  return (
    <Box className="stats">
      <Grid container alignItems="stretch" columnSpacing={2} rowSpacing={2}>
        <Grid item xs={12}>
          <Divider textAlign="left">
            <Typography variant="h5" color="primary">
              Statistics
            </Typography>
          </Divider>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Box>
            <CardActionArea>
              <Paper component={Card} elevation={3} className="p-3">
                <Typography variant="body2" color="primary">
                  {dayjs().format("MMM DD, YYYY")}
                </Typography>
              </Paper>
            </CardActionArea>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Stats;
