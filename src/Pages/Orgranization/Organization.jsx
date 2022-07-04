import React, { useState, useEffect, lazy } from "react";
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
  Avatar,
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
import {
  KeyboardArrowRight,
  KeyboardArrowDown,
  ModeComment,
  ConnectingAirportsOutlined,
} from "@mui/icons-material";

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from "react-router-dom";
const AddOrganiztion = lazy(() =>
  import("../../Components/AddNewBusinessUser/AddNewBusinessUser")
);

const ref = firebase.firestore().collection("Organizations");

const Stats = ({navigation}) => {


const options = [
  'Managers',
   'Users',
   'Categories',
    'Products'
];
const ITEM_HEIGHT = 48;
const [anchorEl, setAnchorEl] = React.useState(null);
const open = Boolean(anchorEl);
const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
};
const handleClose = () => {
  setAnchorEl(null);
};
  const { enqueueSnackbar: notify } = useSnackbar();
  const [search, setSearch] = useState([]);
  const [allFilteredData, setAllFilteredData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addUserDialog, setAddUserDialog] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [organiztions, setOrganization] = useState([]);
  const [searchValue, setSearchValue] = useState("");

const navigate = useNavigate();

  useEffect(() => {
    let arr = handleSearch(searchValue);
    setSearch(arr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFilteredData]);
  useEffect(() => {
    getUsers();
  }, []);
  const handleUserDialogClose = () => {
    setAddUserDialog(false);
    setEdit(false);
    setEditUser(null);
  };
  const getUsers = async () => {
    try {
      const allDocs = await ref.get();

      let arr = [];

      allDocs.forEach(async (doc) => {
        arr.push({
          ...doc.data(),
          _id: doc.id,
        });
      });
    
      setOrganization(arr);
      setAllFilteredData(arr);

    } catch (error) {
      console.log(error.message);
    }
  };
  const handleDelete = async (id, name = "") => {
    try {
      await ref
        .doc(id)
        .delete()
        .then(() => {
          notify(`${name} deleted.`);
          getUsers();
        });
    } catch (error) {
      notify(error.message, { variant: "error" });
      console.log(error.message);
    } finally {
    }
  };
  const handleSearch = (value = "") => {
    value = value.trim().toLowerCase();
    let arr = cloneDeep(allFilteredData);
    console.log(allFilteredData)
    arr = arr.filter(
      (item) =>
        item?.OrgName?.toLowerCase().includes(value) ||
        item?.OrgEmail?.toLowerCase().includes(value)
    );
    console.log(arr)
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
  const onPressItem=(option,user)=>{

     if(option=="Managers"){
      navigate(`/admin/managers/${user?.id}`)
     }
     else if(option=="Users"){
      navigate(`/admin/users/${user?.id}`)
     }
     else if(option=="Categories"){
      navigation.navigate(`/admin/category`)
     }
     else if(option=="products"){
      navigation.navigate(`/admin/products`)
     }

  }

  return (
    <Box className="stats">
      <Grid container alignItems="stretch" columnSpacing={2} rowSpacing={2}>
        <Grid item xs={12}>
          <Divider textAlign="left">
            <Typography variant="h5" color="primary">
              Add New Organization
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
              <Button
                onClick={() => setAddUserDialog(true)}
                variant="contained"
                color="primary"
              >
                Add Organization
              </Button>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Logo</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>

                  <TableCell>Address</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell>Subscribtion</TableCell>
                  <TableCell>Stripe Account</TableCell>
                  <TableCell>Stripe Secret</TableCell>
                  <TableCell>Actions</TableCell>
                  <TableCell>Menu</TableCell>
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
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar src={user.OrgLogo} sx={{ mr: 5 }} />
                        </Box>
                      </TableCell>
                      <TableCell>{user.OrgName}</TableCell>
                      <TableCell>{user.OrgEmail}</TableCell>
                      <TableCell>{user.OrgAddress}</TableCell>
                      <TableCell
                        style={{
                          color: user.OrgColor,
                          backgroundColor: user.OrgColor,
                        }}
                      >
                        {user.OrgColor}
                      </TableCell>
                      <TableCell>
                        {new Date().getDate(user.StartDate) +
                          "/" +
                          new Date().getMonth(user.StartDate) +
                          "/" +
                          new Date().getFullYear(user.StartDate) +
                          "-" +
                          new Date().getDate(user.EndDate) +
                          "/" +
                          new Date().getMonth(user.EndDate) +
                          "/" +
                          new Date().getFullYear(user.EndDate)}
                      </TableCell>

                      <TableCell>{user.StripeKey}</TableCell>
                      <TableCell>{user.SecretKey}</TableCell>

                      <TableCell>
                        <ButtonGroup size="small" variant="outlined">
                          <Button
                            color="info"
                            onClick={() => {
                              setEditUser(user);
                              setEdit(true);
                              setAddUserDialog(true);
                            }}
                          >
                            Edit
                          </Button>
                          

                          <Button
                            onClick={() => handleDelete(user.id, user.name)}
                            color="error"
                          >
                            Delete
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                      <TableCell>
                      <IconButton
                          aria-label="more"
                          id="long-button"
                          aria-controls={open ? 'long-menu' : undefined}
                          aria-expanded={open ? 'true' : undefined}
                          aria-haspopup="true"
                          onClick={handleClick}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu
                          id="long-menu"
                          MenuListProps={{
                            'aria-labelledby': 'long-button',
                          }}
                          anchorEl={anchorEl}
                          open={open}
                          onClose={handleClose}
                          PaperProps={{
                            style: {
                              maxHeight: ITEM_HEIGHT * 4.5,
                              width: '20ch',
                            },
                          }}
                        >
                          {options.map((option) => (
                            <MenuItem  key={option} selected={option === 'Pyxis'} onClick={()=>onPressItem(option,user)}>
                              {option}
                            </MenuItem>
                          ))}
                        </Menu>
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
      <AddOrganiztion
        open={addUserDialog}
        handleClose={handleUserDialogClose}
        getUsers={getUsers}
        editUser={editUser}
        edit={edit}
      />
    </Box>
  );
};

export default Stats;
