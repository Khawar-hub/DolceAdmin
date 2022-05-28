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
  Chip,
  Avatar
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-mui";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { ADD_AUTH_USER } from "../../Shared/baseURL";
import "./styles.scss";
const ref = firebase.firestore().collection("Managers");

const AddNewBusinessUser = ({
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
    logo: "",
   
  });
  const hiddenFileInput = React.useRef(null);
  // validation schema
  const AddSchema = yup.object().shape({
    name: yup.string().required("Required"),
    phone: yup.string(),
    email: yup.string().email().required("Required"),
    username: yup.string().required("Required"),
    Age: yup.number().min(1).positive().integer().required("Required"),
    Gender: yup.string().required("Required"),
    password: edit
      ? yup.string()
      : yup
          .string()
          .required("Required")
          .min(6, "Password must be greater than 6 characters"),
  });

  // initial states
  const initialState = {
    name: "",
    email: "",
    username: "",
    Age: "",
    Gender: "Male",
    phone: "",
    password: "",
  
  };

  const editInitialState = {
    name: editUser?.name,
    email: editUser?.email,
    username: editUser?.username,
    Age: editUser?.Age,
    Gender: editUser?.Gender,
    phone: editUser?.phone ?? "",
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
          
        };
      //   delete data.password;
    
        await ref
          .doc(_id)
          .set(data, { merge: true })
          .then(() => {
            notify("Manager added");
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
              <Grid item xs={12} className="profile-image">
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
                      src={barImages.logo}
                      alt="log"
                      className="user-image"
                    />
                    <div class="img__description_layer">
                      <p class="img__description">Add logo</p>
                    </div>
                  </div>
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
