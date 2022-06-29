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
import { SketchPicker } from "react-color";
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
  Avatar,
  MenuItem,
  Stepper,
  Step,
  StepLabel
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TextField, Select } from "formik-mui";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { ADD_AUTH_USER } from "../../Shared/baseURL";
import "./styles.scss";
import { singleImageUpload } from "../../Firebase/utils";
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
  const [libraries] = useState(["places"]);
  const [startDate, setStartDate] = useState(new Date());
  const [startDate2, setStartDate2] = useState(new Date());
  const [preference, setPreference] = useState([]);
  const [position, setPosition] = useState(null);
  const [blockPickerColor, setBlockPickerColor] = useState("#543f2d");
  const [barImages, setBarImages] = React.useState({
    logo: editUser?editUser?.logo:"",
  });
  const autocompleteRef = React.useRef();

  const hiddenFileInput = React.useRef(null);
  // validation schema
  const AddSchema = yup.object().shape({
    name: yup.string().required("Required"),
    Phone: yup.string(),
    email: yup.string().email().required("Required"),
    logo: yup.mixed().required("Required"),
    Address: yup.string(),
    city: yup.string().required("Required"),
    country: yup.string().required("Required"),
    color: yup.string().required("Required"),
  });

  // initial states
  const initialState = {
    name: "",
    Address: "",
    color: "",
    logo: "",
    email: "",
    city: "",
    country:"",
    Phone: "",
 
  };

  const editInitialState = {
    name:editUser?.name,
    Address:editUser?.Address,
    color:editUser?.color,
    logo:editUser?.logo,
    email:editUser?.email,
    city:editUser?.city,
    country:editUser?.country,
    Phone: editUser?.Phone,
 
  };

  useEffect(() => {
    getManagers();
  }, []);
  const [managers, setManagers] = useState([]);
  const getManagers = async () => {
    try {
      const allDocs = await ref.get();
      let arr = [];
      allDocs.forEach((doc) => arr.push({ ...doc.data(), _id: doc.id }));
      let temp = [];
      arr.map((e) => {
        temp.push({
          id: e.id,
          name: e.name,
        });
      });
      setManagers(temp);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async (values, setSubmitting) => {
    try {
      const _id=firebase.firestore().collection('Random').doc().id;
      const url =await singleImageUpload(`images/Organizations/${_id}`,barImages.file)
     const dataManager= await ref.doc(values.manager).get()
   
      let data = {
        ...values,
        id: _id,
        logo:url,
        startDate: startDate,
        EndDate: startDate2,
        manager_name:dataManager.data().name
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
   
      const url =await singleImageUpload(`images/Organizations/${editUser.id}`,values.logo)
      const dataManager= await ref.doc(values.manager).get()

      let data = {
        ...values,
       manager_name:dataManager.data().name,
       logo:url
      };
   
      await ref2
        .doc(editUser.id)
        .set(data, { merge: true })
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
          setBarImages({ logo: reader.result,file:file });
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
      console.log(autocompleteRef.current.getPlace());
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
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const steps = ['Organization Detail', 'Subscription', 'Manager','User','Payment','Menu'];
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
            
               setTimeout(() => {
                setSubmitting(false);
              }, 3000);
            } else {
              handleSubmit(values, setSubmitting);
              console.log(values, "values");
              setTimeout(() => {
                setSubmitting(false);
              }, 3000);
           
            }
          }}
          validationSchema={AddSchema}
        >
          {({ isSubmitting, submitForm, values, setFieldValue }) => (
            <Form>
              <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          // const stepProps={};
          // const labelProps = {};
          // if (isStepOptional(index)) {
          //   labelProps.optional = (
          //     <Typography variant="caption">Optional</Typography>
          //   );
          // }
          // if (isStepSkipped(index)) {
          //   stepProps.completed = false;
          // }
          return (
            <Step key={label}>
              <StepLabel >{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) :activeStep==0 ?(
        <React.Fragment>
       
        <Grid container sx={{ mt: 2 }} spacing={2}>
                <Grid
                  style={{ flexDirection: "row" }}
                  item
                  xs={6}
                  className="profile-image"
                >
                  <div className="img__wrap" onClick={handleClick}>
                    <input
                      accept="image/*"
                      id="contained-button-file"
                      name="logo"
                      type="file"
                      ref={hiddenFileInput}
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue("logo", e.target.files[0]);
                      }}
                      style={{ display: "none" }}
                    />
                    <Avatar
                      style={{
                        height: "300px",
                        width: "300px",
                        cursor: "pointer",
                      }}
                      src={barImages.logo?barImages.logo:editUser?.logo}
                      alt="log"
                      className="user-image"
                    />
                    <div class="img__description_layer">
                      <p class="img__description">Add logo</p>
                    </div>
                  </div>
                  <ErrorMessage
                    name="logo"
                    render={(msg) => <div className="input-error">{msg}</div>}
                  />
                </Grid>
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
                      setFieldValue("color", color.hex);
                    }}
                  />
                  <div class="img__description_layer">
                    <p class="img__description">Color</p>
                  </div>
                  <ErrorMessage
                    name="color"
                    render={(msg) => <div className="input-error">{msg}</div>}
                  />
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
                  <LoadScript
                    googleMapsApiKey="AIzaSyAW5O831v7xI0OVGJufVHJiIcJgeMybNdA"
                    libraries={libraries}
                  >
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
{/* 
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Field
                      component={Select}
                      type="text"
                      label="Manager"
                      name="manager"
                    >
                      {managers.map((item) => (
                        <MenuItem value={item.id}  key={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Field>
                  </FormControl>
                </Grid> */}
                <Grid item xs={12} md={6}>
                  <Field
                    component={TextField}
                    label="Phone"
                    name="Phone"
                    type="number"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    component={TextField}
                    label="City"
                    name="city"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    component={TextField}
                    label="Country"
                    name="country"
                    fullWidth
                  />
                </Grid>
                {/* <Grid item xs={12} md={6}>
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Subscription Start Date
                    </FormLabel>

                    <DatePicker
                      name="StartDate"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Subscription End Date
                    </FormLabel>

                    <DatePicker
                      name="EndDate"
                      selected={startDate2}
                      onChange={(date) => setStartDate2(date)}
                    />
                  </FormControl>
                </Grid> */}
                {/* <Grid item xs={12} md={6}>
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
                        checked={values.Payment === "Cash"}
                      />
                      <FormControlLabel
                        value="Check"
                        control={<Radio />}
                        label="Check"
                        checked={values.Payment === "Check"}
                      />
                      <FormControlLabel
                        value="Card"
                        control={<Radio />}
                        label="Card"
                        checked={values.Payment === "Card"}
                      />
                      <FormControlLabel
                        value="Link"
                        control={<Radio />}
                        label="Link"
                        checked={values.Payment === "Link"}
                      />
                      <FormControlLabel
                        value="Bank Transfer"
                        control={<Radio />}
                        label="Bank Transfer"
                        checked={values.Payment === "Bank Transfer"}
                      />
                    </RadioGroup>
                  </FormControl>
                  <ErrorMessage
                    name="Payment"
                    render={(msg) => <div className="input-error">{msg}</div>}
                  />
                </Grid> */}

                <Grid item xs={12}>
                  {isSubmitting && <LinearProgress />}
                </Grid>
                {/* <Grid item xs={12}>
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
                </Grid> */}
              </Grid>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {/* {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )} */}
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </React.Fragment>
      ):activeStep==1?
       <React.Fragment>
      <Grid container sx={{ mt: 2 }} spacing={2}>
            

             
{/* 
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <Field
                    component={Select}
                    type="text"
                    label="Manager"
                    name="manager"
                  >
                    {managers.map((item) => (
                      <MenuItem value={item.id}  key={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Field>
                </FormControl>
              </Grid> */}
              
              <Grid item xs={12} md={6}>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    Subscription Start Date
                  </FormLabel>

                  <DatePicker
                    name="StartDate"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    Subscription End Date
                  </FormLabel>

                  <DatePicker
                    name="EndDate"
                    selected={startDate2}
                    onChange={(date) => setStartDate2(date)}
                  />
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
                      checked={values.Payment === "Cash"}
                    />
                    <FormControlLabel
                      value="Check"
                      control={<Radio />}
                      label="Check"
                      checked={values.Payment === "Check"}
                    />
                    <FormControlLabel
                      value="Card"
                      control={<Radio />}
                      label="Card"
                      checked={values.Payment === "Card"}
                    />
                    <FormControlLabel
                      value="Link"
                      control={<Radio />}
                      label="Link"
                      checked={values.Payment === "Link"}
                    />
                    <FormControlLabel
                      value="Bank Transfer"
                      control={<Radio />}
                      label="Bank Transfer"
                      checked={values.Payment === "Bank Transfer"}
                    />
                  </RadioGroup>
                </FormControl>
                <ErrorMessage
                  name="Payment"
                  render={(msg) => <div className="input-error">{msg}</div>}
                />
              </Grid>

              <Grid item xs={12}>
                {isSubmitting && <LinearProgress />}
              </Grid>
              {/* <Grid item xs={12}>
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
              </Grid> */}
            </Grid>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {/* {isStepOptional(activeStep) && (
            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
              Skip
            </Button>
          )} */}
          <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box></React.Fragment>:activeStep==2?
           <React.Fragment>
             <Grid container sx={{ mt: 2 }} spacing={2}>
                <Grid item xs={12} md={6}>
                  <Field
                    component={TextField}
                    label="Name"
                    name="name"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    component={TextField}
                    label="Username"
                    name="username"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    component={TextField}
                    label="Email"
                    name="email"
                    fullWidth
                  />
                </Grid>
                {!edit && (
                  <Grid item xs={12} md={6}>
                    <Field
                      component={TextField}
                      label="Password"
                      name="password"
                      fullWidth
                    />
                  </Grid>
                )}
                <Grid item xs={12} md={6}>
                  <Field
                    component={TextField}
                    label="Age"
                    name="Age"
                    type="text"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    component={TextField}
                    label="Phone"
                    name="phone"
                    fullWidth
                  />
                </Grid>
               
                <Grid item xs={12} md={6}>
                  <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">
                      Gender
                    </FormLabel>
                    <RadioGroup
                      row
                      onChange={(e) => setFieldValue("Gender", e.target.value)}
                    >
                      <FormControlLabel
                        value="Male"
                        control={<Radio />}
                        label="Male"
                        checked={values.Gender === "Male"}
                      />
                      <FormControlLabel
                        value="Female"
                        control={<Radio />}
                        label="Female"
                        checked={values.Gender === "Female"}
                      />
                      <FormControlLabel
                        value="Other"
                        control={<Radio />}
                        label="Other"
                        checked={values.Gender === "Other"}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              
                <Grid item xs={12}>
                  {isSubmitting && <LinearProgress />}
                </Grid>
                
              </Grid>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {/* {isStepOptional(activeStep) && (
            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
              Skip
            </Button>
          )} */}
          <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
           </React.Fragment>
        :
        <React.Fragment></React.Fragment>
        
        }
    </Box>
              
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewBusinessUser;
