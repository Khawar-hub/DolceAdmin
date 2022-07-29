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
import { Formik, Form, Field} from "formik";
import { TextField ,Select} from "formik-mui";
import * as yup from "yup";
import { useSnackbar } from "notistack";
import { ADD_AUTH_USER } from "../../Shared/baseURL";

const ref = firebase.firestore().collection("Managers");
const ref2 = firebase.firestore().collection("Organizations");

const AddNewBusinessUser = ({
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
    ManagerName: yup.string().required("Required"),
    ManagerPhone: yup.string(),
    ManagerEmail: yup.string().email().required("Required"),
    ManagerUsername: yup.string().required("Required"),
    // ManagerAge: yup.number().min(1).positive().integer().required("Required"),
    // ManagerGender: yup.string().required("Required"),
    ManagerPassword: edit
      ? yup.string()
      : yup
          .string()
          .required("Required")
          .min(6, "Password must be greater than 6 characters"),
  });
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

  // initial states
  const initialState = {
    ManagerName: "",
    ManagerEmail: "",
    ManagerUsername: "",
    // ManagerAge: "",
    // ManagerGender: "Male",
    ManagerPhone: "",
    ManagerPassword: "",
  
  };

  const editInitialState = {
    ManagerName: editUser?.ManagerName,
    ManagerEmail: editUser?.ManagerEmail,
    ManagerUsername: editUser?.ManagerUsername,
    // ManagerAge: editUser?.ManagerAge,
    // ManagerGender: editUser?.ManagerGender,
    ManagerPassword: editUser?.ManagerPassword ?? "",
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
        // const dataManager= await ref2.doc(values.organization).get()
     
      await firebase.auth().createUserWithEmailAndPassword(values?.ManagerEmail, values?.ManagerPassword).then(async (res) => {
        if(res.user){
          let data={
            ...values,
            id:res?.user?.uid,
            // orgname:dataManager.data().name,
            isBlocked:false,
            role:"manager"
          }
        
         
   
      
          await ref
            .doc(res?.user?.uid)
            .set(data, { merge: true })
            .then(() => {
              notify("Manager added");
              setSubmitting(false);
             
            });
            await ref2.doc(id).set({
              managers:firebase.firestore.FieldValue.arrayUnion(res?.user?.uid)
             },{merge:true})
        }
       
        
        
    }).catch((error) => {
        notify(error.message,{variant:'error'})

    })
      // const res = await axios.post(ADD_AUTH_USER, {
      //   email: values.email,
      //   password: values.password,
      // });
      // if (res.status === 200) {
      //   console.log(res.data);
      //   const { userID } = res.data;
    
       
      //   delete data.password;
    
       
      
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
        {edit ? `Edit ${editUser.name}` : "Add Manager"}
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
                    disabled={editUser?true:false}
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
                {/* <Grid item xs={12} md={6}>
                  <Field
                    component={TextField}
                    label="Age"
                    name="ManagerAge"
                    type="text"
                    fullWidth
                  /> */}
                
                <Grid item xs={12} md={6}>
                  <Field
                    component={TextField}
                    label="Phone"
                    name="ManagerPhone"
                    fullWidth
                  />
                </Grid>
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
                      onChange={(e) => setFieldValue("ManagerGender", e.target.value)}
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

export default AddNewBusinessUser;
