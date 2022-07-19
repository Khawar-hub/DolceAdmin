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
  MenuItem
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import { TextField ,Select} from "formik-mui";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { ADD_AUTH_USER } from "../../Shared/baseURL";

const ref = firebase.firestore().collection("Users");
const ref2 = firebase.firestore().collection("Organizations");

const AddUser = ({
  open,
  getUsers,
  handleClose,
  editUser,
  edit,
  id
}) => {
  // state
  const { enqueueSnackbar: notify } = useSnackbar();
  const [preference, setPreference] = useState([]);

  // validation schema
  const AddSchema = yup.object().shape({
    UserName: yup.string().required("Required"),
    UserPhone: yup.string(),
    UserEmail: yup.string().email().required("Required"),
    UserUsername: yup.string().required("Required"),
    UserOfficeNumber: yup.number().min(1).positive().integer().required("Required"),
    UserPassword: edit
      ? yup.string()
      : yup
          .string()
          .required("Required")
          .min(6, "Password must be greater than 6 characters"),
  });

  // initial states
  const initialState = {
    UserName: "",
    UserEmail: "",
    UserUsername: "",
     UserOfficeNumber:0,
    UserPhone: "",
   
    UserPassword: "",
    UserWallet:0
  
  };

  const editInitialState = {
    UserName: editUser?.UserName,
    UserEmail: editUser?.UserEmail,
    UserUsername: editUser?.UserUsername,
    UserOfficeNumber: editUser?.UserOfficeNumber,
    UserPhone: editUser?.UserPhone,
   
    UserPassword:editUser?.UserPassword,
    UserWallet:0
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
      
      await firebase.auth().createUserWithEmailAndPassword(values?.UserEmail, values?.UserPassword).then(async (res) => {
        if(res.user){
          let data={
            ...values,
            id:res?.user?.uid,
            // orgname:dataManager.data().name,
            OrgId:id,
            isBlocked:false,
            role:"user"
          }
        
         
   
      
          await ref
            .doc(res?.user?.uid)
            .set(data, { merge: true })
            .then(() => {
              notify("User added");
              getUsers()
              setSubmitting(false);
             
            });
            await ref2.doc(id).set({
              users:firebase.firestore.FieldValue.arrayUnion(res?.user?.uid)
             },{merge:true})
          }
          
          
      }).catch((error) => {
          notify(error.message,{variant:'error'})
  
      })
      
      
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

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={handleClose}>
      <DialogTitle>
        {edit ? `Edit ${editUser.name}` : "Add User"}
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
                    disabled={editUser?true:false}
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

export default AddUser;
