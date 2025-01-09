import React, { useEffect, useState } from 'react'
import { Carousel, Container, Nav, Navbar, NavLink } from 'react-bootstrap'
import '/src/assets/css/template.css'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { Dialog } from 'primereact/dialog'
import Rating from '@mui/material/Rating'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import ContactForm from '/src/components/Business/contactForm'
import { toast } from 'react-toastify'

import { formatDate } from '../../../utils/app.utils'
import Loader from '../../../components/Loader/Loader'
import NewsArticles from '../../../containers/NewsArticles'
import BusinessReviews from '../../../containers/BusinessReviews'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

let items = document?.querySelectorAll('.carousel .carousel-item')



items.forEach((el) => {
  const minPerSlide = 4
  let next = el.nextElementSibling
  for (var i = 1; i < minPerSlide; i++) {
    if (!next) {
      // wrap carousel by using first child
      next = items[0]
    }
    let cloneChild = next.cloneNode(true)
    el.appendChild(cloneChild.children[0])
    next = next.nextElementSibling
  }
})

export default function PreviewTemplates() {

  const businessState= useSelector((state)=>state.business)

 
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showNews, setShowNews] = useState(false)
  const [businessData, setBusinessData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [colorTheme, setColorTheme] = useState('')
  const [visible, setVisible] = useState(false)
  const [reviewFetch, setreviewFetch] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [textColor, setTextColor] = useState('');

const navigate=useNavigate()
useEffect(()=>{
  setBusinessData(businessState)
},[])

  const [review, setReview] = useState({
    rating: '',
    name: '',
    review: '',
  })
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [reviews, setReviews] = useState([])
  const [reviewCount, setReviewCount] = useState(0)

  const [closeDays, setCloseDays] = useState([])
  const allDays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]

  const [isTruncated, setIsTruncated] = useState(true)



  const convertTo12HourFormat = (time = '') => {
    // Split the time into hours and minutes
    let [hours, minutes] = time.split(':').map(Number)

    // Determine if it's AM or PM
    let amOrPm = hours >= 12 ? 'PM' : 'AM'

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12 || 12

    // Format the time string
    return `${hours}:${minutes?.toString()?.padStart(2, '0')
      ? minutes?.toString()?.padStart(2, '0')
      : `00`
      } ${amOrPm}`
  }

  // Function to truncate text after a specified character limit
  const truncateText = (text, limit = 100) => {
    if (text?.length > limit && isTruncated) {
      return text.slice(0, limit) + ''
    }
    return text
  }

  // Toggle the truncation state when clicked
  const toggleTruncation = () => {
    setIsTruncated(!isTruncated)
  }

  const [newsLetterEmail, setNewsLetterEmail] = useState('')



  const handleCreateBusiness = async () => {
   
    // e.preventDefault()
    // const response = await CreateBusinessDetails(formData)
    // if (response?.data) {
    //   window.location.href = template/${response?.data?._id}
    //   // navigate(template${response?.data?._id})
    // }

    navigate("/create-business/payment");
  };

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (window?.location?.hash == '#news') {
      setShowNews(true)
    } else {
      setShowNews(false)
    }
    if (window?.location?.hash == '#reviews') {
      setShowAllReviews(true)
    } else {
      setShowAllReviews(false)
    }
  }, [window?.location?.hash])

  const handleNewsLetterSubmit = async (e) => {
    e.preventDefault()
    console.log('newsLetterEmail', newsLetterEmail)

    const response = await submitNewsLetter({
      email: newsLetterEmail,
    })
    if (response?.data) {
      toast.success('Subscribed successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
        style: {
          backgroundColor: '#38a20e', // Custom red color for error
          color: '#FFFFFF', // White text
        },
      })
      setNewsLetterEmail('')
    } else {
      toast.success('Failed to Subscribe!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
        style: {
          backgroundColor: '#aa0808', // Custom red color for error
          color: '#FFFFFF', // White text
        },
      })
    }
  }




  const handleReviewSubmit = (e) => {
    e.preventDefault()
    console.log(review, 'review')
    setReviewLoading(true)

   
      .then((response) => {
        setReviewLoading(false)
        setReview({
          rating: '',
          name: '',
          review: '',
        })
        if (response?.data) {
          toast.success('Thank you for your review!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'colored',
            style: {
              backgroundColor: '#38a20e', // Custom red color for error
              color: '#FFFFFF', // White text
            },
          })
          setreviewFetch(!reviewFetch)
          setVisible(false)
        }
      })
      .catch((err) => {
        setReview({
          rating: '',
          name: '',
          review: '',
        })
        setReviewLoading(false)
        console.log(err.message)
      })
  }

  
  const getContrastingColor = (hexColor) => {
    // Remove '#' if present
    const color = hexColor.replace('#', '');

    // Convert to RGB
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);

    // Calculate brightness
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b);

    // Return black or white based on brightness
    return brightness > 186 ? '#000000' : '#FFFFFF'; // Adjust threshold if needed
  };

  const settings = {
    dots: false,
    infinite: !reviews?.length,
    autoplay: true,
    arrows: false,
    // centerMode: true,
    speed: 500,
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
  }
  const setting2 = {
    dots: false,
    infinite: businessData?.service?.length > 3, // Infinite scroll only for more than 3 items
    autoplay: true,
    arrows: false,
    speed: 500,
    slidesToShow:
      businessData?.service?.length <= 3 ? businessData?.service?.length : 2, // Dynamic slidesToShow
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow:
            businessData?.service?.length <= 3 ? businessData?.service?.length : 3,
          slidesToScroll: 1,
          infinite: businessData?.service?.length > 3,
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


  const settings3 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    // centerMode: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
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
  }

  const gallery = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
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
    ],
  }

  // if (loading) {
  //   return (
  //     <div className="h-100vh text-center ">
  //       <div className="row h-100 justify-content-center align-items-center">
  //         <div className="col-3 "> {loading && <Loader />}</div>
  //       </div>
  //     </div>
  //   )
  // }

  // If there's no business data (e.g., fetch failed), show an error message
  if (!businessData) {
    return (
      <>
        <Navbar
          expand="lg"
          className="bg-white pjs fixed-top"
          style={{ paddingBlock: '5px' }}
        >
          <Container>
            {/* Back button for large screens (before the logo) */}
          

            {/* Align Brand to the start (left side) */}
            <Navbar.Brand
              href="#"
              className="fw-bold w-50 nav-logo"
              style={{ fontSize: '36px' }}
            >
              <img
                src={
                  businessData?.logo && businessData?.logo.length > 0
                    ? businessData?.logo
                    : 'Placeholder'
                }
                alt={businessData?.businessName || 'Logo Placeholder'}
              />
              <span className="ms-2">{businessData?.businessName}</span>
            </Navbar.Brand>

            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              style={{ color: 'black' }}
            />

            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto w-100 justify-content-evenly jcc">
                <NavLink
                  href="#"
                  className="text-black text-center text-lg-start text-decoration-none fs-14"
                  style={{ color: 'black' }}
                >
                  Home
                </NavLink>
                <NavLink
                  href="#about"
                  className="text-black text-center text-lg-start text-decoration-none fs-14"
                  style={{ color: 'black' }}
                >
                  About
                </NavLink>
                <NavLink
                  href="#gallery"
                  className="text-black text-center text-lg-start text-decoration-none fs-14"
                  style={{ color: 'black' }}
                >
                  Gallery
                </NavLink>
                <NavLink
                  href="#contact"
                  className="text-black text-center text-lg-start text-decoration-none fs-14"
                  style={{ color: 'black' }}
                >
                  Contact
                </NavLink>
                <NavLink
                  href="#news"
                  onClick={(e) => setShowNews(true)}
                  className="text-black text-center text-lg-start text-decoration-none fs-14"
                  style={{ color: 'black' }}
                >
                  News
                </NavLink>
                <NavLink
                  href="#services"
                  onClick={handleCreateBusiness}
                  style={{
                    backgroundColor: '#105193',
                    color: 'white',
                    borderRadius: '10px 0px',
                    padding: '8px 20px',
                    fontSize: '13px',
                    boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.15)',
                  }}
                  className="fw-bold text-decoration-none text-black text-center text-lg-start"
                >
                 Confirm & Next
                </NavLink>
                {/* <NavLink
                onClick={handleCreateBusiness}
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
                
              </NavLink> */}
                {/* Back button for smaller screens (inside menu items) */}
                
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <section className="h-auto">
          <div
            className="container p-top"
            style={{
              height: '100vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                color: '#1D4ED8', // Tailwind [#107D93]
                fontSize: '20px', // Slightly larger font size for premium feel
                textAlign: 'center',
                fontWeight: '500', // Medium font weight
                fontFamily: "'Inter', sans-serif", // Premium standard font
              }}
            >
              Error loading business data.
            </div>
          </div>
        </section>
      </>
    )
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
        {' '}
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
        expand="lg"
        className="bg-white pjs fixed-top"
        style={{ paddingBlock: '5px' }}
      >
      
        <Container>
          {/* Back button for large screens (before the logo) */}

          {/* Align Brand to the start (left side) */}
          <Navbar.Brand
            href="#"
            className="fw-bold w-50 nav-logo"
            style={{ fontSize: '36px' }}
          >
            <img
              src={
                businessData?.logo && businessData?.logo.length > 0
                  ? businessData?.logo
                  : 'Placeholder'
              }
              alt={businessData?.businessName || 'Logo Placeholder'}
            />
            <span className="ms-2">{businessData?.businessName}</span>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            style={{ color: 'black' }}
          />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto w-100 justify-content-evenly jcc">
              <NavLink
                href="#"
                className="text-black text-center text-lg-start text-decoration-none fs-14"
                style={{ color: 'black' }}
              >
                Home
              </NavLink>
              <NavLink
                href="#about"
                className="text-black text-center text-lg-start text-decoration-none fs-14"
                style={{ color: 'black' }}
              >
                About
              </NavLink>
              <NavLink
                href="#gallery"
                className="text-black text-center text-lg-start text-decoration-none fs-14"
                style={{ color: 'black' }}
              >
                Gallery
              </NavLink>
              <NavLink
                href="#contact"
                className="text-black text-center text-lg-start text-decoration-none fs-14"
                style={{ color: 'black' }}
              >
                Contact
              </NavLink>
              <NavLink
                href="#news"
                onClick={(e) => setShowNews(true)}
                className="text-black text-center text-lg-start text-decoration-none fs-14"
                style={{ color: 'black' }}
              >
                News
              </NavLink>
             
               <NavLink
                onClick={handleCreateBusiness}
                style={{
                  backgroundColor: 'black',
                  color: "white",
                  borderRadius: "10px 0px",
                  padding: "8px 20px",
                  fontSize: "13px",
                  boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.15)",
                }}
                className="fw-bold text-decoration-none text-center text-lg-start"
              >
                Confirm & Next
              </NavLink>
              

              {/* Back button for smaller screens (inside menu items) */}
             
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
          colorTheme={colorTheme}
        />
      )}

      {!showAllReviews && !showNews && (
        <>
          <section className="h-auto">
            <div className="container">
              <div className="row align-items-center banner-section">
                {/* Left Image for Mobile View */}
                <div className="col-12 col-lg-6 text-center text-lg-end d-block d-lg-none">
                  <img
                    src={
                      businessData?.landingPageHero?.coverImage &&
                        businessData?.landingPageHero?.coverImage?.length > 0
                        ? businessData?.landingPageHero?.coverImage
                        : 'PlaceholderBanner'
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
                          100,
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
                            to="#about"
                            className="btn btn-dark text-white radius-theme box-shadow w-100 p-1"
                            style={{ backgroundColor: '#212529' }}
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
                        : 'PlaceholderBanner'
                    }
                    alt=""
                    className="banner-image"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="mt-2 mb-3 sm:mt-0 sm:mb-0">
            <div className="container px-4 sm:px-0">
              <div className="col-12 address-section">
                <div className="row justify-content-between">
                  {/* Address Section */}
                  <div className="col-12 col-sm-4 mb-3 mb-sm-0">
                    <div className="row align-items-center justify-content-start">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${businessData.address.buildingName}, ${businessData.address.city}, ${businessData.address.landMark}, ${businessData.address.streetName}, ${businessData.address.state}`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none text-dark"
                      >
                        <div className="row">
                          <div className="col-auto address-logo">
                            <i className="bi bi-geo-alt-fill text-2xl sm:text-lg" />
                          </div>
                          <div className="col">
                            <span className="fs-12 sm:fs-10" style={{ color: textColor }}>Address</span>
                            <p
                              style={{ color: textColor, textDecoration: 'none' }}

                              className="fs-14 sm:fs-12">{`${businessData.address.buildingName}, ${businessData.address.city}, ${businessData.address.landMark}, ${businessData.address.streetName}, ${businessData.address.state}`}</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Email Section */}
                  <div className="col-12 col-sm-4 mb-3 mb-sm-0">
                    <div className="row align-items-center justify-content-start">
                      <div className="col-auto address-logo">
                        <i className="bi bi-envelope-fill text-2xl sm:text-lg" />
                      </div>
                      <div className="col">
                        <a
                          href={`mailto:${businessData?.contactDetails?.email}`}
                          className="text-decoration-none text-dark"
                        >
                          <span className="fs-12 sm:fs-10 " style={{ color: textColor }}>Send Email</span>
                          <p className="fs-14 sm:fs-12"
                            style={{ color: textColor, textDecoration: 'none' }}
                          >
                            {businessData?.contactDetails?.email}
                          </p>
                        </a>
                        
                      </div>
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div className="col-12 col-sm-4 mb-3 mb-sm-0">
                    <div className="row align-items-center justify-content-start">
                      <div className="col-auto address-logo">
                        <i className="bi bi-telephone text-2xl sm:text-lg" />
                      </div>
                      <div className="col">
                        <span className="fs-12 sm:fs-10" style={{ color: textColor }}>
                          Contact
                        </span>
                        <p className="fs-14 sm:fs-12 mb-0">
                          <a
                            style={{ color: textColor, textDecoration: 'none' }}
                            href={`tel:${businessData?.contactDetails?.primaryNumber}`}
                          >
                            {businessData?.contactDetails?.primaryNumber}
                          </a>
                        </p>
                        <p className="fs-14 sm:fs-12 mt-0">
                          <a
                            style={{ color: textColor, textDecoration: 'none' }}
                            href={`tel:${businessData?.contactDetails?.secondaryNumber}`}
                          >
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
            className=" h-auto"
            style={{ backgroundColor: '#F3F3F4' }}
            id="about"
          >
            <div className="container p-top">
              <div className="row mt-5 align-items-center mb-5">
                <div className="col-12 col-lg-6 mt-2 text-center text-lg-start about-image">
                  <img
                    src={businessData?.welcomePart?.coverImage ?? 'Placeholder'}
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

          <section
            className="h-auto"
            id="services"
            style={{ backgroundColor: '#F3F3F4' }}
          >
            <div className="container p-top">
              <div className="col-12 mb-5">
                <div className="mt-5 text-center">
                  <div className="col-12">
                    <h1 className="text-center text-dark fw-bold david-font fw-bold banner-title fs-45">
                      {businessData?.specialServices?.title}
                    </h1>
                  </div>
                  <div className="row justify-content-center">
                    <div className="col-12 col-lg-6 ">
                      <p className="text-secondary text-center mb-2">
                        {businessData?.specialServices?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="col-12 mb-5 david-font row justify-content-center gap-3">
                  {businessData.specialServices.data.length > 2 ? (
                    <Slider {...settings}>
                      {businessData?.specialServices?.data.map(
                        (dish, index) => (
                          <div
                            key={index}
                            className="dish-div col-12 text-center p-3"
                          >
                            <div className="col-12 position-relative text-center">
                              <img
                                src={
                                  dish.image && dish.image.length > 0
                                    ? dish.image
                                    : 'Placeholder'
                                }
                                alt={dish.title}
                                style={{
                                  width: '300px',
                                  height: '300px',
                                  objectFit: 'cover',
                                }}
                              />
                            </div>
                            <div className="col-12">
                              <h2 className="fs-20 fw-bold">{dish.title}</h2>
                            </div>
                            <div className="col-12 mt-3 mb-3">
                              <p>{dish.description}</p>
                            </div>
                          </div>
                        ),
                      )}
                    </Slider>
                  ) : (
                    businessData.specialServices.data.map((dish, index) => (
                      <div
                        key={index}
                        className="dish-div col-12 col-lg-6 text-center p-3"
                      >
                        <div className="col-12 position-relative">
                          <img
                            src={
                              dish.image && dish.image.length > 0
                                ? dish.image
                                : 'Placeholder'
                            }
                            alt={dish.title}
                            style={{
                              width: '100%',
                              height: 'auto',
                              maxWidth: '300px',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                        <div className="col-12">
                          <h2 className="fs-20 fw-bold">{dish.title}</h2>
                        </div>
                        <div className="col-12 mt-3 mb-3">
                          <p>{dish.description}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
          <section className="bg-white h-auto david-font" id="menu">
            <div className="container  p-top">
              <div className="col-12 mb-5">
                <div className="row justify-content-center">
                  <div className="col-12 col-md-6 text-center">
                    <h1 className="text-dark fw-bold david-font banner-title fs-45">
                      {businessData?.productSection?.title}
                    </h1>
                  </div>
                  <div className="row justify-content-center">
                    <div className="col-12 col-lg-6 ">
                      <p className="text-secondary text-center mb-2">
                        {businessData?.productSection?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 david-font">
                <div className="mb-5">
                  <div className="row mb-3">
                    {businessData?.productSection?.data?.map((item, index) => (
                      <div
                        className="col-12 col-lg-6 mt-3 mx-auto "
                        style={{ padding: '0 30px' }}
                        key={index}
                      >
                        <div className="row  product-section align-items-center">
                          <div className="col-2">
                            <img
                              src={
                                item.image && item.image.length > 0
                                  ? item.image
                                  : 'Placeholder'
                              }
                              alt=""
                              className="w-100"
                            />
                          </div>
                          <div className="col-8">
                            <h1 className="fs-20 fw-bold">{item.title}</h1>
                            <p className="mt-2">{item.description}</p>
                          </div>
                          <div className="col-2 p-0">

                            <span className="fw-bold">{item.price ? 'Price : ₹' : ' '}</span>
                            <span className="fw-bold">{item.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section
            className="h-auto david-font"
            style={{ backgroundColor: '#F3F3F4' }}
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
                    <div className="col-12 col-lg-6 ">
                      <p className="text-secondary text-center mb-2">
                        {businessData?.service?.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="col-12 mb-5 david-font row justify-content-center gap-3">
                  {businessData?.service?.data?.length > 2 ? (
                    <Slider {...setting2}>
                      {businessData?.service?.data?.map((dish, index) => (
                        <div
                          key={index}
                          className="dish-div col-12 text-center p-3"
                        >
                          <div className="col-12 position-relative text-center">
                            <img
                              src={
                                dish?.image && dish?.image?.length > 0
                                  ? dish.image
                                  : 'Placeholder'
                              }
                              alt={dish?.title}
                              style={{
                                width: '300px',
                                height: '300px',
                                objectFit: 'cover',
                              }}
                            />
                          </div>
                          <div className="col-12">
                            <h2
                              className="fs-20 fw-bold text-wrap"
                              style={{
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                              }}
                            >
                              {dish.title}
                            </h2>
                          </div>
                          <div
                            className="col-12 mt-3 mb-3 text-wrap"
                            style={{
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                            }}
                          >
                            <p>{dish.description}</p>
                          </div>
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    businessData?.service?.data?.map((dish, index) => (
                      <div
                        key={index}
                        className="dish-div col-12 col-lg-6 text-center p-3"
                      >
                        <div className="col-12 position-relative">
                          <img
                            src={
                              dish.image && dish.image.length > 0
                                ? dish.image
                                : 'Placeholder'
                            }
                            alt={dish.title}
                            style={{
                              width: '100%',
                              height: 'auto',
                              maxWidth: '300px',
                              objectFit: 'cover',
                            }}
                          />
                        </div>
                        <div className="col-12">
                          <h2
                            className="fs-20 fw-bold text-wrap"
                            style={{
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                            }}
                          >
                            {dish.title}
                          </h2>
                        </div>
                        <div
                          className="col-12 mt-3 mb-3 text-wrap"
                          style={{
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                          }}
                        >
                          <p>{dish.description}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="col-12  mb-5" id="gallery">
                <div className="col-12 mb-5 mt-5">
                  <h1 className="fw-bold text-center">Gallery</h1>
                </div>
                <Carousel controls={false} touch={true} indicators={false}>
                  <Carousel.Item interval={1000}>
                    <div className="row">
                      {businessData?.gallery
                        ?.slice(0, 3)
                        .map((image, index) => (
                          <div key={index} className="col-4">
                            <img
                              src={
                                image && image.length > 0 ? image : 'Placeholder'
                              }
                              alt=""
                              className="w-100 gallery-img"
                            />
                          </div>
                        ))}
                    </div>
                  </Carousel.Item>

                  {/* Repeat for next items if you want to show more images */}
                  {businessData?.gallery?.slice(3).map((image, index) => (
                    <Carousel.Item key={index} interval={1000}>
                      <div className="row">
                        {businessData?.gallery
                          .slice(index * 3, (index + 1) * 3)
                          .map((image, subIndex) => (
                            <div key={subIndex} className="col-4">
                              <img
                                src={
                                  image && image.length > 0
                                    ? image
                                    : 'Placeholder'
                                }
                                alt=""
                                className="w-100 gallery-img"
                              />
                            </div>
                          ))}
                      </div>
                    </Carousel.Item>
                  ))}
                </Carousel>

                {/* <Slider {...gallery} className="gallery-slider">
               
              </Slider> */}
              </div>
            </div>
          </section>
          <section className="bg-white d-none">
            <div className="container p-top">
              <div className="row align-items-center">
                <div className="col-12 col-lg-6 row align-items-center">
                  <div>
                    <div className="col-12 text-center text-lg-start">
                      <h1 className="fw-bold fs-45">Our Expert Chef</h1>
                    </div>
                    <div className="col-12 text-center text-lg-start">
                      <p className="fs-25">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed non neque elit. Sed ut tellus ac neque fermentum
                        tristique. Donec sed facilisis tellus, a vulputate
                        turpis. Duis eget turpis non tellus tincidunt fermentum.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 col-12 mb-5">
                    <div className="row">
                      <div className="menu-button">
                        <button className="btn btn-dark text-white radius-theme box-shadow w-100">
                          Menu
                        </button>
                      </div>
                      <div className="book-a-table">
                        <button className="btn btn-dark text-white radius-theme box-shadow theme w-100">
                          Book a table
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <div className="col-12 text-center">
                    <img
                      src="/images/chef.png"
                      alt=""
                      className="chef-div img-fluid w-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="" style={{ backgroundColor: '#F3F3F4' }}>
            <div className="container david-font p-top">
              <div className="col-12 text-center">
                <h1>Reviews</h1>
              </div>
              <div className="col-12">
                <p className="text-center">
                  At Our Restaurant, we strive to provide the best dining
                  experience possible. Our loyal customers have been satisfied
                  with our culinary skills, service, and overall ambiance. Our
                  positive feedback has helped us continuously improve our
                  dining experience. If you're a loyal customer, we'd love to
                  hear from you!
                </p>
              </div>

              <div className="col-12">
                <Slider {...settings}>
                  {reviews?.map((testimonial, index) => (
                    <div key={index} className="testi-slide">
                      <div
                        className={`testi-div p-4 ${index === currentSlide ? 'testi-theme' : ''
                          }`}
                        style={{
                          backgroundColor:
                            index === currentSlide ? '#f0f8ff' : '#fff', // Light blue background for the active card
                          borderRadius: '12px', // Rounded corners
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Lighter shadow for premium feel
                          padding: '16px', // Reduced padding for smaller card height
                          transition:
                            'transform 0.3s ease-in-out, background-color 0.3s ease', // Smooth hover effect and background color transition
                          maxWidth: '100%', // Ensure card size is responsive
                          margin: '10px', // Add margin between cards
                          cursor: 'pointer', // Indicating that it's interactive
                          transform: 'scale(1)', // Default scale
                          minHeight: '250px', // Set the minHeight to 250px for further reduction
                          display: 'flex',
                          flexDirection: 'column', // Flexbox to manage content alignment
                          justifyContent: 'space-between', // Space out elements evenly
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = 'scale(1.05)')
                        } // Hover effect
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = 'scale(1)')
                        } // Revert hover effect
                      >
                        <div className="row">
                          <div className="col-2">
                            <img
                              src="/images/user.png"
                              alt={testimonial?.name}
                              style={{
                                objectFit: 'cover',
                                width: '40px', // Adjusted image size
                                height: '40px', // Adjusted image size
                                borderRadius: '50%',
                                border: '2px solid #ddd', // Premium border around the image
                              }}
                            />
                          </div>
                          <div className="col-10">
                            <h3
                              className="fs-20 p-0 m-0 ms-4"
                              style={{
                                fontSize: '16px', // Slightly smaller font size for name
                                fontWeight: '600',
                                color: '#333',
                                marginBottom: '4px', // Reduced margin
                              }}
                            >
                              {testimonial?.name}
                            </h3>
                            <div className="text-warning text-center mt-0 m-0">
                              {[...Array(5)].map((star, i) => {
                                const isFilled =
                                  i < Math.floor(testimonial?.rating)
                                return (
                                  <i
                                    key={i}
                                    className={`bi ${isFilled ? 'bi-star-fill' : 'bi-star'
                                      }`}
                                    style={{
                                      fontSize: '14px', // Reduced star size
                                      color: isFilled ? '#FFD700' : '#ddd',
                                      transition: 'color 0.3s ease', // Smooth color transition for stars
                                    }}
                                  ></i>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="col-12 mt-3">
                          <p
                            style={{
                              maxHeight: '60px', // Shortened max height for the review text
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2, // Truncate after 2 lines
                              WebkitBoxOrient: 'vertical',
                              fontSize: '14px', // Smaller font size for review text
                              color: '#555', // Slightly lighter text color
                              lineHeight: '1.4',
                              fontFamily: '"Roboto", sans-serif', // Modern font for better readability
                              fontWeight: '400',
                            }}
                          >
                            {testimonial?.review}
                          </p>
                        </div>
                        <div className="col-12 mt-2">
                          <p
                            style={{
                              fontSize: '12px',
                              color: '#999',
                              fontStyle: 'italic',
                              textAlign: 'right', // Align date to the right for a clean look
                              marginTop: '4px',
                            }}
                          >
                            {formatDate(testimonial?.createdAt ?? '')}
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
              if (!visible) return
              setVisible(false)
            }}
            style={{
              minWidth: '50vw',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
            breakpoints={{ '960px': '75vw', '641px': '100vw' }}
          >
            <div className="container ">
              <form>
                <div className=" mb-3 d-flex justify-content-center">
                  <Rating
                    name="simple-controlled"
                    value={review.rating}
                    color="warning"
                    onChange={(event, newValue) => {
                      setReview({ ...review, rating: newValue })
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
                    
                  />
                </div>

                {/* Description Input Field */}
                <div className=" mt-3">
                  <div className="w-100 d-flex justify-content-center">
                    <InputTextarea
                      value={review.review} // Bind the description from state
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

          <ContactForm handleFormSubmit={()=>{}} businessData={businessData} />

          <section className="h-auto david-font" id="contact">
            <div className="container p-top">
              <div className="col-12 newsletter position-relative">
                <img
                  src="/images/newsletter.png"
                  alt=""
                  className="w-100"
                />
                <div className="text-center newsletter-content position-absolute">
                  <div className="d-none d-lg-block">
                    <h2 className="fs-45 mb-3 fw-bold text-white">
                      Create Your Own Business <br />
                      Subscribing To Our Newsletter
                    </h2>
                    <div className="row bg-white align-items-center input-div p-2">
                      <div className="col-lg-8">
                        <input
                          type="email"
                          placeholder="Enter Your Email"
                          style={{ border: '0 !important' }}
                          required
                          value={newsLetterEmail}
                          onChange={(e) =>
                            setNewsLetterEmail(e.target?.value?.trim())
                          }
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
                    <h2 className="fs-16 fw-bold text-white">
                      Create Your Own Business <br />
                      Subscribing To Our Newsletter
                    </h2>
                    <div className="row">
                      <div className="col-12">
                        <input
                          type="email"
                          name="email"
                          style={{ border: '0 !important' }}
                          className="form-control form-control-sm"
                        />
                      </div>
                      <div className="col-12">
                        <button
                          type="button"
                          className="btn theme btn-sm mt-1 w-100"
                        >
                          Subscribe
                        </button>
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
                          : 'Placeholder'
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
                  style={{ color: '#A4B3CB' }}
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
                      style={{ color: '#A4B3CB' }}
                    >
                      Home
                    </a>
                  </div>
                  <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                    <a
                      href="#about"
                      className="fs-14 text-decoration-none"
                      style={{ color: '#A4B3CB' }}
                    >
                      About Us
                    </a>
                  </div>
                  <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                    <a
                      href="#contact"
                      className="fs-14 text-decoration-none"
                      style={{ color: '#A4B3CB' }}
                    >
                      Contact Us
                    </a>
                  </div>
                  <div className="col-12 mt-3 mb-3  text-center text-lg-start">
                    <a
                      href="#gallery"
                      className="fs-14 text-decoration-none"
                      style={{ color: '#A4B3CB' }}
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
                        style={{ color: '#A4B3CB' }}
                      >
                        {businessData?.businessTiming?.workingDays?.map(
                          (day, index) => (
                            <p key={index}>{day}</p>
                          ),
                        )}
                      </div>
                      <div
                        className="mt-3 text-center text-lg-start"
                        style={{ color: '#A4B3CB' }}
                      >
                        <span>{`${convertTo12HourFormat(
                          businessData?.businessTiming?.time?.open,
                        )} to ${convertTo12HourFormat(
                          businessData?.businessTiming?.time?.close,
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
                          className="contact-banner text-dark"
                        >
                          <i
                            className={`bi bi-${social?.tag} text-3xl sm:text-xl`}
                          ></i>
                        </a>
                      </>
                    ))}
                    {/* <hr style={{width:"fit-content",opacity: 0.15,}}></hr> */}
                  </div>
                </div>
              </div>
              <div className="col-12">
                <hr style={{ width: '100%', opacity: 0.25, color: 'white' }} />
                <div className="footer-bottom">
                  <div className="row w-full justify-content-between">
                    <div className="col-sm-4 text-left">
                      {/* <a href={`/terms-and-conditions/${id}`}>
                        Terms and Conditions
                      </a> */}
                    </div>
                    <div className="col-sm-4 text-right">
                      <div style={{ color: '#A4B3CB' }} className="text-right">
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
        className="btn btn-lg btn-bottom btn-lg-square bg-transparent rounded-circle back-to-top1"
      >
        <i className="bi bi-arrow-up"></i>
      </a>
    </>
  )
}
