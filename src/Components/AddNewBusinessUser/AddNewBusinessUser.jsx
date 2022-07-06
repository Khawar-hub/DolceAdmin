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
  StepLabel,
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
const ref3 = firebase.firestore().collection("Users");
const ref4 = firebase.firestore().collection("Categories");

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
    logo: editUser ? editUser?.logo : "",
  });
  const [barImagess, setBarImagess] = React.useState({
    logo: editUser ? editUser?.logo : "",
  });
  const autocompleteRef = React.useRef();

  const hiddenFileInput = React.useRef(null);
  // validation schema
  const AddSchema = yup.object().shape({
    OrgName: yup.string().required("Required"),
    OrgPhone: yup.string(),
    OrgEmail: yup.string().email().required("Required"),
    OrgLogo: yup.mixed().required("Required"),
    OrgAddress: yup.string(),
    OrgCity: yup.string().required("Required"),
    OrgCountry: yup.string().required("Required"),
    OrgColor: yup.string(),
    ManagerName: yup.string().required("Required"),
    ManagerUsername: yup.string().required("Required"),
    ManagerEmail: yup.string().required("Required"),
    ManagerPhone: yup.string().required("Required"),
    ManagerAge: yup.string().required("Required"),
    ManagerPassword: yup.string().required("Required"),
    ManagerGender: yup.string().required("Required"),
    UserName: yup.string(),
    UserUsername: yup.string(),
    UserEmail: yup.string(),
    UserPhone: yup.string(),
    UserOfficeNumber: yup.string(),
    UserPassword: yup.string(),
    UserWallet: yup.string(),
    // StartDate: yup.string().required("Required"),
    // EndDate: yup.string().required("Required"),
    StripeKey: yup.string().required("Required"),
    SecretKey: yup.string().required("Required"),
    CatImg: yup.mixed().required("Required"),
    CatName: yup.string().required("Required"),
  });

  // initial states
  const initialState = {
    OrgName: "",
    OrgAddress: "",
    OrgColor: "",
    OrgLogo: "",
    OrgEmail: "",
    OrgCity: "",
    OrgCountry: "",
    OrgPhone: "",
    ManagerName: "",
    ManagerUsername: "",
    ManagerEmail: "",
    ManagerPhone: "",
    ManagerAge: "",
    ManagerPassword: "",
    ManagerGender: "",
    UserName: "",
    UserUsername: "",
    UserEmail: "",
    UserPhone: "",
    UserOfficeNumber: "",
    UserPassword: "",
    UserWallet: "",
    StartDate: "",
    EndDate: "",
    StripeKey: "",
    SecretKey: "",
    CatImg: "",
    CatName: "",
  };

  const editInitialState = {
    OrgName: editUser?.OrgName,
    OrgAddress: editUser?.OrgAddress,
    OrgColor: editUser?.OrgColor,
    OrgLogo: editUser?.OrgLogo,
    OrgEmail: editUser?.OrgEmail,
    OrgCity: editUser?.OrgCity,
    OrgCountry: editUser?.OrgCountry,
    OrgPhone: editUser?.OrgPhone,
    ManagerName: editUser?.ManagerName,
    ManagerUsername: editUser?.ManagerUsername,
    ManagerEmail: editUser?.ManagerEmail,
    ManagerPhone: editUser?.ManagerPhone,
    ManagerAge: editUser?.ManagerAge,
    ManagerPassword: editUser?.ManagerPassword,
    ManagerGender: editUser?.ManagerGender,
    UserName: editUser?.UserName,
    UserUsername: editUser?.UserUsername,
    UserEmail: editUser?.UserEmail,
    UserPhone: editUser?.UserPhone,
    UserOfficeNumber: editUser?.UserOfficeNumber,
    UserPassword: editUser?.UserPassword,
    UserWallet: editUser?.Wallet,
    StartDate: editUser?.StartDate,
    EndDate: editUser?.EndDate,
    StripeKey: editUser?.StripeKey,
    SecretKey: editUser?.SecretKey,
    CatImg: editUser?.CatImg,
    CatName: editUser?.CatName,
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
    console.log(values);
    let managerid;
    let userid;
    
    try {
      const _id=firebase.firestore().collection('Random').doc().id;
      const catid=firebase.firestore().collection('Random').doc().id;
      const id2=firebase.firestore().collection('Random').doc().id;
      const url =await singleImageUpload(`images/Organizations/${_id}`,barImages.file)
      const url2 =await singleImageUpload(`images/Category/${id2}`,barImagess.file)
      // create user
      const prom1=await firebase.auth().createUserWithEmailAndPassword(values?.ManagerEmail, values?.ManagerPassword).then(async (res) => {
        if(res.user){
          managerid=res?.user?.uid;
          let data={
           
            id:res?.user?.uid,
            ManagerName: values?.ManagerName,
            ManagerUsername: values?.ManagerUsername,
            ManagerEmail: values?.ManagerEmail,
            ManagerPhone: values?.ManagerPhone,
            ManagerAge: values?.ManagerAge,
            ManagerPassword: values?.ManagerPassword,
            ManagerGender: values?.ManagerGender,
            isBlocked:false,
                 OrgId:_id,
            role:"manager"
          }
        
         
   
      
         return await ref
            .doc(res?.user?.uid)
            .set(data, { merge: true })
            
        }})
        let prom2;
        if(values?.UserEmail&&values?.UserPassword){
         prom2= await firebase.auth().createUserWithEmailAndPassword(values?.UserEmail, values?.UserPassword).then(async (res) => {
            if(res.user){
              userid=res?.user?.uid;
              let data={
            
                id:res?.user?.uid,
                UserUsername: values?.UserUsername,
                UserName: values?.UserName,
                UserEmail: values?.UserEmail,
                UserPhone: values?.UserPhone,
                UserOfficeNumber: values?.UserOfficeNumber,
                UserPassword: values?.UserPassword,
                UserWallet: values?.UserWallet,
                OrgId:_id,
                role:"user"
              }
            
             
       
          
             return await ref3
                .doc(res?.user?.uid)
                .set(data, { merge: true })
                
            }})
        }
       let prom3= await ref4.doc(catid).set({
            CatImg:url2,
            CatName:values.CatName,
            id:catid
          },{merge:true})
      
      let data = {
       
        id: _id,
        OrgLogo:url,
        OrgColor:values?.OrgColor,
        OrgName:values?.OrgName,
        OrgAddress:values?.OrgAddress,
        OrgEmail:values?.OrgEmail,
        Categories:firebase.firestore.FieldValue.arrayUnion(catid),
        managers:firebase.firestore.FieldValue.arrayUnion(managerid),
        users:firebase.firestore.FieldValue.arrayUnion(userid),
        startDate: startDate,
        OrgPhone:values?.OrgPhone,
        EndDate: startDate2,
        SecretKey:values?.SecretKey,
        StripeKey:values?.StripeKey
      
      };
      //   delete data.password;

      let prom4= await ref2
        .doc(_id)
        .set(data, { merge: true })
        .then(() => {
          notify("Organization added");
          getUsers();
        });

        Promise.allSettled([prom1,prom2,prom3,prom4]).then(Args=>{
          console.log('resolved promises',Args);
          restoreInitialState();
        }).catch(err=>{
          console.log('rejected promises',err)
        })
    } catch (error) {
     
        notify(error.message, { variant: "error" });
        alert(error.message)
        console.log(error.message)
      
    } finally {
      setSubmitting(false);
     
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
      const url = await singleImageUpload(
        `images/Organizations/${editUser.id}`,
        values.OrgLogo
      );
 let data={

      OrgLogo:url,
      OrgColor:values?.OrgColor,
      OrgName:values?.OrgName,
      OrgAddress:values?.OrgAddress,
      OrgEmail:values?.OrgEmail,
      OrgPhone:values?.OrgPhone,
      startDate: startDate,
      EndDate: startDate2,
      SecretKey:values?.SecretKey,
      StripeKey:values?.StripeKey
 }
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
          setBarImages({ logo: reader.result, file: file });
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
  const handleChanges = (event) => {
    const file = event.target.files[0];
    const name = event.target.name;
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      function () {
        // convert image file to base64 string
        if (file.type === "image/png" || file.type === "image/jpeg") {
          setBarImagess({ logo: reader.result, file: file });
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
  const step=[
    "Organization Detail",
    "Payment & Subscription",
  ]
  const steps = [
    
    "Organization Detail",
    "Manager",
    "User (optional)",
    "Payment & Subscription",
    "Category",
  ];
 
  return (
    <Dialog maxWidth="md" fullWidth open={open} >
      <DialogTitle>
        {edit ? `Edit ${editUser.name}` : "Add new Organization"}
      </DialogTitle>
      

      <DialogContent>
        <Formik
          initialValues={edit ? editInitialState : initialState}
          onSubmit={(values, { setSubmitting }) => {
            console.log(values)
            if (edit) {
              handleEditSubmit(values, setSubmitting);

              setTimeout(() => {
                setSubmitting(false);
              }, 3000);
            } else {
              handleSubmit(values, setSubmitting);

              setTimeout(() => {
                setSubmitting(false);
              }, 3000);
            }
          }}
          validationSchema={AddSchema}
        >
          {({ isSubmitting, submitForm, values, setFieldValue, errors }) => (
            <Form>
              {editUser?
              <Box sx={{ width: "100%" }}>
              <Stepper activeStep={activeStep}>
                {step.map((label, index) => {
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
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              {activeStep === steps.length && (
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1 }}>
                    All steps completed - you&apos;re finished
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button onClick={handleReset}>Reset</Button>
                  </Box>
                </React.Fragment>
              )}
              {activeStep == 0 && (
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
                          name="OrgLogo"
                          type="file"
                          ref={hiddenFileInput}
                          onChange={(e) => {
                            handleChange(e);
                            setFieldValue("OrgLogo", e.target.files[0]);
                          }}
                          style={{ display: "none" }}
                        />
                        <Avatar
                          style={{
                            height: "300px",
                            width: "300px",
                            cursor: "pointer",
                          }}
                          src={
                            barImages.logo ? barImages.logo : editUser?.logo
                          }
                          alt="log"
                          className="user-image"
                        />
                        <div class="img__description_layer">
                          <p class="img__description">Add logo</p>
                        </div>
                      </div>
                      <ErrorMessage
                        name="OrgLogo"
                        render={(msg) => (
                          <div className="input-error">{msg}</div>
                        )}
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
                        name="OrgColor"
                        color={blockPickerColor}
                        onChange={(color) => {
                          setBlockPickerColor(color.hex);
                          setFieldValue("OrgColor", color.hex);
                        }}
                      />
                      <div class="img__description_layer">
                        <p class="img__description">Color</p>
                      </div>
                      <ErrorMessage
                        name="color"
                        render={(msg) => (
                          <div className="input-error">{msg}</div>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        component={TextField}
                        label="Name"
                        name="OrgName"
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
                            name="OrgAddress"
                            fullWidth
                          />
                        </Autocomplete>
                      </LoadScript>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        component={TextField}
                        label="Email"
                        name="OrgEmail"
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
                        name="OrgPhone"
                        type="number"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        component={TextField}
                        label="City"
                        name="OrgCity"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        component={TextField}
                        label="Country"
                        name="OrgCountry"
                        fullWidth
                      />
                    </Grid>
                    
                  </Grid>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    {/* {isStepOptional(activeStep) && (
            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
              Skip
            </Button>
          )} */}
           <Button
                      disabled={isSubmitting}
                      disableElevation
                     
                      onClick={handleClose}
                    >
                     Close
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button onClick={handleNext}>
                      {activeStep === step.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </Box>
                </React.Fragment>
              )}
             
              {activeStep == 1 && (
                <React.Fragment>
                  <Grid container sx={{ mt: 2 }} spacing={2}>
                 

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
                      <Field
                        component={TextField}
                        label="Stripe Key"
                        name="StripeKey"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        component={TextField}
                        label="Secret Key"
                        name="SecretKey"
                        fullWidth
                      />
                    </Grid>
                    

                    
                  </Grid>
                  <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                   
           <Button
                      disabled={isSubmitting}
                      disableElevation
                  
                      onClick={handleClose}
                    >
                     Close
                    </Button>
                    <Box sx={{ flex: "1 1 auto" }} />
                    <Button onClick={handleEditSubmit}  variant="contained">
                      {activeStep === step.length - 1 ? "Update" : "Next"}
                    </Button>
                  </Box>
                </React.Fragment>
              )}
             
            </Box>
              
              
              
              :
           
              <Box sx={{ width: "100%" }}>
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
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                {activeStep === steps.length && (
                  <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                      All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Box sx={{ flex: "1 1 auto" }} />
                      <Button onClick={handleReset}>Reset</Button>
                    </Box>
                  </React.Fragment>
                )}
                {activeStep == 0 && (
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
                            name="OrgLogo"
                            type="file"
                            ref={hiddenFileInput}
                            onChange={(e) => {
                              handleChange(e);
                              setFieldValue("OrgLogo", e.target.files[0]);
                            }}
                            style={{ display: "none" }}
                          />
                          <Avatar
                            style={{
                              height: "300px",
                              width: "300px",
                              cursor: "pointer",
                            }}
                            src={
                              barImages.logo ? barImages.logo : editUser?.logo
                            }
                            alt="log"
                            className="user-image"
                          />
                          <div class="img__description_layer">
                            <p class="img__description">Add logo</p>
                          </div>
                        </div>
                        <ErrorMessage
                          name="OrgLogo"
                          render={(msg) => (
                            <div className="input-error">{msg}</div>
                          )}
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
                          name="OrgColor"
                          color={blockPickerColor}
                          onChange={(color) => {
                            setBlockPickerColor(color.hex);
                            setFieldValue("OrgColor", color.hex);
                          }}
                        />
                        <div class="img__description_layer">
                          <p class="img__description">Color</p>
                        </div>
                        <ErrorMessage
                          name="color"
                          render={(msg) => (
                            <div className="input-error">{msg}</div>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          component={TextField}
                          label="Name"
                          name="OrgName"
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
                              name="OrgAddress"
                              fullWidth
                            />
                          </Autocomplete>
                        </LoadScript>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          component={TextField}
                          label="Email"
                          name="OrgEmail"
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
                          name="OrgPhone"
                          type="number"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          component={TextField}
                          label="City"
                          name="OrgCity"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          component={TextField}
                          label="Country"
                          name="OrgCountry"
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
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />
                      {/* {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )} */}
             <Button
                        disabled={isSubmitting}
                        disableElevation
                       
                        onClick={handleClose}
                      >
                       Close
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />
                      <Button onClick={handleNext}>
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    </Box>
                  </React.Fragment>
                )}
                {activeStep == 1 && (
                  <React.Fragment>
                    <Grid container sx={{ mt: 2 }} spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Field
                          component={TextField}
                          label="Name"
                          name="ManagerName"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          component={TextField}
                          label="Username"
                          name="ManagerUsername"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          component={TextField}
                          label="Email"
                          name="ManagerEmail"
                          fullWidth
                        />
                      </Grid>
                      {!edit && (
                        <Grid item xs={12} md={6}>
                          <Field
                            component={TextField}
                            label="Password"
                            name="ManagerPassword"
                            fullWidth
                          />
                        </Grid>
                      )}
                      <Grid item xs={12} md={6}>
                        <Field
                          component={TextField}
                          label="Age"
                          name="ManagerAge"
                          type="text"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          component={TextField}
                          label="Phone"
                          name="ManagerPhone"
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
                            onChange={(e) =>
                              setFieldValue("ManagerGender", e.target.value)
                            }
                          >
                            <FormControlLabel
                              value="Male"
                              control={<Radio />}
                              label="Male"
                              checked={values.ManagerGender === "Male"}
                            />
                            <FormControlLabel
                              value="Female"
                              control={<Radio />}
                              label="Female"
                              checked={values.ManagerGender === "Female"}
                            />
                            <FormControlLabel
                              value="Other"
                              control={<Radio />}
                              label="Other"
                              checked={values.ManagerGender === "Other"}
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid>

                     
                    </Grid>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />
                      {/* {isStepOptional(activeStep) && (
     <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
       Skip
     </Button>
   )} */}
    <Button
                        disabled={isSubmitting}
                        disableElevation
                   
                        onClick={handleClose}
                      >
                       Close
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />
                      <Button onClick={handleNext}>
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    </Box>
                  </React.Fragment>
                )}
                {activeStep == 2 && (
                  <React.Fragment>
                    <Grid container sx={{ mt: 2 }} spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Field
                          component={TextField}
                          label="Name"
                          name="UserName"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          component={TextField}
                          label="Username"
                          name="UserUsername"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          component={TextField}
                          label="Email"
                          name="UserEmail"
                          fullWidth
                        />
                      </Grid>
                      {!edit && (
                        <Grid item xs={12} md={6}>
                          <Field
                            component={TextField}
                            label="Password"
                            name="UserPassword"
                            fullWidth
                          />
                        </Grid>
                      )}
                      <Grid item xs={12} md={6}>
                        <Field
                          component={TextField}
                          label="Office Number"
                          name="UserOfficeNumber"
                          type="text"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          component={TextField}
                          label="Phone"
                          name="UserPhone"
                          fullWidth
                        />
                      </Grid>
                    
                        <Grid item xs={12} md={6}>
                          <Field
                            component={TextField}
                            label="Wallet"
                            name="UserWallet"
                            fullWidth
                          />
                        </Grid>
                      

                    </Grid>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />
                    
    <Button
                        disabled={isSubmitting}
                        disableElevation
                    
                        onClick={handleClose}
                      >
                       Close
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />
                      <Button onClick={handleNext}>
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    </Box>
                  </React.Fragment>
                )}
                {activeStep == 3 && (
                  <React.Fragment>
                    <Grid container sx={{ mt: 2 }} spacing={2}>
                   

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
                        <Field
                          component={TextField}
                          label="Stripe Key"
                          name="StripeKey"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          component={TextField}
                          label="Secret Key"
                          name="SecretKey"
                          fullWidth
                        />
                      </Grid>
                      

                      
                    </Grid>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />
                     
             <Button
                        disabled={isSubmitting}
                        disableElevation
                    
                        onClick={handleClose}
                      >
                       Close
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />
                      <Button onClick={handleNext}>
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    </Box>
                  </React.Fragment>
                )}
                {activeStep == 4 && (
                  <React.Fragment>
                    <Grid container sx={{ mt: 2 }} spacing={2}>
                      <Grid
                        style={{ flexDirection: "row" }}
                        item
                        xs={3}
                        className="profile-image"
                      >
                        <div className="img__wrap" onClick={handleClick}>
                          <input
                            accept="image/*"
                            id="contained-button-file"
                            name="CatImg"
                            type="file"
                            ref={hiddenFileInput}
                            onChange={(e) => {
                              handleChanges(e);
                              setFieldValue("CatImg", e.target.files[0]);
                            }}
                            style={{ display: "none" }}
                          />
                          <Avatar
                            style={{
                              height: "100px",
                              width: "100px",
                              cursor: "pointer",
                            }}
                            src={
                              barImagess.logo ? barImagess.logo : editUser?.logo
                            }
                            alt="log"
                            className="user-image"
                          />
                          <div class="img__description_layer">
                            <p class="img__description">Category logo</p>
                          </div>
                        </div>
                        <ErrorMessage
                          name="CatImg"
                          render={(msg) => (
                            <div className="input-error">{msg}</div>
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          component={TextField}
                          label="Category Name"
                          name="CatName"
                          fullWidth
                        />
                        <Typography>
                          You can add more categories and products once
                          organization is created
                        </Typography>
                      </Grid>

                    </Grid>

                    <Grid item xs={12}>
                        {isSubmitting && <LinearProgress />}
                      </Grid>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                      <Button
                        color="inherit"
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                      >
                        Back
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />
                      {/* {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )} */}
                     <Button
                        disabled={isSubmitting}
                        disableElevation
                      
                        onClick={handleClose}
                      >
                       Close
                      </Button>
                      <Box sx={{ flex: "1 1 auto" }} />
                      <Button
                        disabled={isSubmitting}
                        disableElevation
                        variant="contained"
                        onClick={submitForm}
                      >
                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                      </Button>
                    </Box>
                  </React.Fragment>
                )}
              </Box>}
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewBusinessUser;
