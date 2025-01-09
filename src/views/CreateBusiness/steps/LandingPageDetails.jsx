import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Cropper from "react-easy-crop";
import { Button, TextField } from "@mui/material";
import { updateBusinessDetails } from "../store/businessSlice";
import { Container, Nav, Navbar, NavLink } from "react-bootstrap";
import { preRequestFun } from "../service/s3url";
import getCroppedImg from "../../../utils/cropper.utils";
import Loader from "../../../components/Loader/Loader";
import { handleWordExceeded } from "../../../utils/app.utils";

const initialCropState = { x: 0, y: 0 };

const LandingPageDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const businessState = useSelector((state) => state.business);

  const [theme, setTheme] = useState("#6AA646");
  const [secondaryTheme, setSecondaryTheme] = useState("#A8FF75");

  const [landingPageHero, setLandingPageHero] = useState({
    title: "",
    description: "",

    loading: "",
  });
  const [welcomePart, setWelcomePart] = useState({
    title: "",
    description: "",

    loading: "",
  });

  const [currentImage, setCurrentImage] = useState({ image: null, bannerFile: null, welcomeFile: null, preview: null, banner: null, welcome: null });

  const [cropLandImage, setCropLandImage] = useState(null)
  const [welcomeFile, setWelcomeFile] = useState();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loader state
  const [crop, setCrop] = useState(initialCropState);
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageFieldName, setImageFieldName] = useState("landingPageHeroImage");

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    try {

      const filePrev =
        imageFieldName === "landingPageHeroImage"
          ? landingPageHero?.coverImage
          : welcomePart?.coverImage;

      const file =
        imageFieldName === "landingPageHeroImage" ? cropLandImage : welcomeFile;

      const { fileUrl, blob } = await getCroppedImg(currentImage.preview, croppedArea);

      setShowCropper(false);

      const croppedFile = new File([blob], file?.name || "cropped-logo.png", {
        type: blob.type,
      });

      if (imageFieldName === "landingPageHeroImage") {
        setCurrentImage((prev) => ({ ...prev, banner: fileUrl, bannerFile: blob }));
        // setCropLandImage(croppedFile);
        // setLandingFile(croppedFile);
        // setLandingPageHero((prevData) => ({
        //   ...prevData,
        //   coverImage: fileUrl,
        // }));
      } else {
        setCurrentImage((prev) => ({ ...prev, welcome: fileUrl, welcomeFile: blob }));
        // setWelcomeFile(croppedFile);
        // setWelcomePart((prevData) => ({
        //   ...prevData,
        //   coverImage: fileUrl,
        // }));
      }
      setCrop(initialCropState);
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  };

  const handleFileChange = (name, e, sectionSetter) => {
    const file = e.target.files[0];

    setCurrentImage((prev) => ({
      ...prev,
      preview: URL.createObjectURL(file)
    }))

    if (name === "landingPageHeroImage") {
      setImageFieldName("landingPageHeroImage");
      setLandingPageHero((prevState) => ({
        ...prevState,
        loading: true,
      }));
    } else if (name === "welcomePartImage") {
      setImageFieldName("welcomePartImage");
      setWelcomePart((prevState) => ({
        ...prevState,
        loading: true,
      }));
    }

    if (file) {
      setLoading(true); // Show loader
      const reader = new FileReader();

      reader.onload = () => {
        sectionSetter((prevData) => ({
          ...prevData,
          coverImage: reader.result, // Use reader.result to get Base64 string
        }));

        if (name === "landingPageHeroImage") {
          setLandingPageHero((prevState) => ({
            ...prevState,
            loading: false,
          }));
          // setCropLandImage(file)
          // setLandingFile(file);
          setShowCropper(true);
        } else if (name === "welcomePartImage") {
          setWelcomePart((prevState) => ({
            ...prevState,
            loading: false,
          }));
          setWelcomeFile(file);
          setShowCropper(true);
        }

        setLoading(false); // Hide loader after image is set
      };

      reader.onerror = () => {
        console.error("Error reading file:", reader.error);
        setLoading(false); // Ensure loader hides on error
      };

      reader.readAsDataURL(file);
    }
  };

  const handleLandingPart = (e) => {
    const { name, value } = e.target;

    if (name == 'title') {
      if (!value) {
        setErrors((prev) => ({ ...prev, landingPageHeroTitle: "title required" }))
      } else {
        setErrors((prev) => ({ ...prev, landingPageHeroTitle: "" }))
      }
    }

    if (name == 'description') {
      if (!value) {
        setErrors((prev) => ({ ...prev, landingPageHeroDescription: "Description required" }))
      } else {
        setErrors((prev) => ({ ...prev, landingPageHeroDescription: "" }))

      }
    }


    setLandingPageHero((prev) => ({ ...prev, [name]: value }))
  }

  const handleWelcomePart = (e) => {
    const { name, value } = e.target;
    if (name == 'title') {
      if (value) {
        setErrors((prev) => ({ ...prev, welcomePartTitle: "" }))
      } else {
        setErrors((prev) => ({ ...prev, welcomePartTitle: "title required" }))
      }
    }

    if (name == 'description') {
      if (value) {
        setErrors((prev) => ({ ...prev, welcomePartDescription: "" }))
      } else {
        setErrors((prev) => ({ ...prev, welcomePartDescription: "Description required" }))
      }
    }
    setWelcomePart((prev) => ({ ...prev, [name]: value }))

  }


  const validateForm = () => {
    const newErrors = {};
    if (!landingPageHero.title)
      newErrors.landingPageHeroTitle = "Landing Title is required";
    if (!landingPageHero.description)
      newErrors.landingPageHeroDescription = "Description is required";
    if (!currentImage.banner)
      newErrors.landingPageHeroCoverImage = "Cover image is required";
    if (!welcomePart.title) newErrors.welcomePartTitle = "Title is required";
    if (!welcomePart.description)
      newErrors.welcomePartDescription = "Description is required";
    if (!currentImage.welcome)
      newErrors.welcomePartCoverImage = "Cover image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleLandingSubmit = async () => {
    setLoading(true); // Set loading once at the start
    try {
      let landingPreReq = null
      let welcomePreReq = null;
      console.log(landingPreReq, welcomePreReq, 'daattaattata')
      if (currentImage.bannerFile) {
        landingPreReq = await preRequestFun(currentImage.bannerFile, "Landing");
      }


      if (currentImage.welcomeFile) {
        welcomePreReq = await preRequestFun(currentImage.welcomeFile, "Welcome");
      }

      if (landingPreReq?.accessLink) {
        // setLandingPageHero((prev) => ({
        //   ...prev,
        //   coverImage: landingPreReq.accessLink,
        // }));
      }

      if (welcomePreReq?.accessLink) {
        // setWelcomePart((prev) => ({
        //   ...prev,
        //   coverImage: welcomePreReq.accessLink,
        // }));
      }

      if (validateForm()) {
        dispatch(
          updateBusinessDetails({
            landingPageHero: {
              ...landingPageHero,
              ...(currentImage.bannerFile && {

                coverImage:
                  landingPreReq?.accessLink,
              })
            },
            theme,
            secondaryTheme,
            welcomePart: {
              ...welcomePart,
              ...(currentImage.welcomeFile && {

                coverImage: welcomePreReq?.accessLink,
              })
            },
          })
        );
        // setCurrentImage({image:null ,bannerFile:null,welcomeFile:null,preview:null,banner:null,welcome:null})
        navigate("/create-business/core-services");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false); // Set loading to false at the end
    }
  };

  const triggerFileUpload = (inputId) => {
    document.getElementById(inputId).click();
  };

  const handlePrevStep = () => navigate("/create-business/description");

  useEffect(() => {
    setTheme(businessState?.theme || "#6AA646");
    setSecondaryTheme(businessState?.secondaryTheme || "#A8FF75");
    setLandingPageHero(businessState?.landingPageHero);
    setWelcomePart(businessState?.welcomePart);
    console.log(businessState)
    setCurrentImage(((prev) => ({ ...prev, banner: businessState.landingPageHero.coverImage, welcome: businessState.welcomePart.coverImage })));
  }, [businessState]);

  if (loading) {
    return (
      <div className="h-100vh">
        <div className="d-flex h-100 justify-content-center align-items-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="h-100vh create-business-div">
      {/* Cropper Modal */}
      {showCropper && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crop Your Image</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowCropper(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div
                  className="cropper-container position-relative"
                  style={{ height: "400px" }}
                >
                  <Cropper
                    image={currentImage?.preview}
                    crop={crop}
                    zoom={zoom}
                    aspect={
                      imageFieldName === "landingPageHeroImage" ? 16 / 9 : 7 / 5
                    }
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <Button
                  variant="filled"
                  className="mx-2 bg-danger text-white border-danger"
                  onClick={() => setShowCropper(false)}
                >
                  Cancel
                </Button>
                <Button color="primary" className="mx-2" variant="contained" onClick={handleCropSave}>
                  Save Crop
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row h-100 justify-content-center">
        {/* Left Image Section */}

        {/* Right Form Section */}
        <div className="col-12 col-md-6 row align-items-end justify-content-center h-100 p-3 p-md-5 right-portion">
          <div className="col-12 text-start">
            <button
              className="btn btn-dark w-auto float-start"
              onClick={handlePrevStep}
            >
              <i className="bi bi-arrow-left"></i>
            </button>
          </div>

          <div className="row justify-content-center">
            <div className="col-12 text-center text-md-start mt-5">
              <h1 className="fw-bold title-text">
                <span className="title-main">Add</span> <br />
                <span className="title-highlight">Landing Page Details</span>
              </h1>
            </div>

            {/* Color Theme Section */}
            <div className="col-12 p-3 p-md-3">
              <h5 className="fs-18 mb-4 p-1 text-start text-md-start text-dark fw-bold mt-3">
                Color Theme
              </h5>
              <div className="col-6 col-md-3 d-flex w-100 gap-5 pb-3">
                <div>
                  <label>Choose Primary Color</label>
                  <TextField
                    variant="filled"
                    type="color"
                    name="color"
                    className="form-control form-control-lg"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                  />
                </div>

                <div>
                  <label>Choose Secondary Color</label>
                  <TextField
                    type="color"
                    name="color"
                    className="form-control form-control-lg"
                    value={secondaryTheme}
                    onChange={(e) => setSecondaryTheme(e.target.value)}
                  />
                </div>
              </div>

              {/* Landing Page Hero Details */}
              <h5 className="fs-18 mb-4 text-dark fw-bold mt-4">
                Add Landing Page Banner
              </h5>
              <TextField
                fullWidth
                required
                className="my-2 border-0"
                label="Title (8 words)"
                id="title"
                variant="filled"
                name="title"
                autoComplete="title"
                value={landingPageHero.title}
                onChange={handleLandingPart}
                error={errors?.landingPageHeroTitle || handleWordExceeded(landingPageHero?.title, 8) ? true : false}
                helperText={handleWordExceeded(landingPageHero?.title, 8) ? "exceeded the limit" : ""}
              />
              {errors?.landingPageHeroTitle && <p className="text-danger">{errors?.landingPageHeroTitle}</p>}
              <TextField
                className="my-2"
                fullWidth
                required
                label="Description (50 words)"
                id="description"
                variant="filled"
                name="description"
                autoComplete="description"
                multiline // Makes the TextField behave like a textarea
                rows={4} // You can adjust the number of rows (height) here
                value={landingPageHero.description}
                onChange={handleLandingPart}
                error={errors?.landingPageHeroDescription || handleWordExceeded(landingPageHero?.description, 50) ? true : false}
                helperText={handleWordExceeded(landingPageHero?.description, 50) ? "exceeded the limit" : ""}
              />
              {errors?.landingPageHeroDescription && <p className="text-danger">{errors?.landingPageHeroDescription}</p>}
              {/* Hero Image Upload */}
              <input
                type="file"
                hidden
                id="LandingHeroImageInput"
                onChange={(e) =>
                  handleFileChange(
                    "landingPageHeroImage",
                    e,
                    setLandingPageHero
                  )
                }
              />
              <div
                onClick={() => triggerFileUpload("LandingHeroImageInput")}
                className="p-2 mt-2 mb-3 add-logo-div mx-auto"
              >
                <span style={{ color: "grey" }}>(Ratio 16 : 9)</span>
                <div className="text-center">
                  {landingPageHero.loading ? (
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    ></div>
                  ) : (
                    <img
                      src={
                        currentImage?.banner ||
                        "/images/add_image.png"
                      }
                      width="50"
                      alt="Add Hero Image"
                    />
                  )}
                </div>
              </div>
              {errors.landingPageHeroCoverImage && (
                <div className="text-danger">
                  {errors.landingPageHeroCoverImage}
                </div>
              )}

              {/* Welcome Part */}
              <h5 className="fs-18 mb-2 text-dark fw-bold mt-3">
                Add Welcome Part
              </h5>
              <TextField
                className="my-2"
                fullWidth
                required
                label="Title (8 words)"
                id="title"
                variant="filled"
                name="title"
                autoComplete="title"
                value={welcomePart.title}
                onChange={handleWelcomePart}
                error={errors?.welcomePartTitle || handleWordExceeded(welcomePart?.title, 8) ? true : false}
                helperText={handleWordExceeded(welcomePart?.title, 8) ? "exceeded the limit" : ""}
              />
              {errors?.welcomePartTitle && <p className="text-danger">{errors?.welcomePartTitle}</p>}
              <TextField
                className="my-2"
                fullWidth
                required
                label="Description (50 words)"
                id="description"
                variant="filled"
                name="description"
                autoComplete="description"
                multiline // Makes the TextField behave like a textarea
                rows={4} // You can adjust the number of rows (height) here
                value={welcomePart.description}
                onChange={handleWelcomePart}
                error={errors?.welcomePartDescription || handleWordExceeded(welcomePart?.description, 50) ? true : false}
                helperText={handleWordExceeded(welcomePart?.description, 50) ? "exceeded the limit" : ""}
              />
              {errors?.welcomePartDescription && <p className="text-danger">{errors?.welcomePartDescription}</p>}
              {/* Welcome Image Upload */}
              <input
                type="file"
                hidden
                id="WelcomeImageInput"
                onChange={(e) =>
                  handleFileChange("welcomePartImage", e, setWelcomePart)
                }
              />
              <div
                onClick={() => triggerFileUpload("WelcomeImageInput")}
                className="p-2 mt-2 mb-3 add-logo-div mx-auto"
              >
                <span style={{ color: "grey" }}>(Ratio 7 : 5)</span>
                <div className="text-center">
                  {welcomePart.loading ? (
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    ></div>
                  ) : (
                    <img
                      src={
                        currentImage?.welcome ||
                        "/images/add_image.png"
                      }
                      width="50"
                      alt="Add Welcome Image"
                    />
                  )}
                </div>
              </div>
              {errors.welcomePartCoverImage && (
                <div className="text-danger">
                  {errors.welcomePartCoverImage}
                </div>
              )}

              <div className="col-12 mt-4 text-center">
                <Button variant="contained" className="w-100 submit-button"
                  onClick={handleLandingSubmit}
                >
                  Save & Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="d-none d-md-block left-portion p-0 col-md-6 h-100">
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
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
                            background-color: ${theme}; /* Color of the scrollbar thumb */
                            border-radius: 10px;     /* Rounded edges of the thumb */
                            border: 3px solid  ${theme}; /* Padding around the thumb */
                        }
                    .theme
                    {
                        background-color: ${theme};
                        color: white;
                        border: none;
                    }.service-design.active{
                        background-color: ${theme};
                    }.address-section{
                    background-color:${theme};
                    }.address-logo i{
                    color: ${theme};
                    }.cat-option{
                        border-right: 1px dashed ${theme};
                    }.text-orange{
                            color: ${theme};
                        }.dish-div:hover{
                            background-color: ${theme};
                            color:white;
                        }.product-section{
                        padding:20px;
                        border:1px solid ${theme};
                        border-radius:16px;
                            }.slick-dots .slick-active button{
                                background-color: ${theme};
                                border-radius: 16px;
                            }
                        `}
          </style>
          <Navbar
            expand="lg"
            className="bg-white pjs "
            style={{ paddingBlock: "5px" }}
          >
            <Container>
              {/* Align Brand to the start (left side) */}
              <Navbar.Brand
                href="/"
                className="fw-bold w-50 nav-logo"
                style={{ fontSize: "36px" }}
              >
                <img src={businessState?.logo} alt="" />
                <span className="ms-2">{businessState?.businessName}</span>
              </Navbar.Brand>

              <Navbar.Toggle
                aria-controls="basic-navbar-nav"
                style={{ color: "black" }}
              />

              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto w-100 justify-content-evenly jcc">
                  <button
                    className="hamburger-btn text-black bg-transparent border-0 d-flex flex-column justify-content-center align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => console.log("Hamburger button clicked")}
                  >
                    <div
                      style={{
                        width: "25px",
                        height: "3px",
                        backgroundColor: "black",
                        margin: "4px 0",
                      }}
                    ></div>
                    <div
                      style={{
                        width: "25px",
                        height: "3px",
                        backgroundColor: "black",
                        margin: "4px 0",
                      }}
                    ></div>
                    <div
                      style={{
                        width: "25px",
                        height: "3px",
                        backgroundColor: "black",
                        margin: "4px 0",
                      }}
                    ></div>
                  </button>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
          <section className="h-auto">
            <div className="container p-top">
              <div className="row align-items-center banner-section">
                {/* Left Image for Mobile View */}
                <div className="col-12 col-lg-6 text-end d-block d-lg-none">
                  <img
                    src={currentImage?.banner}
                    alt=""
                    className="banner-image"
                  />
                  <div className="banner-image-2 d-none">
                    <img src="/images/baner-image2.png" alt="" />
                  </div>
                </div>

                {/* Text Content */}
                <div className="col-12 col-lg-6">
                  <div className="row align-items-center">
                    <div className="col-12">
                      <h1 className="text-start text-dark fw-bold david-font fw-bold banner-title text-center text-lg-start">
                        {landingPageHero.title}
                      </h1>
                    </div>
                    <div className="col-12">
                      <p className="text-secondary text-center text-lg-start david-font">
                        {landingPageHero.description}
                      </p>
                    </div>
                    <div className="mt-3 col-12">
                      <div className="row">
                        <div className="col-6 col-lg-5 mb-2">
                          <NavLink
                            to="#about"
                            className="btn btn-dark text-white radius-theme box-shadow w-100 p-1"
                            style={{ backgroundColor: "#212529" }}
                          >
                            View More
                          </NavLink>
                        </div>
                        <div className="col-6 col-lg-5 mb-2">
                          <NavLink
                            to="#service"
                            className="btn btn-dark text-white radius-theme box-shadow theme w-100 p-1"
                          >
                            Services
                          </NavLink>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 col-12 social-media gap-3">
                      <a
                        href={businessState?.socialMediaLinks?.[0]?.link}
                        target="_blank"
                        className="contact-banner text-dark"
                      >
                        <i className="bi bi-facebook"></i>
                      </a>
                      <a
                        href={businessState?.socialMediaLinks?.[1]?.link}
                        target="_blank"
                        className="contact-banner text-dark"
                      >
                        <i className="bi bi-instagram"></i>
                      </a>
                      <a
                        href={businessState?.socialMediaLinks?.[2]?.link}
                        target="_blank"
                        className="contact-banner text-dark"
                      >
                        <i className="bi bi-twitter"></i>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Image for Desktop View */}
                <div className="col-12 col-lg-6 text-end d-none d-lg-block">
                  <img
                    src={currentImage?.banner}
                    alt=""
                    className="banner-image"
                  />
                  <div className="banner-image-2 d-none">
                    <img src="/images/baner-image2.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-5 mb-5">
            <div className="container p-top">
              <div className="col-12 address-section">
                <div className="row">
                  <div className="col-12 col-lg-4 mb-3 mb-lg-0">
                    <div className="row align-items-center justify-content-start">
                      <div className="col-auto address-logo">
                        <i className="bi bi-geo-alt-fill"></i>
                      </div>
                      <div className="col">
                        <span className="fs-13">Address</span>
                        <p className="fs-16">
                          {businessState?.address?.buildingName},{" "}
                          {businessState?.address?.city},
                          {businessState?.address?.landMark},
                          {businessState?.address?.streetName},{" "}
                          {businessState?.address?.state}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-lg-4 mb-3 mb-lg-0">
                    <div className="row align-items-center justify-content-start">
                      <div className="col-auto address-logo">
                        <i className="bi bi-envelope-fill"></i>
                      </div>
                      <div className="col">
                        <span className="fs-13">Send Email</span>
                        {businessState?.emails?.map((email, index) => (
                          <p className="fs-16" key={index}>
                            {email.email}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-lg-4 mb-3 mb-lg-0">
                    <div className="row align-items-center justify-content-start">
                      <div className="col-auto address-logo">
                        <i className="bi bi-telephone"></i>
                      </div>
                      <div className="col">
                        <span className="fs-13">Contact</span>
                        {businessState?.mobileNumbers?.map((number, index) => (
                          <p className="fs-16" key={index}>
                            {number.number}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section
            className=" h-auto"
            style={{ backgroundColor: "#F3F3F4" }}
            id="about"
          >
            <div className="container p-top">
              <div className="row mt-5 align-items-center mb-5">
                <div className="col-12 col-lg-6 mt-2 text-center text-lg-start about-image">
                  <img
                    src={currentImage.welcome}
                    className="img-fluid"
                    alt=""
                  />
                </div>
                <div className="col-12 col-lg-6">
                  <div className="col-12 mb-3">
                    <h1 className="text-center text-lg-start text-dark fw-bold david-font fw-bold banner-title">
                      {welcomePart.title}
                    </h1>
                  </div>
                  <div className="col-12 mt-4">
                    <p className="text-secondary text-center text-lg-start david-font mt-4">
                      {welcomePart.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LandingPageDetails;