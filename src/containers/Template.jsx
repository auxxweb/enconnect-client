import React, { useEffect, useState } from "react";
import { Carousel, Container, Nav, Navbar, NavLink } from "react-bootstrap";
import "/src/assets/css/template.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams } from "react-router-dom";
import {
  createBusinessReview,
  fetchBusinessTemplate,
  getAllBusinessReviews,
  submitContactForm,
  submitNewsLetter,
} from "../Functions/functions";
import { Dialog } from "primereact/dialog";
import Rating from "@mui/material/Rating";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import ContactForm from "/src/components/Business/contactForm";
import { formatDate } from "../utils/app.utils";
import { toast } from "react-toastify";
import PlaceholderBanner from "/images/BannerPlaceholder.png";
import Placeholder from "/images/placeholder.jpg";
import Loader from "../components/Loader/Loader";
import NewsArticles from "./NewsArticles";
import BusinessReviews from "./BusinessReviews";

let items = document?.querySelectorAll(".carousel .carousel-item");

items.forEach((el) => {
  const minPerSlide = 4;
  let next = el.nextElementSibling;
  for (var i = 1; i < minPerSlide; i++) {
    if (!next) {
      // wrap carousel by using first child
      next = items[0];
    }
    let cloneChild = next.cloneNode(true);
    el.appendChild(cloneChild.children[0]);
    next = next.nextElementSibling;
  }
});
import ShareButton from "../components/ShareButton";
import ResponsiveGalleryCarousel from "../components/GalleryComponent";
import { Button } from "@mui/material";
import { size } from "lodash";

export default function Template() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNews, setShowNews] = useState(false);
  const [businessData, setBusinessData] = useState(null);
  const [saveContact, setSaveContact] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [colorTheme, setColorTheme] = useState("");
  const [visible, setVisible] = useState(false);
  const [reviewFetch, setreviewFetch] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [textColor, setTextColor] = useState("");
  const [review, setReview] = useState({
    rating: "",
    name: "",
    review: "",
  });
  console.log(businessData, "sasasass");
  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);

  const [closeDays, setCloseDays] = useState([]);
  const allDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const [isTruncated, setIsTruncated] = useState(true);

  const convertTo12HourFormat = (time = "") => {
    // Split the time into hours and minutes
    let [hours, minutes] = time.split(":").map(Number);

    // Determine if it's AM or PM
    let amOrPm = hours >= 12 ? "PM" : "AM";

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12 || 12;

    // Format the time string
    return `${hours}:${
      minutes?.toString()?.padStart(2, "0")
        ? minutes?.toString()?.padStart(2, "0")
        : `00`
    } ${amOrPm}`;
  };

  // Function to truncate text after a specified character limit
  const truncateText = (text, limit = 100) => {
    if (text?.length > limit && isTruncated) {
      return text.slice(0, limit) + "";
    }
    return text;
  };

  // Toggle the truncation state when clicked
  const toggleTruncation = () => {
    setIsTruncated(!isTruncated);
  };

  const [newsLetterEmail, setNewsLetterEmail] = useState("");

  const handleFormSubmit = async (e, formData) => {
    e.preventDefault();

    const response = await submitContactForm({
      ...formData,
      businessId: id,
    });
    if (response?.data) {
      toast.success("Form submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        style: {
          backgroundColor: "#38a20e", // Custom red color for error
          color: "#FFFFFF", // White text
        },
      });
      return true;
    } else {
      toast.success("Failed submission failed!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        style: {
          backgroundColor: "#aa0808", // Custom red color for error
          color: "#FFFFFF", // White text
        },
      });
      return false;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (window?.location?.hash == "#news") {
      setShowNews(true);
    } else {
      setShowNews(false);
    }
    if (window?.location?.hash == "#reviews") {
      setShowAllReviews(true);
    } else {
      setShowAllReviews(false);
    }
  }, [window?.location?.hash]);

  const handleNewsLetterSubmit = async (e) => {
    e.preventDefault();

    // Remove leading/trailing spaces
    const trimmedEmail = newsLetterEmail.trim();

    // Check if the email is blank or invalid
    if (!trimmedEmail) {
      toast.error("Email cannot be empty!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        style: {
          backgroundColor: "#aa0808", // Custom red color for error
          color: "#FFFFFF", // White text
        },
      });
      return;
    }

    // Regular expression to validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email address!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        style: {
          backgroundColor: "#aa0808", // Custom red color for error
          color: "#FFFFFF", // White text
        },
      });
      return;
    }

    console.log("newsLetterEmail", trimmedEmail);

    // Submit email
    const response = await submitNewsLetter({ email: trimmedEmail });
    if (response?.data) {
      toast.success("Subscribed successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        style: {
          backgroundColor: "#38a20e", // Custom green color for success
          color: "#FFFFFF", // White text
        },
      });
      setNewsLetterEmail("");
    } else {
      toast.error("Failed to Subscribe!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        style: {
          backgroundColor: "#aa0808", // Custom red color for error
          color: "#FFFFFF", // White text
        },
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReview((prevState) => ({
      ...prevState,
      [name]: value,
      getAllBusinessReviews,
    }));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    console.log(review, "review");
    setReviewLoading(true);

    createBusinessReview({
      ...review,
      businessId: id,
    })
      .then((response) => {
        setReviewLoading(false);

        // Clear the form
        setReview({
          rating: "",
          name: "",
          review: "",
        });

        if (response?.data) {
          // Update the reviews list directly
          setReviews((prevReviews) => [
            ...prevReviews,
            {
              ...review, // Use the review from state
              createdAt: new Date().toISOString(), // Add timestamp
              id: response.data.id, // Assuming the API returns the ID of the new review
            },
          ]);

          // Show success toast
          toast.success("Thank you for your review!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            style: {
              backgroundColor: "#38a20e", // Custom green color
              color: "#FFFFFF", // White text
            },
          });

          // Trigger UI updates
          setreviewFetch(!reviewFetch);
          setVisible(false);
        }
      })
      .catch((err) => {
        setReviewLoading(false);

        // Clear the form
        setReview({
          rating: "",
          name: "",
          review: "",
        });

        console.log(err.message);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      const businessDetails = await fetchBusinessTemplate(id, setLoading);
      setBusinessData(businessDetails?.data);
      console.log(businessDetails.success);
      setColorTheme(businessDetails.data.theme);
      setLoading(false);
      const closed = allDays.filter(
        (day) =>
          !businessDetails.data.businessTiming.workingDays
            .map((d) => d.toLowerCase())
            .includes(day)
      );
      setCloseDays(closed);
      if (businessDetails?.data?.theme) {
        const themeColor = businessDetails.data.theme;
        setColorTheme(themeColor);

        // Calculate contrasting text color
        const contrastColor = getContrastingColor(themeColor);
        setTextColor(contrastColor);
      }
      if (businessDetails?.success) {
        const data = {
          address: `${businessDetails?.data?.address?.buildingName ?? ""} ${
            businessDetails?.data?.address?.streetName ?? ""
          } ${businessDetails?.data?.address?.landMark ?? ""} ${
            businessDetails?.data?.address?.city ?? ""
          } ${businessDetails?.data?.address?.state ?? ""} ${
            businessDetails?.data?.address?.pinCode ?? ""
          }`,
          primaryNumber:
            businessDetails?.data?.contactDetails?.primaryNumber ?? "",
          secondaryNumber:
            businessDetails?.data?.contactDetails?.secondaryNumber ?? "",
          email: businessDetails?.data?.email ?? "",
          title: businessDetails?.data?.businessName ?? "",
          businessName: businessDetails?.data?.businessName ?? "",
          website: businessDetails?.data?.contactDetails?.website ?? "",
        };

        setSaveContact(data);
      }
    };
    const fetchReview = async () => {
      const response = await getAllBusinessReviews({ businessId: id });
      console.log(response, "data-validation");
      setReviews(response?.data?.data);
      setReviewCount(response?.data?.totalCount);
    };
    fetchData();
    fetchReview();
  }, [id]);

  console.log(businessData, "lll;l;l;l;l;;ll;;;l");

  const getContrastingColor = (hexColor) => {
    // Remove '#' if present
    const color = hexColor.replace("#", "");

    // Convert to RGB
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    // Calculate brightness
    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

    // Return black or white based on brightness
    return brightness > 186 ? "#000000" : "#FFFFFF"; // Adjust threshold if needed
  };

  const settings = {
    dots: false,
    infinite: !reviews?.length,
    autoplay: true,
    arrows: false,
    // centerMode: true,
    speed: 300,
    slidesToShow: 2, // Number of dishes to show
    // mobileFirst: true,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: reviews?.length ? 2 : 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 390,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const setting2 = {
    dots: false,
    infinite: !businessData?.service?.length, // Infinite scroll only for more than 3 items
    autoplay: true,
    arrows: false,
    speed: 300,
    slidesToShow: 2,
    // businessData?.service?.length <= 3 ? businessData?.service?.length : 2, // Dynamic slidesToShow
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: businessData?.service?.length ? 2 : 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 390,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="h-100vh text-center ">
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-3 "> {loading && <Loader />}</div>
        </div>
      </div>
    );
  }

  // If there's no business data (e.g., fetch failed), show an error message
  if (!businessData) {
    return (
      <>
        <Navbar
          expand="lg"
          className="bg-white pjs fixed-top"
          style={{ paddingBlock: "5px" }}
        >
          <Container>
            {/* Back button for large screens (before the logo) */}
            <button
              className="btn btn-outline-secondary d-none d-lg-inline-block me-2"
              onClick={() => (window.location.href = "/")} // Modify the onClick action as needed
            >
              <i className="bi bi-arrow-left"></i> Home
            </button>

            {/* Align Brand to the start (left side) */}
            <Navbar.Brand
              href="#"
              className="fw-bold w-50 nav-logo"
              style={{ fontSize: "36px" }}
            >
              <img
                src={
                  businessData?.logo && businessData?.logo.length > 0
                    ? businessData?.logo
                    : Placeholder
                }
                alt={businessData?.businessName || "Logo Placeholder"}
              />
              <span className="ms-2 ">{businessData?.businessName}</span>
            </Navbar.Brand>

            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              style={{ color: "black" }}
            />

            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto w-100 justify-content-evenly jcc">
                <NavLink
                  href="#home"
                  className="text-black text-center text-lg-start text-decoration-none fs-14"
                  style={{ color: "black" }}
                >
                  Home
                </NavLink>
                <NavLink
                  href="#about"
                  className="text-black text-center text-lg-start text-decoration-none fs-14"
                  style={{ color: "black" }}
                >
                  About
                </NavLink>
                <NavLink
                  href="#gallery"
                  className="text-black text-center text-lg-start text-decoration-none fs-14"
                  style={{ color: "black" }}
                >
                  Gallery
                </NavLink>
                <NavLink
                  href="#contact"
                  className="text-black text-center text-lg-start text-decoration-none fs-14"
                  style={{ color: "black" }}
                >
                  Contact
                </NavLink>
                <NavLink
                  href="#news"
                  onClick={(e) => setShowNews(true)}
                  className="text-black text-center text-lg-start text-decoration-none fs-14"
                  style={{ color: "black" }}
                >
                  Blogs
                </NavLink>
                <NavLink
                  href="#services"
                  style={{
                    backgroundColor: "#105193",
                    color: "white",
                    borderRadius: "10px 0px",
                    padding: "8px 20px",
                    fontSize: "13px",
                    boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.15)",
                  }}
                  className="fw-bold text-decoration-none text-center text-lg-start"
                >
                  Services
                </NavLink>

                {/* Back button for smaller screens (inside menu items) */}
                <button
                  className="btn btn-outline-secondary d-lg-none mt-2"
                  onClick={() => (window.location.href = "/")} // Modify the onClick action as needed
                >
                  Back to Home
                </button>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <section className="h-auto">
          <div
            className="container p-top"
            style={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "250px",
                width: "300px",
                margin: "0 auto",
                backgroundColor: "#F3F4F6", // Light gray for card background
                borderRadius: "12px", // Rounded corners
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
                color: "#1D4ED8", // Tailwind [#1D4ED8]
                fontSize: "18px", // Clean font size
                textAlign: "center",
                fontWeight: "500", // Medium weight
                fontFamily: "'Inter', sans-serif",
                padding: "20px", // Padding for internal spacing
              }}
            >
              <img
                src="https://st.depositphotos.com/1006899/2650/i/450/depositphotos_26505551-stock-photo-error-metaphor.jpg"
                alt="Profile Not Found Icon"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  border: "2px solid #1D4ED8", // Highlight with theme color
                  marginBottom: "15px",
                }}
              />
              <p style={{ margin: 0 }}>
                We couldn't find the profile you're looking for.
              </p>
              <span
                style={{ fontSize: "14px", color: "#6B7280", marginTop: "8px" }}
              >
                Please check the details or try again later.
              </span>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
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
                        background-color: ${colorTheme}; /* Color of the scrollbar thumb */
                        border-radius: 10px;     /* Rounded edges of the thumb */
                        border: 3px solid  ${colorTheme}; /* Padding around the thumb */
                    }
                .theme
                {
                    background-color: ${colorTheme};
                    color: white;
                    border: none;
                }.service-design.active{
                    background-color: ${colorTheme};
                }.address-section{
                background-color:${colorTheme};
                }.address-logo i{
                color: ${colorTheme};
                }.cat-option{
                    border-right: 1px dashed ${colorTheme};
                }.text-orange{
                        color: ${colorTheme};
                    }.dish-div:hover{
                        background-color: ${colorTheme};
                        color:white;
                    }.product-section{
                    padding:20px;
                    border:1px solid ${colorTheme};
                    border-radius:16px;
                        }.slick-dots .slick-active button{
                            background-color: ${colorTheme};
                            border-radius: 16px;
                        }
                    `}
      </style>
      <Navbar
        collapseOnSelect={true}
        expand="lg"
        className="bg-white pjs fixed-top"
        style={{ paddingBlock: "5px" }}
      >
        <button
          className="btn d-none d-lg-inline-block me-2 mr-4"
          style={{
            marginLeft: "18px",

            backgroundColor: "transparent", // Default transparent background
            color: colorTheme, // Text color based on colorTheme
            border: ` 1.5px solid ${colorTheme}`, // Border color based on colorTheme
            padding: "4px 10px", // Reduced padding for smaller button size
            fontSize: "12px", // Smaller font size
            borderRadius: "6px", // Optional: Make edges slightly rounded
          }}
          onClick={() => (window.location.href = "/")}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = colorTheme; // Full background color on hover
            e.target.style.color = "#fff"; // Text turns white on hover
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent"; // Transparent background when not hovering
            e.target.style.color = colorTheme; // Text returns to colorTheme
          }}
        >
          <i className="bi bi-arrow-left"></i> Home
        </button>
        <Container>
          {/* Back button for large screens (before the logo) */}

          {/* Align Brand to the start (left side) */}
          <Navbar.Brand
            href="#"
            className="fw-bold w-50 nav-logo d-flex align-items-center flex-nowrap"
          >
            <img
              src={
                businessData?.logo && businessData?.logo.length > 0
                  ? businessData?.logo
                  : Placeholder
              }
              // alt={businessData?.businessName || 'Logo Placeholder'}
              style={{ maxWidth: "50px", maxHeight: "50px" }} // Optional: Set a max size for the logo
            />
            <span
              className="ms-2"
              style={{
                overflow:
                  businessData?.businessName?.length > 25
                    ? "hidden"
                    : window.innerWidth < 768
                    ? "visible"
                    : "hidden",
                // whiteSpace: businessData?.businessName?.length > 20 ? 'nowrap' : window.innerWidth < 768 ? 'normal' : 'nowrap',
                textOverflow:
                  businessData?.businessName?.length > 25
                    ? "ellipsis"
                    : window.innerWidth < 768
                    ? "unset"
                    : "ellipsis",
                fontSize:
                  businessData?.businessName?.length > 25 ? "22px" : "30px", // Adjust font size
              }}
            >
              {businessData?.businessName}
            </span>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            style={{ color: "black" }}
          />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto w-100 justify-content-evenly jcc">
              <NavLink
                href="#home"
                className="text-black text-center text-lg-start text-decoration-none fs-14"
                style={{ color: "black" }}
              >
                Home
              </NavLink>
              <NavLink
                href="#about"
                className="text-black text-center text-lg-start text-decoration-none fs-14"
                style={{ color: "black" }}
              >
                About
              </NavLink>
              <NavLink
                href="#gallery"
                className="text-black text-center text-lg-start text-decoration-none fs-14"
                style={{ color: "black" }}
              >
                Gallery
              </NavLink>
              <NavLink
                href="#contact"
                className="text-black text-center text-lg-start text-decoration-none fs-14"
                style={{ color: "black" }}
              >
                Contact
              </NavLink>
              <NavLink
                href="#news"
                className="text-black text-center text-lg-start text-decoration-none fs-14"
                style={{ color: "black" }}
              >
                Blogs
              </NavLink>
              <NavLink
                href="#services"
                style={{
                  backgroundColor: colorTheme,
                  color: "white",
                  borderRadius: "10px 0px",
                  padding: "8px 20px",
                  fontSize: "13px",
                  boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.15)",
                }}
                className="fw-bold text-decoration-none text-center text-lg-start"
              >
                Services
              </NavLink>

              {/* Back button for smaller screens (inside menu items) */}
              <button
                className="btn btn-outline-secondary d-lg-none mt-2"
                style={{
                  backgroundColor: "transparent", // Default transparent background
                  color: colorTheme, // Text color based on colorTheme
                  border: `2px solid ${colorTheme}`, // Border color based on colorTheme
                  padding: "6px 16px", // Adjust padding if needed
                  fontSize: "13px", // Adjust font size for smaller screens
                  borderRadius: "0px 10px", // Optional: Rounded edges for better UI
                }}
                onClick={() => (window.location.href = "/")}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colorTheme; // Full background color on hover
                  e.target.style.color = "#fff"; // Text turns white on hover
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent"; // Transparent background when not hovering
                  e.target.style.color = colorTheme; // Text returns to colorTheme
                }}
              >
                Back to Home
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {showAllReviews && (
        <BusinessReviews
          theme={businessData?.theme}
          secondaryTheme={businessData?.secondaryTheme}
          bgBanner={businessData?.logo}
        />
      )}

      {showNews && (
        <NewsArticles
          businessId={id}
          newsData={businessData?.landingPageHero}
          colorTheme={colorTheme}
        />
      )}

      {!showAllReviews && !showNews && (
        <>
          <section className="h-auto" id="home">
            <div className="container">
              <div className="row align-items-center banner-section">
                {/* Left Image for Mobile View */}
                <div className="col-12 col-lg-6 text-center text-lg-end d-block d-lg-none">
                  <img
                    src={
                      businessData?.landingPageHero?.coverImage &&
                      businessData?.landingPageHero?.coverImage?.length > 0
                        ? businessData?.landingPageHero?.coverImage
                        : PlaceholderBanner
                    }
                    alt=""
                    className="banner-image"
                  />
                </div>

                {/* Text Content */}
                <div className="col-12 col-lg-6">
                  <div className="row align-items-center">
                    <div className="col-12">
                      <h1 className="text-dark fw-bold david-font banner-title text-center text-lg-start sm:text-sm sm:leading-5 sm:whitespace-nowrap lg:text-4xl">
                        {businessData?.landingPageHero?.title}
                      </h1>
                    </div>
                    <div className="col-12">
                      <p className="text-secondary text-center text-lg-start david-font">
                        {truncateText(
                          businessData?.landingPageHero?.description,
                          100
                        )}
                        {businessData?.landingPageHero?.description?.length >
                          100 &&
                          isTruncated && (
                            <span
                              onClick={toggleTruncation}
                              className="text-primary cursor-pointer ml-1 text-black"
                            >
                              ...
                            </span>
                          )}
                      </p>
                    </div>
                    {/* Hide Buttons on Mobile */}
                    <div className="mt-3 col-12 d-none d-lg-block">
                      <div className="row">
                        <div className="col-6 col-lg-3 mb-2">
                          <NavLink
                            href="#about"
                            to="#about"
                            className="btn btn-dark text-white radius-theme box-shadow w-100 p-1"
                            style={{ backgroundColor: "#212529" }}
                          >
                            View More
                          </NavLink>
                        </div>
                        <div className="col-6 col-lg-3 mb-1">
                          <NavLink
                            href="#services"
                            className="btn btn-dark text-white radius-theme box-shadow theme w-100 p-1"
                          >
                            Services
                          </NavLink>
                        </div>
                      </div>
                    </div>
                    {/* Social Media Links */}
                    <div className=" col-12 social-media gap-2">
                      {businessData?.contactDetails?.website && (
                       
                          <a
                            href={`https://${businessData?.contactDetails?.website.replace(
                              /^https?:\/\//,
                              ""
                            )}`}
                            target="_blank"
                            className="flex contact-banner items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-black hover:bg-blue-600 transition duration-200"
                            rel="noopener noreferrer"
                          >
                            <i className="bi bi-globe text-2xl"></i>
                          </a>
                        
                      )}
                      {businessData?.socialMediaLinks?.map((social) => (
                        <>
                          <a
                            href={social?.link}
                            target="_blank"
                            className="contact-banner text-dark"
                          >
                            <i
                              className={`bi bi-${social?.tag} text-3xl sm:text-xl`}
                            ></i>
                          </a>
                        </>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Image for Desktop View */}
                <div className="col-12 col-lg-6 text-end d-none d-lg-block">
                  <img
                    src={
                      businessData?.landingPageHero?.coverImage &&
                      businessData?.landingPageHero?.coverImage?.length > 0
                        ? businessData?.landingPageHero?.coverImage
                        : PlaceholderBanner
                    }
                    alt=""
                    className="banner-image"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="mt-2 mb-3 sm:mt-0 sm:mb-0">
            <div className="container  sm:px-0">
              <div className="col-12 address-section pt-2 ">
                <div className="row d-flex justify-content-around align-items-center">
                  {/* Address Section */}
                  <div className="col-12 col-sm-4  mb-sm-0 my-2  ">
                    <div className="row align-items-center justify-content-start">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${businessData?.address?.buildingName},${businessData.address?.streetName}, ${businessData?.address?.landMark}, ${businessData?.address?.city},   ${businessData.address?.state}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none text-dark"
                      >
                        <div className="row d-flex justify-content-around align-items-center">
                          <div className="col-auto address-logo">
                            <i className="bi bi-geo-alt-fill text-2xl sm:text-lg" />
                          </div>
                          <div className="col">
                            <span
                              className="fs-12 sm:fs-10"
                              style={{ color: textColor }}
                            >
                              Address
                            </span>
                            <p
                              style={{
                                color: textColor,
                                textDecoration: "none",
                              }}
                              className="fs-14 sm:fs-12"
                            >
                              {`${businessData?.address?.buildingName}`} ,
                              {`${businessData?.address?.streetName}`},
                              <br />
                              {`${businessData?.address?.landMark}`},
                              {`${businessData?.address?.city}, ${businessData?.address?.state}`}
                            </p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Email Section */}
                  <div className="col-12 col-sm-4 mb-sm-0 my-2 ">
                    <div className="row  d-flex align-items-center justify-content-start">
                      <div className="col-auto address-logo">
                        <i className="bi bi-envelope-fill text-2xl sm:text-lg" />
                      </div>
                      <div className="col ">
                        <a
                          href={`mailto:${businessData?.contactDetails?.email}`}
                          className="text-decoration-none text-dark  "
                        >
                          <span
                            className="fs-12 sm:fs-10  "
                            style={{ color: textColor }}
                          >
                            Send Email
                          </span>
                          <p
                            className="fs-14 sm:fs-12 p-0 m-0"
                            style={{ color: textColor, textDecoration: "none" }}
                          >
                            {businessData?.contactDetails?.email}
                          </p>
                        </a>
                        <ShareButton
                          theme={colorTheme}
                          saveContactDetails={saveContact}
                          logoUrl={businessData?.logo}
                          businessName={businessData?.businessName}
                          number={businessData?.contactDetails?.whatsAppNumber}
                          countryCode={
                            businessData?.contactDetails?.whatsappCountryCode
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div className="col-12 col-sm-3  mb-sm-0 my-2 ">
                    <div className="row d-flex align-items-center justify-content-start">
                      <div className="col-auto address-logo">
                        <i className="bi bi-telephone text-2xl sm:text-lg" />
                      </div>
                      <div className="col">
                        <span
                          className="fs-12 sm:fs-10"
                          style={{ color: textColor }}
                        >
                          Contact
                        </span>
                        <p className="fs-14 sm:fs-12 mb-0">
                          <a
                            style={{ color: textColor, textDecoration: "none" }}
                            href={`tel:${businessData?.contactDetails?.primaryNumber}`}
                          >
                            + {businessData?.contactDetails?.primaryCountryCode}{" "}
                            {businessData?.contactDetails?.primaryNumber}
                          </a>
                        </p>
                        <p className="fs-14 sm:fs-12 mt-0">
                          <a
                            className={`${
                              businessData?.contactDetails?.secondaryNumber ??
                              "d-none"
                            }`}
                            style={{ color: textColor, textDecoration: "none" }}
                            href={`tel:${businessData?.contactDetails?.secondaryNumber}`}
                          >
                            +{" "}
                            {businessData?.contactDetails?.secondaryCountryCode}{" "}
                            {businessData?.contactDetails?.secondaryNumber}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section
            className="h-auto"
            style={{ backgroundColor: "#F3F3F4" }}
            id="about"
          >
            <div className="container p-top">
              <div className="row mt-5 align-items-center mb-5">
                <div className="col-12 col-lg-6 mt-2 text-center text-lg-start about-image">
                  <img
                    src={businessData?.welcomePart?.coverImage ?? Placeholder}
                    className="img-fluid about-image"
                    alt=""
                  />
                </div>
                <div className="col-12 col-lg-6">
                  <div className="col-12 mb-3">
                    <h1 className="text-center text-lg-start text-dark fw-bold david-font fw-bold banner-title">
                      {businessData?.welcomePart?.title}
                    </h1>
                  </div>
                  <div className="col-12 mt-4">
                    <p className="text-secondary text-center text-lg-start david-font mt-4">
                      {businessData?.welcomePart?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {(businessData?.specialServices?.title ||
            businessData?.specialServices?.description) && (
            <section
              className="h-auto"
              id="services"
              style={{ backgroundColor: "#F3F3F4" }}
            >
              <div className="container p-top">
                <div className="col-12 mb-5">
                  <div className="mt-5 text-center">
                    <div className="col-12">
                      <h1 className="text-center text-dark fw-bold david-font banner-title fs-45">
                        {businessData?.specialServices?.title}
                      </h1>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col-12 col-lg-6">
                        <p className="text-secondary text-center mb-2">
                          {businessData?.specialServices?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row justify-content-center gap-3">
                    {businessData?.specialServices?.data?.filter(
                      (dish) =>
                        dish.title ||
                        dish.description ||
                        dish.image ||
                        dish.link
                    ).length > 0 ? (
                      businessData.specialServices.data.length > 2 ? (
                        <Slider {...setting2}>
                          {businessData?.specialServices?.data.map(
                            (dish, index) =>
                              dish.title ||
                              dish.description ||
                              dish.image ||
                              dish.link ? (
                                <div
                                  key={index}
                                  className="dish-div col-12 text-center p-3"
                                  style={{ transition: "all 0.3s ease" }}
                                >
                                  <div className="col-12 position-relative text-center">
                                    <img
                                      src={
                                        dish.image?.length > 0
                                          ? dish.image
                                          : Placeholder
                                      }
                                      alt={dish.title}
                                      className="img-fluid"
                                      style={{
                                        width: "250px",
                                        maxWidth: "250px",
                                        objectFit: "cover",
                                        height: "300px",
                                      }}
                                    />
                                  </div>
                                  <div className="col-12">
                                    <h2 className="fs-20 fw-bold">
                                      {dish.title}
                                    </h2>
                                  </div>
                                  <div className="col-12 mt-3 mb-3">
                                    <p>
                                      {dish.description.length > 150 ? (
                                        <span>
                                          {dish.description.substring(0, 150)}
                                          ...
                                          <button
                                            onClick={(e) => {
                                              e.target.style.display = "none";
                                              const fullText =
                                                document.getElementById(
                                                  `full-text-${index}`
                                                );
                                              fullText.style.display = "inline";
                                              fullText.parentElement.parentElement.parentElement.style.height =
                                                "auto"; // Dynamically increase card size
                                              const viewMoreButton =
                                                document.getElementById(
                                                  `view-more-btn-${index}`
                                                );
                                              viewMoreButton.style.display =
                                                "block"; // Show View More
                                            }}
                                            className="btn btn-link p-0"
                                          >
                                            Read More
                                          </button>
                                          <span
                                            id={`full-text-${index}`}
                                            style={{ display: "none" }}
                                          >
                                            {dish.description.substring(150)}
                                          </span>
                                        </span>
                                      ) : (
                                        dish.description
                                      )}
                                    </p>
                                  </div>
                                  {dish?.link && (
                                    <div
                                      className="col-12 mt-3 mb-3 text-end"
                                      id={`view-more-btn-${index}`}
                                    >
                                      <Button
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="Visit to know more"
                                        target="_blank"
                                        href={dish?.link}
                                        className="btn btn-dark btn-sm d-inline-block"
                                      >
                                        View More
                                        <i
                                          style={{ transform: "rotate(90deg)" }}
                                          className="bi bi-arrow-right"
                                        ></i>
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              ) : null
                          )}
                        </Slider>
                      ) : (
                        businessData.specialServices.data.map((dish, index) =>
                          dish.title ||
                          dish.description ||
                          dish.image ||
                          dish.link ? (
                            <div
                              key={index}
                              className="dish-div col-12 col-lg-6 text-center p-3"
                              style={{ transition: "all 0.3s ease" }}
                            >
                              <div className="col-12 position-relative">
                                <img
                                  src={
                                    dish.image?.length > 0
                                      ? dish.image
                                      : Placeholder
                                  }
                                  alt={dish.title}
                                  style={{
                                    width: "100%",
                                    height: "300px",
                                    maxWidth: "250px",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                              <div className="col-12">
                                <h2 className="fs-20 fw-bold">{dish.title}</h2>
                              </div>
                              <div className="col-12 mt-3 mb-3">
                                <p>
                                  {dish.description.length > 150 ? (
                                    <span>
                                      {dish.description.substring(0, 150)}...
                                      <button
                                        onClick={(e) => {
                                          e.target.style.display = "none";
                                          const fullText =
                                            document.getElementById(
                                              `full-text-${index}`
                                            );
                                          fullText.style.display = "inline";
                                          fullText.parentElement.parentElement.parentElement.style.height =
                                            "auto"; // Dynamically increase card size
                                          const viewMoreButton =
                                            document.getElementById(
                                              `view-more-btn-${index}`
                                            );
                                          viewMoreButton.style.display =
                                            "block"; // Show View More
                                        }}
                                        className="btn btn-link p-0"
                                      >
                                        Read More
                                      </button>
                                      <span
                                        id={`full-text-${index}`}
                                        style={{ display: "none" }}
                                      >
                                        {dish.description.substring(150)}
                                      </span>
                                    </span>
                                  ) : (
                                    dish.description
                                  )}
                                </p>
                              </div>
                              {dish?.link && (
                                <div
                                  className="col-12 mt-3 mb-3 text-end"
                                  id={`view-more-btn-${index}`}
                                >
                                  <Button
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Visit to know more"
                                    target="_blank"
                                    href={dish?.link}
                                    className="btn btn-dark btn-sm d-inline-block"
                                  >
                                    View More
                                    <i
                                      style={{ transform: "rotate(90deg)" }}
                                      className="bi bi-arrow-right"
                                    ></i>
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : null
                        )
                      )
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
          )}

          {(businessData?.productSection?.title ||
            businessData?.productSection?.description) && (
            <section className="bg-white h-auto david-font" id="menu">
              <div className="container p-top">
                <div className="col-12 mb-5">
                  <div className="row justify-content-center">
                    <div className="col-12 col-md-6 text-center">
                      <h1 className="text-dark fw-bold david-font banner-title fs-45">
                        {businessData?.productSection?.title}
                      </h1>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col-12 col-lg-6">
                        <p className="text-secondary text-center mb-2">
                          {businessData?.productSection?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 david-font">
                  <div className="mb-5">
                    {businessData?.productSection?.data?.length > 0 && (
                      <div className="row g-4">
                        {businessData.productSection.data.map((item, index) =>
                          item.title ||
                          item.description ||
                          item.image ||
                          item.price ? (
                            <div
                              className="col-12 col-md-6 mx-auto"
                              key={index}
                            >
                              <div
                                className="d-flex align-items-center bg-light rounded shadow-sm"
                                style={{
                                  minHeight: "180px",
                                  maxWidth: "100%",
                                  padding: "15px",
                                }}
                              >
                                {/* Image Section */}
                                <div
                                  className="me-3"
                                  style={{
                                    flex: "0 0 30%",
                                    maxHeight: "150px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <img
                                    src={
                                      item?.image && item?.image.length > 0
                                        ? item.image
                                        : Placeholder
                                    }
                                    alt="Product"
                                    className="w-100 h-100 rounded"
                                    style={{
                                      objectFit: "cover",
                                    }}
                                  />
                                </div>

                                {/* Content Section */}
                                <div className="flex-grow-1">
                                  <h1 className="fs-20 fw-bold mb-2">
                                    {item.title}
                                  </h1>

                                  {/* Description with Read More */}
                                  <p
                                    className="text-muted mb-2"
                                    style={{
                                      overflow: "hidden",
                                      display: "-webkit-box",
                                      WebkitBoxOrient: "vertical",
                                      WebkitLineClamp: "2", // Limit to 2 lines
                                      transition: "all 0.3s",
                                    }}
                                    id={`desc-${index}`}
                                  >
                                    {item.description}
                                  </p>
                                  {item.description &&
                                    item.description.length > 100 && (
                                      <button
                                        className="btn btn-link p-0"
                                        style={{
                                          fontSize: "14px",
                                          textDecoration: "none",
                                          color: "#007bff",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => {
                                          const desc = document.getElementById(
                                            `desc-${index}`
                                          );
                                          const button =
                                            document.getElementById(
                                              `btn-${index}`
                                            );
                                          if (
                                            desc.style.WebkitLineClamp === "2"
                                          ) {
                                            desc.style.WebkitLineClamp =
                                              "unset"; // Expand the text
                                            button.textContent = "Read Less"; // Change button text to 'Read Less'
                                          } else {
                                            desc.style.WebkitLineClamp = "2"; // Collapse the text
                                            button.textContent = "Read More"; // Change button text to 'Read More'
                                          }
                                        }}
                                        id={`btn-${index}`} // Unique button ID
                                      >
                                        Read More
                                      </button>
                                    )}

                                  {/* Price Highlight */}
                                  <div className="d-flex justify-content-between align-items-center mt-2">
                                    <div>
                                      {item.price && (
                                        <span
                                          className="fw-bold"
                                          style={{
                                            color: "black",
                                            fontSize: "18px",
                                          }}
                                        >
                                          <span style={{ color: "blue" }}>
                                            Price:
                                          </span>{" "}
                                          ₹{item.price}
                                        </span>
                                      )}
                                    </div>
                                    {item?.link && (
                                      <Button
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="Visit to know more"
                                        target="_blank"
                                        href={
                                          item?.link.startsWith("http://") ||
                                          item?.link.startsWith("https://")
                                            ? item?.link
                                            : `https://${item?.link}` // Ensure the URL is absolute
                                        }
                                        className="btn btn-dark btn-sm"
                                      >
                                        View More
                                        <i
                                          style={{ transform: "rotate(90deg)" }}
                                          className="bi bi-arrow-right ms-1"
                                        ></i>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {(businessData?.service?.title ||
            businessData?.service?.description) && (
            <section
              className="h-auto"
              id="services"
              style={{ backgroundColor: "#F3F3F4" }}
            >
              <div className="container p-top">
                <div className="col-12 mb-5">
                  <div className="mt-5 text-center">
                    <div className="col-12">
                      <h1 className="text-center text-dark fw-bold david-font banner-title fs-45">
                        {businessData?.service?.title}
                      </h1>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col-12 col-lg-6">
                        <p className="text-secondary text-center mb-2">
                          {businessData?.service?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="row justify-content-center gap-3">
                    {businessData?.service?.data?.filter(
                      (dish) =>
                        dish.title ||
                        dish.description ||
                        dish.image ||
                        dish.link
                    ).length > 0 ? (
                      businessData.service.data.length > 2 ? (
                        <Slider {...setting2}>
                          {businessData?.service?.data.map((dish, index) =>
                            dish.title ||
                            dish.description ||
                            dish.image ||
                            dish.link ? (
                              <div
                                key={index}
                                className="dish-div col-12 text-center p-3"
                                style={{ transition: "all 0.3s ease" }}
                              >
                                <div className="col-12 position-relative text-center">
                                  <img
                                    src={
                                      dish.image?.length > 0
                                        ? dish.image
                                        : Placeholder
                                    }
                                    alt={dish.title}
                                    className="img-fluid"
                                    style={{
                                      width: "250px",
                                      maxWidth: "250px",
                                      objectFit: "cover",
                                      height: "300px",
                                    }}
                                  />
                                </div>
                                <div className="col-12">
                                  <h2 className="fs-20 fw-bold">
                                    {dish.title}
                                  </h2>
                                </div>
                                <div className="col-12 mt-3 mb-3">
                                  <p>
                                    {dish.description.length > 150 ? (
                                      <span>
                                        {dish.description.substring(0, 150)}
                                        ...
                                        <button
                                          onClick={(e) => {
                                            e.target.style.display = "none";
                                            const fullText =
                                              document.getElementById(
                                                `full-text-${index}`
                                              );
                                            fullText.style.display = "inline";
                                            fullText.parentElement.parentElement.parentElement.style.height =
                                              "auto"; // Dynamically increase card size
                                            const viewMoreButton =
                                              document.getElementById(
                                                `view-more-btn-${index}`
                                              );
                                            viewMoreButton.style.display =
                                              "block"; // Show View More
                                          }}
                                          className="btn btn-link p-0"
                                        >
                                          Read More
                                        </button>
                                        <span
                                          id={`full-text-${index}`}
                                          style={{ display: "none" }}
                                        >
                                          {dish.description.substring(150)}
                                        </span>
                                      </span>
                                    ) : (
                                      dish.description
                                    )}
                                  </p>
                                </div>
                                {dish?.link && (
                                  <div
                                    className="col-12 mt-3 mb-3 text-end"
                                    id={`view-more-btn-${index}`}
                                  >
                                    <Button
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="top"
                                      title="Visit to know more"
                                      target="_blank"
                                      href={dish?.link}
                                      className="btn btn-dark btn-sm d-inline-block"
                                    >
                                      View More
                                      <i
                                        style={{ transform: "rotate(90deg)" }}
                                        className="bi bi-arrow-right"
                                      ></i>
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ) : null
                          )}
                        </Slider>
                      ) : (
                        businessData.service.data.map((dish, index) =>
                          dish.title ||
                          dish.description ||
                          dish.image ||
                          dish.link ? (
                            <div
                              key={index}
                              className="dish-div col-12 col-lg-6 text-center p-3"
                              style={{ transition: "all 0.3s ease" }}
                            >
                              <div className="col-12 position-relative">
                                <img
                                  src={
                                    dish.image?.length > 0
                                      ? dish.image
                                      : Placeholder
                                  }
                                  alt={dish.title}
                                  style={{
                                    width: "100%",
                                    height: "300px",
                                    maxWidth: "250px",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                              <div className="col-12">
                                <h2 className="fs-20 fw-bold">{dish.title}</h2>
                              </div>
                              <div className="col-12 mt-3 mb-3">
                                <p>
                                  {dish.description.length > 150 ? (
                                    <span>
                                      {dish.description.substring(0, 150)}...
                                      <button
                                        onClick={(e) => {
                                          e.target.style.display = "none";
                                          const fullText =
                                            document.getElementById(
                                              `full-text-${index}`
                                            );
                                          fullText.style.display = "inline";
                                          fullText.parentElement.parentElement.parentElement.style.height =
                                            "auto"; // Dynamically increase card size
                                          const viewMoreButton =
                                            document.getElementById(
                                              `view-more-btn-${index}`
                                            );
                                          viewMoreButton.style.display =
                                            "block"; // Show View More
                                        }}
                                        className="btn btn-link p-0"
                                      >
                                        Read More
                                      </button>
                                      <span
                                        id={`full-text-${index}`}
                                        style={{ display: "none" }}
                                      >
                                        {dish.description.substring(150)}
                                      </span>
                                    </span>
                                  ) : (
                                    dish.description
                                  )}
                                </p>
                              </div>
                              {dish?.link && (
                                <div
                                  className="col-12 mt-3 mb-3 text-end"
                                  id={`view-more-btn-${index}`}
                                >
                                  <Button
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Visit to know more"
                                    target="_blank"
                                    href={dish?.link}
                                    className="btn btn-dark btn-sm d-inline-block"
                                  >
                                    View More
                                    <i
                                      style={{ transform: "rotate(90deg)" }}
                                      className="bi bi-arrow-right"
                                    ></i>
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : null
                        )
                      )
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* {(businessData?.service?.title ||
            businessData?.service?.description) && (
            <section
              className="h-auto david-font"
              style={{ backgroundColor: "#F3F3F4" }}
            >
              <div className="container p-top">
                <div className="col-12 mb-5">
                  <div className="row justify-content-center">
                    <div className="col-12 col-md-6 text-center">
                      <h1 className="text-dark fw-bold david-font banner-title fs-45">
                        {businessData?.service?.title}
                      </h1>
                    </div>
                    <div className="row justify-content-center">
                      <div className="col-12 col-lg-6">
                        <p className="text-secondary text-center mb-2">
                          {businessData?.service?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div
                    id="services"
                    className="col-12 mb-5 david-font row justify-content-center gap-3"
                  >
                    {businessData?.service?.data?.length > 2 ? (
                      <Slider {...setting2}>
                        {businessData?.service?.data?.map((dish, index) =>
                          dish.title ||
                          dish.description ||
                          dish.image ||
                          dish.link ? (
                            <div
                              key={index}
                              className="dish-div col-12 text-center p-3"
                            >
                              <div className="col-12 position-relative text-center">
                                <img
                                  src={
                                    dish?.image && dish?.image?.length > 0
                                      ? dish.image
                                      : Placeholder
                                  }
                                  alt={dish?.title}
                                  style={{
                                    width: "250px",
                                    height: "250px",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                              <div className="col-12">
                                <h2
                                  className="fs-20 fw-bold text-wrap"
                                  style={{
                                    wordBreak: "break-word",
                                    overflowWrap: "break-word",
                                  }}
                                >
                                  {dish.title}
                                </h2>
                              </div>
                              <div
                                className="col-12 mt-3 mb-3 text-wrap"
                                style={{
                                  wordBreak: "break-word",
                                  overflowWrap: "break-word",
                                }}
                              >
                                <p>{dish.description}</p>
                              </div>
                              {dish?.link && (
                                <div className="col-12 mt-3 mb-3 text-end">
                                  <Button
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Visit to know more"
                                    target="_blank"
                                    href={dish?.link}
                                    className="btn btn-dark btn-sm d-inline-block"
                                  >
                                    View More
                                    <i
                                      style={{ transform: "rotate(90deg)" }}
                                      className="bi bi-arrow-right"
                                    ></i>
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : null
                        )}
                      </Slider>
                    ) : (
                      businessData?.service?.data?.map((dish, index) =>
                        dish.title ||
                        dish.description ||
                        dish.image ||
                        dish.link ? (
                          <div
                            key={index}
                            className="dish-div col-12 col-lg-6 text-center p-3"
                          >
                            <div className="col-12 position-relative">
                              <img
                                src={
                                  dish.image && dish.image.length > 0
                                    ? dish.image
                                    : Placeholder
                                }
                                alt={dish.title}
                                className="img-fluid" // Bootstrap class to make the image responsive
                                style={{
                                  maxWidth: "100%", // Ensures the image scales to the container width
                                  height: "auto", // Maintains the aspect ratio of the image
                                  objectFit: "cover", // Keeps the image covering the space without distortion
                                }}
                              />
                            </div>
                            <div className="col-12">
                              <h2
                                className="fs-20 fw-bold text-wrap"
                                style={{
                                  wordBreak: "break-word",
                                  overflowWrap: "break-word",
                                  fontSize: "1.2rem", // Adjust font size for smaller screens
                                }}
                              >
                                {dish.title}
                              </h2>
                            </div>
                            <div className="col-12 mt-3 mb-3 text-wrap">
                              <p>{dish.description}</p>
                            </div>
                            {dish?.link && (
                              <div className="col-12 mt-3 mb-3 text-end">
                                <Button
                                  data-bs-toggle="tooltip"
                                  data-bs-placement="top"
                                  title="Visit to know more"
                                  target="_blank"
                                  href={dish?.link}
                                  className="btn btn-dark btn-sm d-inline-block"
                                >
                                  View More
                                  <i
                                    style={{ transform: "rotate(90deg)" }}
                                    className="bi bi-arrow-right"
                                  ></i>
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : null
                      )
                    )}
                  </div>
                </div>
              </div>
            </section>
          )} */}

          {businessData?.gallery?.some((image) =>
            image?.startsWith("https")
          ) && (
            <section className="bg-white">
              <div className="container p-top">
                <div className="row align-items-center">
                  <div className="col-10 col-md-12 mx-auto" id="gallery">
                    <div className="col-12 my-5">
                      <h1 className="fw-bold text-center">Gallery</h1>
                    </div>
                    <ResponsiveGalleryCarousel
                      galleryArray={businessData?.gallery.filter((image) =>
                        image?.startsWith("https")
                      )}
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="" style={{ backgroundColor: "#F3F3F4" }}>
            <div className="container david-font p-top">
              <div className="col-12 text-center">
                <h1>Reviews</h1>
              </div>
              <div className="col-12">
                <p className="text-center">
                  Take a look at genuine reviews and heartfelt testimonials that
                  highlight experiences, impressions, and the impact of our
                  work. Whether it’s about personal achievements or professional
                  services, these reviews reflect the trust and value we bring
                  to every interaction
                </p>
              </div>

              <div className="col-12">
                <Slider {...settings}>
                  {reviews?.map((testimonial, index) => (
                    <div key={index} className="testi-slide">
                      <div
                        className={`testi-div p-4 ${
                          index === currentSlide ? "testi-theme" : ""
                        }`}
                        style={{
                          backgroundColor:
                            index === currentSlide ? "#f0f8ff" : "#fff", // Light blue background for the active card
                          borderRadius: "12px", // Rounded corners
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Lighter shadow for premium feel
                          padding: "16px", // Reduced padding for smaller card height
                          transition:
                            "transform 0.3s ease-in-out, background-color 0.3s ease", // Smooth hover effect and background color transition
                          maxWidth: "100%", // Ensure card size is responsive
                          margin: "10px", // Add margin between cards
                          cursor: "pointer", // Indicating that it's interactive
                          transform: "scale(1)", // Default scale
                          minHeight: "250px", // Set the minHeight to 250px for further reduction
                          display: "flex",
                          flexDirection: "column", // Flexbox to manage content alignment
                          justifyContent: "space-between", // Space out elements evenly
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.05)")
                        } // Hover effect
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        } // Revert hover effect
                      >
                        <div className="row">
                          <div className="col-2">
                            <img
                              src="/images/user.png"
                              alt={testimonial?.name}
                              style={{
                                objectFit: "cover",
                                width: "40px", // Adjusted image size
                                height: "40px", // Adjusted image size
                                borderRadius: "50%",
                                border: "2px solid #ddd", // Premium border around the image
                              }}
                            />
                          </div>
                          <div className="col-10">
                            <h3
                              className="fs-20 p-0 m-0 ms-4"
                              style={{
                                fontSize: "16px", // Slightly smaller font size for name
                                fontWeight: "600",
                                color: "#333",
                                marginBottom: "4px", // Reduced margin
                              }}
                            >
                              {testimonial?.name}
                            </h3>
                            <div className="text-warning text-center mt-0 m-0">
                              {[...Array(5)].map((star, i) => {
                                const isFilled =
                                  i < Math.floor(testimonial?.rating);
                                return (
                                  <i
                                    key={i}
                                    className={`bi ${
                                      isFilled ? "bi-star-fill" : "bi-star"
                                    }`}
                                    style={{
                                      fontSize: "14px", // Reduced star size
                                      color: isFilled ? "#FFD700" : "#ddd",
                                      transition: "color 0.3s ease", // Smooth color transition for stars
                                    }}
                                  ></i>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="col-12 mt-3">
                          <p
                            style={{
                              maxHeight: "60px", // Shortened max height for the review text
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2, // Truncate after 2 lines
                              WebkitBoxOrient: "vertical",
                              fontSize: "14px", // Smaller font size for review text
                              color: "#555", // Slightly lighter text color
                              lineHeight: "1.4",
                              fontFamily: '"Roboto", sans-serif', // Modern font for better readability
                              fontWeight: "400",
                            }}
                          >
                            {testimonial?.review}
                          </p>
                        </div>
                        <div className="col-12 mt-2">
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#999",
                              fontStyle: "italic",
                              textAlign: "right", // Align date to the right for a clean look
                              marginTop: "4px",
                            }}
                          >
                            {formatDate(testimonial?.createdAt ?? "")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
                {reviewCount > 4 && (
                  <div className="text-center mt-3 mb-5">
                    <a
                      href="#reviews"
                      className="text-decoration-none text-theme2"
                    >
                      View more <i className="bi bi-arrow-right"></i>
                    </a>
                  </div>
                )}
              </div>
              <div className="col-12">
                <div className="col-12 text-center mb-3">
                  <button
                    className="btn btn-dark text-white radius-theme box-shadow theme mt-5"
                    onClick={() => setVisible(true)}
                  >
                    Write Review
                  </button>
                </div>
              </div>
            </div>
          </section>
          <Dialog
            header="Write a Review"
            visible={visible}
            onHide={() => {
              if (!visible) return;
              setVisible(false);
            }}
            style={{
              minWidth: "50vw",
              borderRadius: "12px",
              overflow: "hidden",
            }}
            breakpoints={{ "960px": "75vw", "641px": "100vw" }}
          >
            <div className="container ">
              <form onSubmit={handleReviewSubmit}>
                <div className=" mb-3 d-flex justify-content-center">
                  <Rating
                    name="simple-controlled"
                    value={review.rating}
                    color="warning"
                    onChange={(event, newValue) => {
                      setReview({ ...review, rating: newValue });
                    }}
                  />
                </div>

                <div className="">
                  <InputText
                    keyfilter="text"
                    placeholder="Full Name"
                    className="w-100"
                    value={review.name}
                    name="name"
                    required
                    onChange={handleInputChange}
                  />
                </div>

                {/* Description Input Field */}
                <div className=" mt-3">
                  <div className="w-100 d-flex justify-content-center">
                    <InputTextarea
                      value={review.review} // Bind the description from state
                      onChange={handleInputChange} // Update description in state
                      rows={5}
                      cols={30}
                      name="review" // Important: use `name` for targeting in handleInputChange
                      placeholder="Write your review here..."
                      className="w-100"
                    />
                  </div>
                </div>

                <div className="col-12 mt-3 text-center">
                  {reviewLoading ? (
                    <div
                      className="spinner-border"
                      style={{ color: businessData?.theme }}
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="btn-theme2 btn  theme radius  "
                    >
                      Submit Review
                    </button>
                  )}
                </div>
              </form>
            </div>
          </Dialog>
          <div id="contact">
            <ContactForm
              handleFormSubmit={handleFormSubmit}
              businessData={businessData}
            />
          </div>

          <section className="h-auto david-font">
            <div className="container p-top">
              <div className="col-12 newsletter position-relative">
                <img
                  src="/images/newsImage1.jpg"
                  alt=""
                  className="w-100  rounded"
                />
                <div className=" text-center newsletter-content position-absolute">
                  <div className="d-none d-lg-block">
                    <h2 className="fs-43 mb-3 fw-bold text-black">
                      Create Your Own Business <br />
                      Subscribing To Our Newsletter
                    </h2>
                    <div className="row bg-white align-items-center input-div p-2">
                      <div className="col-lg-8">
                        <input
                          type="email"
                          placeholder="Enter Your Email"
                          style={{ border: "0 !important" }}
                          required
                          value={newsLetterEmail}
                          onChange={(e) =>
                            setNewsLetterEmail(e.target?.value?.trim())
                          }
                          onInvalid={(e) =>
                            e.target.setCustomValidity(
                              "Please enter a valid email address"
                            )
                          }
                          onInput={(e) => e.target.setCustomValidity("")}
                          className="form-control form-control-lg"
                        />
                      </div>
                      <div className="col-lg-4">
                        <button
                          onClick={handleNewsLetterSubmit}
                          className="btn theme btn-lg w-100"
                        >
                          Subscribe
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="d-block d-lg-none">
                    <div className="d-flex flex-column align-items-center">
                      <h2 className="fs-16 fw-bold text-white text-center mb-3">
                        Create Your Own Business <br />
                        Subscribing To Our Newsletter
                      </h2>
                      <div className="row w-100">
                        <div className="col-7">
                          <input
                            type="email"
                            placeholder="Enter Your Email"
                            style={{
                              border: "0 !important",
                              fontSize: "14px", // For input text size
                            }}
                            required
                            value={newsLetterEmail}
                            onChange={(e) =>
                              setNewsLetterEmail(e.target?.value)
                            }
                            onInvalid={(e) =>
                              e.target.setCustomValidity(
                                "Please enter a valid email address"
                              )
                            }
                            onInput={(e) => e.target.setCustomValidity("")}
                            className="form-control form-control-lg placeholder-small"
                          />
                        </div>
                        <div className="col-5">
                          <button
                            style={{
                              fontSize: "16px",
                              paddingBottom: "10px",
                              paddingLeft: "10px",
                              paddingTop: "10px",
                              paddingRight: "10px",
                            }}
                            onClick={handleNewsLetterSubmit}
                            className="btn theme btn-lg w-100"
                          >
                            Subscribe
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <footer className="h-auto">
        <div className="container pjs  p-top">
          <div className="mt-1">
            <div className="row">
              <div className="col-12 col-lg-3">
                <div className="col-12 d-block d-lg-flex text-center text-lg-start text mt-5">
                  <div className="nav-logo width-fit">
                    <img
                      src={
                        businessData?.logo && businessData?.logo.length > 0
                          ? businessData?.logo
                          : Placeholder
                      }
                      alt=""
                    />
                  </div>
                  <span className="ms-2 fs-30 text-white">
                    {businessData?.businessName}
                  </span>
                </div>
                <div
                  className="col-12 mt-4  text-center text-lg-start"
                  style={{ color: "#A4B3CB" }}
                >
                  <p>{businessData?.description}</p>
                </div>
              </div>

              <div className="col-12 col-lg-2">
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
                      Home
                    </a>
                  </div>
                  <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                    <a
                      href="#about"
                      className="fs-14 text-decoration-none"
                      style={{ color: "#A4B3CB" }}
                    >
                      About Us
                    </a>
                  </div>
                  <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                    <a
                      href="#contact"
                      className="fs-14 text-decoration-none"
                      style={{ color: "#A4B3CB" }}
                    >
                      Contact Us
                    </a>
                  </div>
                  <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                    <a
                      href="#gallery"
                      className="fs-14 text-decoration-none"
                      style={{ color: "#A4B3CB" }}
                    >
                      Gallery
                    </a>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-2">
                <div className="row mt-5">
                  <div className="col-lg-6">
                    <div className="col-12">
                      <div className="col-12 mb-3 text-center text-lg-start">
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
                        {businessData?.businessTiming?.workingDays?.map(
                          (day, index) => (
                            <p key={index}>{day}</p>
                          )
                        )}
                      </div>
                      <div
                        className="mt-3 text-center text-lg-start"
                        style={{ color: "#A4B3CB" }}
                      >
                        <span>{`${convertTo12HourFormat(
                          businessData?.businessTiming?.time?.open
                        )} to ${convertTo12HourFormat(
                          businessData?.businessTiming?.time?.close
                        )}`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-3">
                <div className="col-12 mt-5">
                  <div className="col-12 mt-3 mb-3 text-center text-lg-start">
                    <a
                      href="#"
                      className=" fs-14 text-decoration-none text-orange"
                    >
                      FOLLOW US
                    </a>
                  </div>

                  <div className="mt-5 col-12 row gap-3 jcc-md text-center text-lg-start">
                    {businessData?.socialMediaLinks?.map((social) => (
                      <>
                        <a
                          href={social?.link}
                          target="_blank"
                          className="contact-banner text-dark "
                        >
                          <i
                            className={`bi bi-${social?.tag} text-5xl sm:text-2xl`}
                          ></i>
                        </a>
                      </>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-12">
                <hr style={{ width: "100%", opacity: 0.25, color: "white" }} />
                <div className="footer-bottom">
                  <div className="row w-full justify-content-between">
                    <div className="col-sm-4 text-left">
                      <a href={`/terms-and-conditions/${id}`}>
                        Terms and Conditions
                      </a>
                    </div>
                    <div className="col-sm-4 text-right">
                      <div style={{ color: "#A4B3CB" }} className="text-right">
                        <span>
                          Copyright &copy;
                          {new Date().getFullYear()} En Connect. All Rights
                          Reserved
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <a
        href="#"
        className="btn   justify-content-center align-items-center d-none  d-sm-none d-lg-flex bg-transparent rounded-circle  back-to-top2"
      >
        <i className="bi bi-arrow-up"></i>
      </a>
      <a
        href="#"
        className="btn  justify-content-center align-items-center d-flex d-sm-flex d-lg-none d-xl-none  bg-transparent rounded-circle back-to-top1"
      >
        <i className="bi bi-arrow-up"></i>
      </a>
    </>
  );
}
