import { getDateRangePickerDayUtilityClass } from "@mui/lab";
import {
    Divider,
    Typography,
    Card,
    CardActionArea,
    Paper,
    Grid,
    Box,
    TableContainer,
    TableHead,
    Button,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    Table
  } from "@mui/material";
  import dayjs from "dayjs";
import { useEffect,useState } from "react";
import { firebase } from "../../Firebase/config";
  import "./styles.scss";
  const ref = firebase.firestore().collection("Organizations");
  const ref2 = firebase.firestore().collection("New Orders");

  const Stats = () => {
    const[managers,setManagers]=useState([])
    const[orders,setOrders]=useState(0)
    useEffect(()=>{
       getData()
    },[])
   
    const getData=async()=>{
      try {
        const allDocss = await ref2.get();
        setOrders(allDocss.size)
        
        
        const allDocs = await ref.get();
        let arr = [];
      allDocs.forEach((doc) => arr.push({ ...doc.data(), _id: doc.id }));
       
       
        setManagers(arr)
        console.log(arr)

    
       
      } catch (error) {
        console.log(error.message);
      }
    }
    return (
      <Box className="stats">
        <Grid container alignItems="stretch" columnSpacing={2} rowSpacing={2}>
          <Grid item xs={12}>
            <Divider textAlign="left">
              <Typography variant="h5" color="primary">
                Home
              </Typography>
            </Divider>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Box>
              <CardActionArea>
                <Paper component={Card} elevation={3} className="p-3">
                  <Typography variant="body2" color="primary">
                    {dayjs().format("DD/MM/YYYY")}
                  </Typography>
                
                </Paper>
                <Paper component={Card} elevation={3} className="p-3">
                  <Typography variant="body2" color="primary">
                    {"Total Orders:"+orders}
                  </Typography>
                
                </Paper>
              </CardActionArea>
            </Box>
            </Grid>
            <Grid xs={8} item >
            <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                
                  <TableCell>Organization</TableCell>
                  <TableCell>Subscription End Date:</TableCell>
                  {/* <TableCell>Status</TableCell> */}
                 
                </TableRow>
              </TableHead>
              <TableBody>
              {
                  managers
                 .map((user) => (
                  <>
                    <TableRow
                      hover
                      key={user.oid}
                      sx={{ "& > *": { borderBottom: "unset" } }}
                    >
                     
                    
                      <TableCell>{user.OrgName}</TableCell>
                      <TableCell>{new Intl.DateTimeFormat('en-PK', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(user.EndDate.seconds*1000)}</TableCell>
                      {/* <TableCell>
                        <Button color="error">
                        {dayjs(new Intl.DateTimeFormat('en-PK', {year: 'numeric', month: '2-digit',day: '2-digit'}).format(user.EndDate.seconds*1000)).isBefore(dayjs().format('DD/MM/YYYY'))?"Expired":"Live"}
                        </Button>
                      </TableCell> */}

                     
                     
                    </TableRow>
                  
                  </>
                ))}
              </TableBody>
             
            </Table>
          </TableContainer>
          </Grid>
        </Grid>
      </Box>
    );
  };
  
  export default Stats;
  