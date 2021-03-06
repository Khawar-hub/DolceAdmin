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
  import { cloneDeep } from "lodash";
  import { firebase } from "../../Firebase/config";
  import { useSnackbar } from "notistack";
  import dayjs from "dayjs";
  import "./styles.scss";
  import { KeyboardArrowRight, KeyboardArrowDown } from "@mui/icons-material";
import { useParams } from 'react-router-dom';
  const AddManager = lazy(() =>
  import("../../Components/AddManager/AddManager")
);

const ref = firebase.firestore().collection("Managers");

const ref2 = firebase.firestore().collection("Organizations");
  const Stats = () => {
    const { enqueueSnackbar: notify } = useSnackbar();
      const [search, setSearch] = useState([]);
    const [allFilteredData, setAllFilteredData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [addUserDialog, setAddUserDialog] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [edit, setEdit] = useState(false);
    const[managers,setManagers]=useState([])
    const [searchValue, setSearchValue] = useState("");
    useEffect(() => {
      let arr = handleSearch(searchValue);
      setSearch(arr);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allFilteredData]);
    const params=useParams()
    useEffect(()=>{
       getUsers()
    
    },[])
    const handleUserDialogClose = () => {
      setAddUserDialog(false);
      setEdit(false);
      setEditUser(null);
    };
    const getUsers=async()=>{
 
      try {
        const allDocs = await ref2.doc(params?.id).get();

        let arr = [];
        const element=allDocs.data()
        
         
           for(let x=0;x<element?.managers?.length;x++){
      
                  const id=element?.managers[x]
                  console.log(id)
                const data=await ref.doc(id).get()
                if(data?.data()){
                  arr.push(data?.data())
                }
           }
            
            

        
    
        setManagers(arr)
        console.log(managers?.length)
        setAllFilteredData(arr)
       
      } catch (error) {
        console.log(error.message);
      }
    }
    const handleDelete = async (id, name = "") => {
     
      try {
       
          await ref
            .doc(id)
            .delete()
            .then(() => {
              notify(`${name} deleted.`);
              getUsers();
            });
            await ref2.doc(params?.id).set({
               managers:firebase.firestore.FieldValue.arrayRemove(id)
            },{merge:true})
          
      } catch (error) {
        notify(error.message, { variant: "error" });
        console.log(error.message);
      } finally {
        
      }
    };
    const handleSearch = (value = "") => {
      if (value !== "") {
        setPage(0);
      }
      value = value.trim().toLowerCase();
      let arr = cloneDeep(allFilteredData);
      arr = arr.filter(
        (item) =>
          item?.ManagerName?.toLowerCase().includes(value) ||
          item?.ManagerEmail?.toLowerCase().includes(value)
      );
      setSearch(arr);
      setSearchValue(value);
      return arr;
    };
    const handlePageChange = (newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
  
    return (
      <Box className="stats">
        <Grid container alignItems="stretch" columnSpacing={2} rowSpacing={2}>
        
          <Grid item xs={12}>
            <Divider textAlign="left">
           
              <Typography variant="h5" color="primary">
                Add Manager
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
            onChange={(e) => handleSearch(e.target.value)}
          
          />
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            {/* <Button
             
              startIcon={
               <KeyboardArrowRight />
              }
            >
              Filters
            </Button> */}
             {!managers?.length>=1?
            <Button
            onClick={()=>setAddUserDialog(true)}
              variant="contained"
              color="primary"
            >
              Add Manager
            </Button>:null}
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
                  <TableCell>Username</TableCell>
                  <TableCell>Password</TableCell>
                 
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
      
              {(rowsPerPage > 0
                  ? search.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : search
                ).map((user) => (
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
                        {user.ManagerName}
                        {/* </Box> */}
                      </TableCell>
                      <TableCell>{user.ManagerEmail}</TableCell>
                      <TableCell>{user.ManagerPhone}</TableCell>
                      <TableCell>{user.ManagerGender}</TableCell>
                      <TableCell>{user.ManagerAge}</TableCell>
                      <TableCell>{user.ManagerUsername}</TableCell>
                     
                      <TableCell>{user.ManagerPassword}</TableCell>
                    
                     
                      <TableCell>
                        
                          <ButtonGroup size="small" variant="outlined">
                            <Button
                              color="info"
                             onClick={()=>{
                               setEditUser(user)
                               setEdit(true)
                               setAddUserDialog(true)

                             }}
                            >
                              Edit
                            </Button>
                           
                            <Button
                             onClick={()=>handleDelete(user.id,user.name)}
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
                count={allFilteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(event, newPage) => handlePageChange(newPage)}
                onRowsPerPageChange={handleChangeRowsPerPage}
                showFirstButton
                showLastButton
              />
            </Table>
          </TableContainer>
          </Grid>
        </Grid>
        <AddManager
        open={addUserDialog}
        id={params?.id}
        handleClose={handleUserDialogClose}
        getUsers={getUsers}
        editUser={editUser}
        edit={edit}
      />
      </Box>
    );
  };
  
  export default Stats;
  