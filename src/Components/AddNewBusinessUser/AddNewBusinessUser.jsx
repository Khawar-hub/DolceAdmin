import React, { useState, useEffect } from "react";
import { firebase } from "../../Firebase/config";
import {
  Autocomplete,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SketchPicker } from 'react-color'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Button,
  Box,
  LinearProgress,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Chip,
  Avatar
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import { TextField,Select } from "formik-mui";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { ADD_AUTH_USER } from "../../Shared/baseURL";
import "./styles.scss";
const ref = firebase.firestore().collection("Managers");
const ref2 = firebase.firestore().collection("Organizations");

const AddNewBusinessUser = ({
  open,
  getUsers,
  handleClose,
  editUser,
  edit,
}) => {
  // state
  const { enqueueSnackbar: notify } = useSnackbar();
  const [address, setAddress] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [startDate2, setStartDate2] = useState(new Date());
  const [preference, setPreference] = useState([]);
  const[position,setPosition]=useState(null)
  const [blockPickerColor, setBlockPickerColor] = useState("#543f2d");
  const [barImages, setBarImages] = React.useState({
    logo: "",
   
  });
  const autocompleteRef = React.useRef();

  const hiddenFileInput = React.useRef(null);
  // validation schema
  const AddSchema = yup.object().shape({
    name: yup.string().required("Required"),
    phone: yup.string(),
    email: yup.string().email().required("Required"),
    logo: yup.string().required("Required"),
    Address: yup.string(),
    manager: yup.string().required("Required"),
   StartDate:yup.string().required("Required"),
   EndDate:yup.string().required("Required"),
   Payment:yup.string().required("Required"),
   color:yup.string().required("Required"),
  });

  // initial states
  const initialState = {
    logo:'',
    name: "",
    Address:"",
    color:"",
    email: "",
    manager: "",
    Phone: "",
    StartDate: new Date(),
    EndDate:new Date(),
    Payment:""
  
  };

  const editInitialState = {
    name: editUser?.name,
    email: editUser?.email,
    username: editUser?.username,
    Age: editUser?.Age,
    Gender: editUser?.Gender,
    phone: editUser?.phone ?? "",
  };

  useEffect(() => {
      getManagers()
  }, []);
  const[managers,setManagers]=useState([])
  const getManagers=async()=>{
    try {
      const allDocs = await ref.get();
      let arr = [];
      allDocs.forEach((doc) => arr.push({ ...doc.data(), _id: doc.id }));
      let temp=[]
      arr.map((e)=>{
        temp.push({
          id:e.id,
          name:e.name
        })

      })
      setManagers(temp)
      
     
    } catch (error) {
      console.log(error.message);
    }

  }

  const handleSubmit = async (values, setSubmitting) => {
    try {
      // const res = await axios.post(ADD_AUTH_USER, {
      //   email: values.email,
      //   password: values.password,
      // });
      // if (res.status === 200) {
      //   console.log(res.data);
      //   const { userID } = res.data;
      const _id=firebase.firestore().collection('Random').doc().id;
        let data = {
          ...values,
          id: _id,
          logo:barImages.logo,
          color:blockPickerColor,
          startDate:startDate,
          EndDate:startDate2

          
        };
      //   delete data.password;
    
        await ref2
          .doc(_id)
          .set(data, { merge: true })
          .then(() => {
            notify("Organization added");
            getUsers();
          });
      
    } catch (error) {
      if (error.response) {
        notify(error.response.data, { variant: "error" });
      }
    } finally {
      setSubmitting(false);
      restoreInitialState();
    }
  };

  // const handleAddPreferences = (interest) => {
  //   let arr = [...preference];
  //   if (arr.includes(interest)) {
  //     arr = arr.filter((item) => item !== interest);
  //   } else {
  //     arr.push(interest);
  //   }
  //   setPreference(arr);
  // };

  const handleEditSubmit = async (values, setSubmitting) => {
    try {
      // let data = {
      //   ...values,
      //   Preferences: preference,
      // };
      // console.log(data);
      await ref
        .doc(editUser.id)
        .set(values, { merge: true })
        .then(() => {
          notify(`${editUser.name} updated.`);
          getUsers();
        });
    } catch (error) {
      console.log(error.message);
    } finally {
      setSubmitting(false);
      restoreInitialState();
    }
  };

  const restoreInitialState = () => {
    handleClose();
    // setPreference([]);
  };
  const handleClick = () => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    const file = event.target.files[0];
    const name = event.target.name;
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      function () {
        // convert image file to base64 string
        if (file.type === "image/png" || file.type === "image/jpeg") {
        
          setBarImages({ logo:reader.result });
        } else {
          alert(
            "Error: Please a insert valid image file with following extensions .jpeg .png"
          );
        }
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const onAutoCompleteLoad = React.useCallback((map) => {
    autocompleteRef.current = map;
  }, []);
  const onPlaceChanged = (obj) => {
    if (autocompleteRef !== null) {
      console.log(autocompleteRef.current.getPlace())
      setPosition(
        obj ?? {
          lat: autocompleteRef.current.getPlace().geometry.location.lat(),
          lng: autocompleteRef.current.getPlace().geometry.location.lng(),
        }
      );

      // Geocode.fromLatLng(position.lat, position.lng).then(
      //   (response) => {
      //     const location = response.results[0].formatted_address;
      //     console.log(location,"dscdscsd");
      //     setAddress(location);
      //   },
      //   (error) => {
      //     console.error(error);
      //   }
      // );
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };
  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={handleClose}>
      <DialogTitle>
        {edit ? `Edit ${editUser.name}` : "Add new Organization"}
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={edit ? editInitialState : initialState}
          onSubmit={(values, { setSubmitting }) => {
            if (edit) {
              handleEditSubmit(values, setSubmitting);
            } else {
              handleSubmit(values, setSubmitting);
            }
          }}
          validationSchema={AddSchema}
        >
          {({ isSubmitting, submitForm, values, setFieldValue }) => (
            <Form>
              <Grid container sx={{ mt: 2 }} spacing={2}>
              <Grid style={{flexDirection:'row'}} item xs={8}  className="profile-image">
                  <div className="img__wrap" onClick={handleClick}>
                    <input
                      accept="image/*"
                      id="contained-button-file"
                      name="logo"
                      type="file"
                      ref={hiddenFileInput}
                      onChange={handleChange}
                      style={{ display: "none" }}
                    />
                    <Avatar
                      style={{height:'100px',width:'100px'}}
                      src={barImages.logo}
                      alt="log"
                      className="user-image"
                    />
                    <div class="img__description_layer">
                      <p class="img__description">Add logo</p>
                    </div>
                  </div>
                  <Grid item xs={12} md={6}>
                    {/* <Field
                      component={TextField}
                      label="Color"
                      name="Color"
                      fullWidth
                    /> */}
                    <SketchPicker
                      name="color"
                      color={blockPickerColor}
                      onChange={(color) => {
                        setBlockPickerColor(color.hex);
                      }}
                     />
                       <div class="img__description_layer">
                      <p class="img__description">Color</p>
                    </div>

                  </Grid>
                </Grid>
             
                <Grid item xs={12} md={6}>
                  <Field
                    component={TextField}
                    label="Name"
                    name="name"
                    fullWidth
                  />
                </Grid>
               
                <Grid item xs={12} md={6}>
                <LoadScript googleMapsApiKey={"AIzaSyAW5O831v7xI0OVGJufVHJiIcJgeMybNdA"} libraries={["places"]}>
                <Autocomplete
              onLoad={onAutoCompleteLoad}
              onPlaceChanged={onPlaceChanged}
            
            >
               <Field
                      component={TextField}
                      label="Address"
                      name="Address"
                      fullWidth
                    />
            </Autocomplete>
                  </LoadScript>
                  
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    component={TextField}
                    label="Email"
                    name="email"
                    fullWidth
                  />
                </Grid>
                
                 
                
                <Grid item xs={12} md={6}>
                <div class="img__description_layer">
                      <p class="img__description">Select Manager</p>
                    </div>
                <Field as="select" name="manager">
                  {managers.map((item)=>{
                    return(
                      <option value={item.id}>{item.name}</option>
                    )

                  })}
                
       
          </Field>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    component={TextField}
                    label="Phone"
                    name="Phone"
                    fullWidth
                  />
                </Grid>
                {/* {!edit && (
                  <Grid item xs={12} md={6}>
                    <FormControl>
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        User Type
                      </FormLabel>
                      <RadioGroup
                        row
                        onChange={(e) => {
                          setFieldValue(
                            "profileStatus",
                            parseInt(e.target.value)
                          );
                        }}
                      >
                        <FormControlLabel
                          value={0}
                          control={<Radio />}
                          label="Standard"
                          checked={values.profileStatus === 0}
                        />
                        <FormControlLabel
                          value={1}
                          control={<Radio />}
                          label="Business"
                          checked={values.profileStatus === 1}
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                )} */}
                 <Grid item xs={12} md={6}>
                 <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Subscription Start Date
                    </FormLabel>

                 <DatePicker name="StartDate" selected={startDate} onChange={(date) => setStartDate(date)} />
                 </FormControl>

                 </Grid>
                 <Grid item xs={12} md={6}>
                 <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Subscription End Date
                    </FormLabel>

                 <DatePicker name="EndDate" selected={startDate2} onChange={(date) => setStartDate2(date)} />
                 </FormControl>

                 </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Payment
                    </FormLabel>
                    <RadioGroup
                    name="Payment"
                      row
                      onChange={(e) => setFieldValue("Payment", e.target.value)}
                    >
                      <FormControlLabel
                        value="Cash"
                        control={<Radio />}
                        label="Cash"
                        checked={values.Gender === "Cash"}
                      />
                      <FormControlLabel
                        value="Check"
                        control={<Radio />}
                        label="Check"
                        checked={values.Gender === "Check"}
                      />
                      <FormControlLabel
                        value="Card"
                        control={<Radio />}
                        label="Card"
                        checked={values.Gender === "Card"}
                        
                      />
                      <FormControlLabel
                        value="Link"
                        control={<Radio />}
                        label="Link"
                        checked={values.Gender === "Link"}
                        
                      />
                       <FormControlLabel
                        value="Bank Transfer"
                        control={<Radio />}
                        label="Bank Transfer"
                        checked={values.Gender === "Bank Transfer"}
                        
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              
                <Grid item xs={12}>
                  {isSubmitting && <LinearProgress />}
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      onClick={restoreInitialState}
                      variant="outlined"
                      color="error"
                      sx={{ mr: 1 }}
                      disabled={isSubmitting}
                    >
                      Close
                    </Button>
                    <Button
                      disabled={isSubmitting}
                      disableElevation
                      onClick={submitForm}
                      variant="contained"
                    >
                      Submit
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewBusinessUser;
