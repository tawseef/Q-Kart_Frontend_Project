import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  


  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} userDetail
   *  Object with values of username, password and confirm password user entered to register
   * 
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const  [userDetail, setUserDetail] = useState({username : "", password : "", confirmPassword : "" });

  const [formStatus, setFormStatus] = useState("unsubmitted");

  const register = (userDetail) => {
    const validation = validateInput(userDetail);
    if(validation){
      setFormStatus("submitted");
      (async ()=>{
        try{
          console.log(`${config.endpoint}/auth/register`);    
          const posting = await axios.post(`${config.endpoint}/auth/register`, {username:userDetail.username, password:userDetail.password});
          console.log("posting.status");
          console.log(posting.status);
          if(posting.status===201){
            enqueueSnackbar("Registered Successfully");
          }
          setFormStatus("unsubmitted");
        }catch(e){
          setFormStatus("submitted");
          console.log("Error")
          if(e.response.status === 400)
          enqueueSnackbar(e.response.data.message);
          else
          enqueueSnackbar("Something went wrong. Check that the backend is running, reachable and returns valid JSON");
          
          setFormStatus("unsubmitted");
          return null;
        }
      })(userDetail);
    }
  };
  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    if(data.username === ""){
      enqueueSnackbar("Username is a required field");
    }else if(parseInt(data.username.length)<=5){
      enqueueSnackbar("Username must be at least 6 characters");
    }else if(data.password === ""){
      enqueueSnackbar("Password is a required field");
    }else if(parseInt(data.password.length)<=5){
      enqueueSnackbar("Password must be at least 6 characters");
    }else if(data.password !== data.confirmPassword){
      enqueueSnackbar("Passwords do not match")
    }else{
      return true;
    }

    // const { name, value } = data.target;
    // setUserDetail((prevProps) => ({
    //   ...prevProps,
    //   [name]: value
    // }));
  };

  const handelInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetail((prevProps) => ({
      ...prevProps,
      [name]: value
    }));    
  }

  // const handelInputChange = (e) =>{
  //   const {name, value} = e.target;

  //   setUserDetail((prevProp)=>{...prevProp, [name]:value});
  // }

  const theRegisterButton= (<Button className="button" variant="contained" onClick={()=>{register(userDetail)}}>
  Register Now
 </Button>);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            onChange={handelInputChange}
            placeholder="Enter Username"
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            onChange={handelInputChange}
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            onChange={handelInputChange}
            type="password"
            fullWidth
          />
           {/* <Button className="button" variant="contained" onClick={()=>{register(userDetail);}}>
            Register Now
           </Button> */}
           {formStatus === "unsubmitted" ? theRegisterButton : <div className="spinner"><CircularProgress color="success"/></div>}
          <p className="secondary-action">
            Already have an account?{" "}
             <a className="link" href="#">
              Login here
             </a>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
