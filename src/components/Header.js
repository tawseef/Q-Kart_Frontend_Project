import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import { useSnackbar } from "notistack";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const [loggedUser, setLoggedUser] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const history = useHistory();

  const logoutBtn = (
    <div><Stack direction="row" spacing={2}>
    <Avatar alt={loggedUser} src="avatar.png" /><div className="userName">{loggedUser}</div><Button
      className="explore-button"
      variant="text"
      onClick={() => {
        localStorage.clear();
        enqueueSnackbar("Logged out successfully" , {variant:"info"});        
        setLoggedUser("")
        // window.location.reload()
        history.push("/");
      }}
    >
      Logout
    </Button></Stack></div>
  );

  const registerBtn = (
    <Button
      className="regBtn"
      variant="contained"
      onClick={() => {
        history.push("/register");
      }}
    >
      Register
    </Button>
  );

  const loginBtn = (
    <Button
      className="loginBtn"
      variant="text"
      onClick={() => {
        history.push("/login");
      }}
    >
      Login
    </Button>
  );

  const backToExploreBtn = (
    <Button
      className="explore-button"
      startIcon={<ArrowBackIcon />}
      variant="text"
      onClick={() => {
        history.push("/");
      }}
    >
      Back to explore
    </Button>
  );

  let btn;

  useEffect(() => {
    const items = localStorage.getItem('username');
    if (items) {
      setLoggedUser(items);
    }
  }, [hasHiddenAuthButtons]); 


  if (Boolean(localStorage.getItem("username"))) {
    btn = logoutBtn;
  }else if (hasHiddenAuthButtons === undefined) {
    btn = <div>{loginBtn}{registerBtn} </div>
  } else if (hasHiddenAuthButtons) {
    btn = backToExploreBtn;
  }


  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
      { btn }
    </Box>
  );
};

export default Header;
