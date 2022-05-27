import React,{useState,useEffect,lazy} from 'react'
import {
    Divider,
    Typography,
    Card,
    CardActionArea,
    Paper,
    Table,
    IconButton,
    Box,
    Button,
    Grid,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
  
    ButtonGroup,
    CircularProgress,
    Collapse,
    Radio,
    FormControl,
    FormControlLabel,
    RadioGroup,
    FormLabel,
    Chip,
    
    TablePagination,
  } from "@mui/material";
  import dayjs from "dayjs";
  import "./styles.scss";
  import { KeyboardArrowRight, KeyboardArrowDown } from "@mui/icons-material";
  const AddBusinessUser = lazy(() =>
  import("../../Components/AddNewBusinessUser/AddNewBusinessUser")
);
  const Stats = () => {
    const [addUserDialog, setAddUserDialog] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [edit, setEdit] = useState(false);
    const user=[{name:'asd',email:'asd',phone:'123',Gender:'asd',Age:'sd',username:'asd',isBlocked:false}]
    const handleUserDialogClose = () => {
      setAddUserDialog(false);
      setEdit(false);
      setEditUser(null);
    };
    return (
      <Box className="stats">
        <Grid container alignItems="stretch" columnSpacing={2} rowSpacing={2}>
          
          <Grid item xs={12}>
            <Divider textAlign="left">
              <Typography variant="h5" color="primary">
                Add New Organiztion
              </Typography>
            </Divider>
          </Grid>
          <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            justifyContent: { xs: "start", sm: "space-between" },
            alignItems: { xs: "start", sm: ' "center"' },
          }}
        >
          <TextField
            size="small"
            label="Search by name or email"
            type="text"
          
          />
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <Button
             
              startIcon={
               <KeyboardArrowRight />
              }
            >
              Filters
            </Button>
            <Button
            onClick={()=>setAddUserDialog(true)}
              variant="contained"
              color="primary"
            >
              Add User
            </Button>
          </Box>
        </Box>
      </Grid>

          <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {user.map((user) => (
                  <>
                    <TableRow
                      hover
                      key={user._id}
                      sx={{ "& > *": { borderBottom: "unset" } }}
                    >
                      <TableCell>
                        <IconButton>
                         
                            <KeyboardArrowRight />
                          
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        {/* <Box sx={{ display: "flex", alignItems: "center" }}> */}
                        {/* <Avatar src={user.profilePic} sx={{ mr: 1 }} /> */}
                        {user.name}
                        {/* </Box> */}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.Gender}</TableCell>
                      <TableCell>{user.Age}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          color="success"
                          variant={
                            "Standard"
                          }
                          label={
                          "Standard"
                          }
                        />
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                     
                      <TableCell>
                        
                          <ButtonGroup size="small" variant="outlined">
                            <Button
                              color="info"
                             
                            >
                              Edit
                            </Button>
                            {user.isBlocked ? (
                              <Button
                               
                                color="warning"
                              >
                                Unblock
                              </Button>
                            ) : (
                              <Button
                                
                                color="warning"
                              >
                                Block
                              </Button>
                            )}
                            <Button
                             
                              color="error"
                            >
                              Delete
                            </Button>
                          </ButtonGroup>
                        
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        colSpan={12}
                        sx={{ paddingBottom: 0, paddingTop: 0 }}
                      >
                        <Collapse unmountOnExit>
                          {/* <UserDetails user={user} /> */}
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                ))}
              </TableBody>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                count={2}
                rowsPerPage={2}
                page={1}
      
               
                showFirstButton
                showLastButton
              />
            </Table>
          </TableContainer>
          </Grid>
        </Grid>
        <AddBusinessUser
        open={addUserDialog}
        handleClose={handleUserDialogClose}
       
        editUser={editUser}
        edit={edit}
      />
      </Box>
    );
  };
  
  export default Stats;
  