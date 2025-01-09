/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { toast } from "react-toastify";
import { checkBusinessExists } from "../../../Functions/functions";
import { updateBusinessDetails } from "../store/businessSlice";
import { Spinner } from "react-bootstrap";

function AuthenticationDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const businessState = useSelector((state) => state.business);

  const [authData, setAuthData] = useState({
    email: businessState?.email || "",
    password: businessState?.password || "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { email, password } = authData;

  function handleInputChange(e) {
    const { name, value } = e.target;
    setAuthData((prevAuthData) => ({
      ...prevAuthData,
      [name]: value,
    }));

    // Clear errors if the input becomes valid
    if (name === "email" && value) {
      if (validateEmail(value)) {
        setEmailError("");
      }
    }

    if (name === "password" && value) {
      if (validatePassword(value)) {
        setPasswordError("");
      }
    }
  }

  const handleAuthSubmit = async (e) => {
    e.preventDefault()
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      setLoading(true)
      try {
        const business = await checkBusinessExists({ email, password });
        console.log(business, "business---");

        if (business?.data) {
          dispatch(updateBusinessDetails({ email, password }));
          navigate("/create-business/details");
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
        console.log(error, "error-----------");

        toast.error(
          error?.response?.data?.message ??
          "An error occurred. Please try again.",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            style: {
              backgroundColor: "#e74c3c",
              color: "#FFFFFF",
            },
          }
        );
      }
      setLoading(false)
    }
  };

  // Updated Email validation function
  function validateEmail(value) {
    if (!value) {
      setEmailError("Email is required.");
      return false;
    }
    setEmailError("");
    return true;
  }

  // Updated Password validation function
  function validatePassword(value = password) {
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return false;
    }
    setPasswordError("");
    return true;
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleBack = () => {
    navigate("/");
  };

  useEffect(() => {
    setAuthData({
      email: businessState?.email,
      password: businessState?.password,
    });
  }, [businessState]);

  return (
    <div className="h-100vh create-business-div">
      <div className="row h-100 justify-content-center">
        <div className="d-none d-md-block left-portion col-md-5 h-100 p-0">
          <img
            src="/images/login.jpg"
            alt="Login"
            className="w-100 h-100 object-fit-cover"
          />
        </div>

        <div className="col-12 col-md-7 d-flex flex-column align-items-center right-portion h-100 p-4">
          <div className="back-button-container">
            <button className="btn btn-dark" onClick={handleBack}>
              <i className="bi bi-arrow-left"></i>
            </button>
          </div>

          <div className="col-12 text-start mb-4">
            <h1 className="fw-bold title-text">
              <span className="title-main">Add</span> <br />
              <span className="title-highlight">Authentication Details</span>
            </h1>
          </div>
          <Box className="mb-3 w-sm-100 w-100 " validated={false} noValidate={false}>
            <TextField
              fullWidth
              required
              label="Email"
              name="email"
              value={authData.email}
              onChange={handleInputChange}
              error={emailError}
              helperText={emailError}
              variant="filled"
              className="my-2"
            />

            <TextField
              required
              fullWidth
              label="Password"
              className="my-2"
              type={showPassword ? "text" : "password"}
              variant="filled"
              name="password"
              value={authData.password}
              onChange={handleInputChange}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <div className="col-12 text-center mt-4">
              {loading ?
                <Spinner variant="primary" /> :
                <Button className="w-100 submit-button" onClick={handleAuthSubmit} variant="contained" type="submit">save & next</Button>}
            </div>
          </Box>
        </div>
      </div>

      <style jsx>{`
        .h-100vh {
          height: 100vh;
        }
        .left-portion {
          background-color: #f5f5f5;
        }
        .right-portion {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 2rem;
          position: relative;
        }
        .back-button-container {
          position: absolute;
          top: 1rem;
          left: 1rem;
          margin-top: 0.5rem;
          margin-left: 0.5rem;
        }
        .title-text {
          text-align: left;
        }
        .title-main {
          color: black;
        }
        .title-highlight {
          color: #105193;
        }
        .btn-primary {
          background-color: #105193;
          border-color: #105193;
        }
        .btn-primary:hover {
          background-color: #107d93;
          border-color: #107d93;
        }
        @media (max-width: 768px) {
          .right-portion {
            padding: 1rem;
          }
          .back-button-container {
            margin-top: 0.75rem;
            margin-left: 0.75rem;
          }
        }
        @media (max-width: 576px) {
          .right-portion {
            padding: 0.5rem;
          }
          .back-button-container {
            margin-top: 1rem;
            margin-left: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default AuthenticationDetails;
