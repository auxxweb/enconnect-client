import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { updateBusinessDetails } from "../store/businessSlice";
import { Button, TextField } from "@mui/material";
import { Spinner } from "react-bootstrap";

const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const BusinessTiming = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const businessState = useSelector((state) => state.business);

  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false)
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [error, setError] = useState("");

  const toggleDay = (day) => {
    if (days.includes(day)) {
      setDays(days.filter((d) => d !== day));
    } else {
      setDays([...days, day]);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setDays(allDays);
    } else {
      setDays([]);
    }
  };

  const handleOpenTimeChange = (e) => {
    setOpenTime(e.target.value);
  };

  const handleCloseTimeChange = (e) => {
    setCloseTime(e.target.value);
  };

  const handleSubmit = () => {
    setLoading(true)
    if (days?.length === 0) {
      setError("Please select atleast one day");
    } else {
      dispatch(
        updateBusinessDetails({
          businessTiming: {
            workingDays: days,
            time: {
              open: openTime,
              close: closeTime,
            },
          },
        })
      );

      navigate("/create-business/description");
    }
    setLoading(false)
  };

  const handlePrevStep = () => navigate("/create-business/category");

  useEffect(() => {
    setDays(businessState?.businessTiming?.workingDays);
    setOpenTime(businessState?.businessTiming?.openTime?.open);
    setCloseTime(businessState?.businessTiming?.openTime?.close);
  }, [businessState]);

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
              <div className="col-12 text-center text-md-start mt-5">
                <h1 className="fw-bold title-text">
                  <span className="title-main">Add</span> <br />
                  <span className="title-highlight">Business Timing</span>
                </h1>
                <span style={{ color: "red" }}>{error && error}</span>
              </div>

              {/* Working Days Selection */}
              <div className="col-12 p-4 p-md-5">
                <h4 className="text-center text-md-start">
                  Select Working Days
                </h4>
                <div className="row gap-2 gap-md-3 justify-content-center mt-3">
                  {allDays.map((day) => (
                    <div
                      key={day}
                      className={`day-div ${days.includes(day) ? "active" : ""
                        } p-2 text-center cursor-pointer`}
                      style={{
                        width: "60px",
                        borderRadius: "8px",
                        background: days.includes(day) ? "#105193" : "#d4e0ec",
                      }}
                      onClick={() => toggleDay(day)}
                    >
                      <span>{day}</span>
                    </div>
                  ))}
                </div>

                {/* Select All Checkbox */}
                <div className="mt-5 text-center">
                  <input
                    type="checkbox"
                    id="selectAllDays"
                    className="form-check-input"
                    onChange={handleSelectAll}
                    checked={days.length === allDays.length}
                  />
                  <label
                    className="form-check-label ms-2 text-theme2 fs-14"
                    htmlFor="selectAllDays"
                  >
                    Select All Days
                  </label>
                </div>

                {/* Time Input Fields */}
                <div className="row mt-5 g-3 justify-content-center">
                  <div className="col-12 col-md-5">
                    <label htmlFor="openingTime" className="form-label">
                      Opening Time
                    </label>
                    <TextField
                      type="time"
                      variant="filled"
                      className="form-control form-control-lg"
                      value={openTime}
                      onChange={handleOpenTimeChange}
                    />
                  </div>
                  <div className="col-12 col-md-5">
                    <label htmlFor="closingTime" className="form-label">
                      Closing Time
                    </label>
                    <TextField
                      type="time"
                      variant="filled"
                      className="form-control form-control-lg"
                      value={closeTime}
                      onChange={handleCloseTimeChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save & Next Button */}
            <div className="col-12 ">
              {loading ? <Spinner variant="primary" /> : <Button variant="contained" className="w-100 submit-button" type="submit"
                onClick={handleSubmit}
              >
                Save & Next
              </Button>}
            </div>
          </div>

          <div className="left-portion col-12 col-lg-7 h-100 p-3 row align-items-center">
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
                        <p>business Description</p>
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
                            >
                              {days.map((day) => (
                                <p key={day}>{day}</p>
                              ))}
                            </div>
                            <div
                              className="mt-3 text-center text-lg-start"
                              style={{ color: "#A4B3CB" }}
                            >
                              <span>
                                {openTime} to {closeTime}
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

export default BusinessTiming;
