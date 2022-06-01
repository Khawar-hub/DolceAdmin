import React, { useState, useEffect } from "react";
import { firebase } from "../../Firebase/config";

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
  Avatar,
  Chip,
  MenuItem
} from "@mui/material";
import { Formik, Form, Field ,ErrorMessage} from "formik";
import { TextField ,Select} from "formik-mui";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { ADD_AUTH_USER } from "../../Shared/baseURL";

const ref = firebase.firestore().collection("Products");
const ref2 = firebase.firestore().collection("Categories");

const AddProducts = ({
  open,
  getUsers,
  handleClose,
  editUser,
  edit,
}) => {
  // state
  const { enqueueSnackbar: notify } = useSnackbar();
  const [preference, setPreference] = useState([]);
  const [barImages, setBarImages] = React.useState({
    logo: editUser?editUser?.logo:"",
  });

  const hiddenFileInput = React.useRef(null);
  // validation schema
  const AddSchema = yup.object().shape({
    name: yup.string().required("Required"),
    logo: yup.mixed().required("Required"),
    price:yup.string().required("Required"),
    description:yup.string().required("Required"),
    category:yup.string().required("Required"),
  });

  // initial states
  const initialState = {
    name: "",
   logo:"",
   price:"",
   description:"",
   category:"",
  
  };

  const editInitialState = {
    name: editUser?.name,
   logo:editUser?.logo,
   price:editUser?.price,
   description:editUser?.description,
   category:"",
    
  };
  useEffect(() => {
    getManagers();
  }, []);
  const [managers, setManagers] = useState([]);
  const getManagers = async () => {
    try {
      const allDocs = await ref2.get();
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

  // useEffect(() => {
  //   if (edit && editUser) {
  //     if (Array.isArray(editUser.Preferences)) {
  //       let arr = [...editUser.Preferences];
  //       setPreference(arr);
  //     }
  //   }
  // }, [edit, editUser]);

  const handleSubmit = async (values, setSubmitting) => {
    try {
      const dataManager= await ref2.doc(values.category).get()

      const _id=firebase.firestore().collection('Random').doc().id;
            let data={
              ...values,
              id:_id,
              logo: barImages.logo,
              catname:dataManager?.data().name
             
            }
          
           
     
        
            await ref
              .doc(_id)
              .set(data, { merge: true })
              .then(() => {
                notify("Product added");
                setSubmitting(false);
               
              });
              let temp=[]
              temp.push(_id)
              await ref2
              .doc(values.category)
              .set({products:temp}, { merge: true })
              .then(() => {
                
                setSubmitting(false);
               
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
        let temp=[]
              temp.push(values?.category)
              await ref2
              .doc(editUser.id)
              .set({products:temp}, { merge: true })
              .then(() => {
                
                setSubmitting(false);
               
              });
    } catch (error) {
      console.log(error.message);
    } finally {
      setSubmitting(false);
      restoreInitialState();
    }
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
          setBarImages({ logo: reader.result });
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
  const restoreInitialState = () => {
    handleClose();
    // setPreference([]);
  };

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={handleClose}>
      <DialogTitle>
        {edit ? `Edit ${editUser.name}` : "Add Product"}
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
                        height: "100px",
                        width: "100px",
                        cursor: "pointer",
                      }}
                      src={barImages.logo}
                      alt="log"
                      className="user-image"
                    />
                    <div class="img__description_layer">
                      <p class="img__description">Add lmage</p>
                    </div>
                  </div>
                  <ErrorMessage
                    name="logo"
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
                  <Field
                    component={TextField}
                    label="Price"
                    name="price"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    component={TextField}
                    label="Description"
                    name="description"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Field
                      component={Select}
                      type="text"
                      label="Category"
                      name="category"
                    >
                      {managers.map((item) => (
                        <MenuItem value={item.id}  key={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Field>
                  </FormControl>
                </Grid>
                {/* {!edit && (
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
                    label="Office Number"
                    name="OfficeNumber"
                    type="text"
                    fullWidth
                  />
                </Grid> */}
                {/* <Grid item xs={12} md={6}>
                  <Field
                    component={TextField}
                    label="Phone"
                    name="phone"
                    fullWidth
                  />
                </Grid>
               {edit?
                <Grid item xs={12} md={6}>
                  <Field
                    component={TextField}
                    label="Wallet"
                    name="wallet"
                    fullWidth
                  />
                </Grid>:null} */}
                
                {/* <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <Field
                      component={Select}
                      type="text"
                      label="Organization"
                      name="organization"
                    >
                      {managers.map((item) => (
                        <MenuItem value={item.id}  key={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Field>
                  </FormControl>
                </Grid> */}
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
                {/* <Grid item xs={12} md={6}>
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
                </Grid> */}
              
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

export default AddProducts;
