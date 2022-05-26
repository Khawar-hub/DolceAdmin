import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../Redux/Actions";
import { Paper, Button, Box, LinearProgress, Grid } from "@mui/material";
import * as Yup from "yup";
import { Form, Field, Formik } from "formik";
import { TextField } from "formik-mui";
import LoginIcon from "@mui/icons-material/Login";
import "./login.scss";
import { useSnackbar } from "notistack";
import { projectName } from "../../theme/themeConfig";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid Email").required("Required"),
  password: Yup.string().required("Required"),
});

const Login = () => {
  //state
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const { enqueueSnackbar: notification } = useSnackbar();

  useEffect(() => {
    checkUser(); // if user exists, user cannot access login page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkUser = () => {
    if (user) {
      navigate("/admin/statistics");
    }
  };

  const handleLogin = async (values, setSubmitting) => {
    console.log(values);
    setTimeout(() => {
      dispatch(userLogin(values));
      navigate("/admin/statistics");
      notification("Logged in.");
      setSubmitting(false);
    }, 1500);
  };

  return (
    <div>
      <Grid container className="authPage">
        <Grid
          item
          xs={12}
          style={{ height: "100vh" }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Box
            sx={{
              width: {
                xs: "600px",
              },
              marginX: {
                xs: 2,
                md: 0,
              },
            }}
          >
            <Paper className="p-3" elevation={3}>
              <h3 className="text-center authHeading">{projectName}</h3>
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                }}
                onSubmit={(values, { setSubmitting }) => {
                  handleLogin(values, setSubmitting);
                }}
                validationSchema={LoginSchema}
              >
                {({ submitForm, isSubmitting }) => (
                  <Form>
                    <Box margin={1}>
                      <Field
                        margin="dense"
                        component={TextField}
                        name="email"
                        type="email"
                        label="Email"
                        required
                        fullWidth
                      />
                    </Box>
                    <Box margin={1}>
                      <Field
                        margin="dense"
                        component={TextField}
                        name="password"
                        type="password"
                        label="Password"
                        required
                        fullWidth
                      />
                    </Box>
                    <Box margin={1}>
                      <Button
                        onClick={submitForm}
                        fullWidth
                        variant="contained"
                        startIcon={<LoginIcon />}
                        disabled={isSubmitting}
                      >
                        Login
                      </Button>
                      {isSubmitting && <LinearProgress className="mt-3" />}
                    </Box>
                  </Form>
                )}
              </Formik>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
