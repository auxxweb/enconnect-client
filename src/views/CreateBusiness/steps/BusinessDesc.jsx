import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { updateBusinessDetails } from "../store/businessSlice";
import { Button, TextField } from "@mui/material";
import { Spinner } from "react-bootstrap";
import { handleWordExceeded } from "../../../utils/app.utils";

const BusinessDesc = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const businessState = useSelector((state) => state.business);

  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)

  const handleDescSubmit = () => {
    if (error) {
      setLoading(false)
      return
    }

    if (!description) {
      return setError("Description is required");
    }
    setLoading(true)

    dispatch(updateBusinessDetails({ description }));
    navigate("/create-business/landing");

    setLoading(false)
  };

  const handlePrevStep = () => navigate("/create-business/timing");
  const handleChange = (e) => {
    const value = e.target.value;
    if (value) {
      setError("")
    } else {
      setError("Description is required !")
    }
    setDescription(value)
  }

  useEffect(() => {
    if (businessState?.description) {
      setDescription(businessState.description)
    }
  }, [businessState])

  return (
    <>
      <div className="h-100vh create-business-div">
        <div className="row  h-100 justify-content-center">
          {/* Left Image Section */}

          {/* Right Form Section */}
          <div className="col-12 col-md-5 row align-items-end justify-content-center h-100 p-3 p-md-5 right-portion">
            <div className="col-12 text-start">
              <button
                className="btn btn-dark w-auto float-start"
                onClick={handlePrevStep}
              >
                <i className="bi bi-arrow-left"></i>
              </button>
            </div>
            <div className="row  justify-content-center">
              <div className="col-12 text-center text-md-start">
                <h1 className="fw-bold title-text">
                  <span className="title-main">Add</span> <br />
                  <span className="title-highlight">Business Description</span>
                </h1>
              </div>

              {/* Text Editor Section */}
              <div className="col-12   p-3 p-md-5">
                {/* <label>Business Description*</label> */}
                <TextField
                  fullWidth
                  label="Business description (50 words)"
                  id="businessName"
                  variant="filled"
                  name="description_main"
                  autoComplete="businessName"
                  multiline
                  value={description}
                  onChange={handleChange}
                  error={error || handleWordExceeded(description, 50)}
                  helperText={handleWordExceeded(description, 50) ? "exceeded the limit" : ""}
                  rows={5}
                />
              </div>
              <p className="text-danger">{error}</p>
            </div>

            {/* Save & Next Button */}
            <div className="col-12 text-center p-3 ">
              {loading ? <Spinner variant="primary" /> : <Button variant="contained" className="w-100 submit-button" type="submit"
                onClick={handleDescSubmit}
              >
                Save & Next
              </Button>}
            </div>
          </div>

          <div className="d-none d-md-block left-portion p-0 col-md-7 h-100">
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
              rel="stylesheet"
            />
            <style>
              {" "}
              {`
                      ::-webkit-scrollbar {
                          width: 12px; /* Width of the entire scrollbar */
                      }
  
                      /* Scrollbar track */
                      ::-webkit-scrollbar-track {
                          background: rgb(243, 243, 244); /* Background of the scrollbar track */
                      }::-webkit-scrollbar-thumb {
                          background-color: white; /* Color of the scrollbar thumb */
                          border-radius: 10px;     /* Rounded edges of the thumb */
                          border: 3px solid  white; /* Padding around the thumb */
                      }
                  .theme
                  {
                      background-color: white;
                      color: white;
                      border: none;
                  }.service-design.active{
                      background-color: white;
                  }.address-section{
                  background-color:white;
                  }.address-logo i{
                  color: white;
                  }.cat-option{
                      border-right: 1px dashed white;
                  }.text-orange{
                          color: white;
                      }.dish-div:hover{
                          background-color: white;
                          color:white;
                      }
                      `}
            </style>
            <footer className="h-auto">
              <div className="container pjs  p-top">
                <div className="mt-5">
                  <div className="row justify-content-between">
                    <div className="col-12 col-lg-4">
                      <div className="col-12 d-block d-lg-flex text-center text-lg-start text mt-5">
                        <div className="nav-logo width-fit">
                          <img src={businessState?.logo} alt="" />
                        </div>
                        <span className="ms-2 fs-30 text-white">
                          {businessState?.businessName}
                        </span>
                      </div>
                      <div
                        className="col-12 mt-4  text-center text-lg-start"
                        style={{ color: "#A4B3CB" }}
                      >
                        <p>{description}</p>
                      </div>
                    </div>

                    <div className="col-12 col-lg-4">
                      <div className="col-12 mt-5">
                        <div className="col-12 mt-3 mb-3 text-center text-lg-start">
                          <a
                            href="#"
                            className=" fs-14 text-decoration-none text-orange"
                          >
                            NAVIGATION
                          </a>
                        </div>
                        <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                          <a
                            href="#"
                            className="fs-14 text-decoration-none"
                            style={{ color: "#A4B3CB" }}
                          >
                            Menu
                          </a>
                        </div>
                        <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                          <a
                            href="#"
                            className="fs-14 text-decoration-none"
                            style={{ color: "#A4B3CB" }}
                          >
                            About Us
                          </a>
                        </div>
                        <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                          <a
                            href="#"
                            className="fs-14 text-decoration-none"
                            style={{ color: "#A4B3CB" }}
                          >
                            Contact Us
                          </a>
                        </div>
                        <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                          <a
                            href="#"
                            className="fs-14 text-decoration-none"
                            style={{ color: "#A4B3CB" }}
                          >
                            Main Dishes
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="col-12 mt-5">
                        <div className="col-12 mt-3 mb-3 text-center text-lg-start">
                          <a
                            href="#"
                            className=" fs-14 text-decoration-none text-orange"
                          >
                            Follow Us
                          </a>
                        </div>

                        <div className="mt-5 col-12 row gap-3 jcc-md text-center text-lg-start">
                          <a className="contact-banner text-orange text-center text-lg-start">
                            <i className="bi bi-facebook text-orange"></i>
                          </a>
                          <a className="contact-banner text-center text-lg-start">
                            <i className="bi bi-instagram text-orange"></i>
                          </a>
                          <a className="contact-banner text-center text-lg-start">
                            <i className="bi bi-twitter text-orange"></i>
                          </a>
                          {/* <hr style={{width:"fit-content",opacity: 0.15,}}></hr> */}
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="col-12">
                            <div className="col-12 mt-3 mb-3 text-center text-lg-start">
                              <a
                                href="#"
                                className=" fs-14 text-decoration-none text-orange"
                              >
                                OPENING HOURS
                              </a>
                            </div>
                            <div
                              className="mt-3 text-center text-lg-start"
                              style={{ color: "#A4B3CB" }}
                            ></div>
                            <div
                              className="mt-3 text-center text-lg-start"
                              style={{ color: "#A4B3CB" }}
                            >
                              <span>
                                {businessState?.businessTiming?.openTime?.open}{" "}
                                to{" "}
                                {businessState?.businessTiming?.openTime?.close}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="col-12 mt-5 text-center text-lg-start">
                            <div
                              className="mt-3"
                              style={{ color: "#A4B3CB" }}
                            ></div>
                            <div className="mt-3" style={{ color: "#A4B3CB" }}>
                              <span>CLOSED</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="row">
                        <div
                          className="col-12 mt-5 text-center text-lg-start"
                          style={{ color: "#A4B3CB" }}
                        >
                          <span>
                            © 2024 Business Bazaar. All Right Reserved
                          </span>
                        </div>

                        <div
                          className="col-12  text-center text-lg-start mb-5 mt-5"
                          style={{ color: "#A4B3CB" }}
                        >
                          <div className="row">
                            <div className="col-12 col-lg-6">
                              Terms of Service
                            </div>
                            <div className="col-12 col-lg-6">
                              Privacy Policy
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessDesc;
