/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";

import { NavLink } from "react-bootstrap";
import "/src/assets/css/template.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useParams } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Rating } from "primereact/rating";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { width } from "@fortawesome/free-brands-svg-icons/fa42Group";
import Placeholder from "/images/placeholder.jpg";
import Loader from "./Loader/Loader";

function BusinessPreview({ formData }) {
  console.log(formData, "data");

  const [currentSlide, setCurrentSlide] = useState(0);
  const [businessData, setBusinessData] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [review, setReview] = useState([
    {
      rating: "",
      name: "",
      description: "",
    },
  ]);
  const [closeDays, setCloseDays] = useState([]);
  const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReview((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setBusinessData(formData);

      setLoading(false);
      const closed = allDays.filter(
        (day) =>
          !formData.businessTiming.workingDays
            .map((d) => d.toLowerCase())
            .includes(day)
      );
      setCloseDays(closed);
    };

    fetchData();
  }, [id]);

  const settings4 = {
    dots: false,
    // infinite: true,
    autoplay: true,
    arrows: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
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
  };

  const setting2 = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    // centerMode: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    afterChange: (current) => setCurrentSlide(current),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
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
  };

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
    return <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-200">
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
        color: "#1D4ED8", // Tailwind [#107D93]
        fontSize: "20px", // Slightly larger font size for premium feel
        textAlign: "center",
        fontWeight: "500", // Medium font weight
        fontFamily: "'Inter', sans-serif" // Premium standard font
      }}
    >
      Error loading business data.
    </div>
  </div>;
  }

  return (
    <>
      <section className="h-auto">
        <div className="container p-top">
          <div className="row align-items-center banner-section">
            {/* Left Image for Mobile View */}
            <div className="col-12 col-lg-6 text-end d-block d-lg-none">
              <img
                src={businessData.landingPageHero.coverImage && businessData.landingPageHero.coverImage.length > 0 ? businessData.landingPageHero.coverImage : Placeholder}
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
                    {businessData.landingPageHero.title}
                  </h1>
                </div>
                <div className="col-12">
                  <p className="text-secondary text-center text-lg-start david-font">
                    {businessData.landingPageHero.description}
                  </p>
                </div>
                <div className="mt-3 col-12">
                  <div className="row">
                    <div className="col-6 col-lg-3 mb-2">
                      <NavLink
                        to="#about"
                        className="btn btn-dark text-white radius-theme box-shadow w-100 p-1"
                        style={{ backgroundColor: "#212529" }}
                      >
                        View More
                      </NavLink>
                    </div>
                    <div className="col-6 col-lg-3 mb-2">
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
                    href={businessData.socialMediaLinks[0].link}
                    target="_blank"
                    className="contact-banner text-dark"
                  >
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a
                    href={businessData.socialMediaLinks[1].link}
                    target="_blank"
                    className="contact-banner text-dark"
                  >
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a
                    href={businessData.socialMediaLinks[2].link}
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
                src={businessData.landingPageHero.coverImage && businessData.landingPageHero.coverImage.length > 0 ? businessData.landingPageHero.coverImage : Placeholder}
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
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${businessData.address.buildingName}, ${businessData.address.city}, ${businessData.address.landMark}, ${businessData.address.streetName}, ${businessData.address.state}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div className="row">
                      <div className="col-auto address-logo">
                        <i className="bi bi-geo-alt-fill"></i>
                      </div>
                      <div className="col">
                        <span className="fs-13">Address</span>
                        <p className="fs-16">
                          {businessData.address.buildingName},{" "}
                          {businessData.address.city},
                          {businessData.address.landMark},
                          {businessData.address.streetName},{" "}
                          {businessData.address.state}
                        </p>
                      </div>
                    </div>
                  </a>

                </div>
              </div>

              <div className="col-12 col-lg-4 mb-3 mb-lg-0">
                <div className="row align-items-center justify-content-start">
                  <div className="col-auto address-logo">
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <div className="col">
                    <span className="fs-13">Send Email</span>
                    {businessData.contactDetails.emails.map((email, index) => (
                      <p className="fs-16" key={index}>
                        {email.number}
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
                    {businessData.contactDetails.mobileNumbers.map(
                      (mobile, index) => (
                        <p className="fs-16" key={index}>
                          {mobile.number}
                        </p>
                      )
                    )}
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
                src={businessData.welcomePart.coverImage && businessData.welcomePart.coverImage.length > 0 ? businessData.welcomePart.coverImage : Placeholder}
                className="img-fluid"
                alt=""
              />
            </div>
            <div className="col-12 col-lg-6">
              <div className="col-12 mb-3">
                <h1 className="text-center text-lg-start text-dark fw-bold david-font fw-bold banner-title">
                  {businessData.welcomePart.title}
                </h1>
              </div>
              <div className="col-12 mt-4">
                <p className="text-secondary text-center text-lg-start david-font mt-4">
                  {businessData.welcomePart.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="h-auto" style={{ backgroundColor: "#F3F3F4" }}>
        <div className="container p-top">
          <div className="col-12 mb-5">
            <div className="mt-5 text-center">
              <div className="col-12">
                <h1 className="text-center text-dark fw-bold david-font fw-bold banner-title fs-45">
                  {businessData.specialServices.title}
                </h1>
              </div>
              <div className="row justify-content-center">
                <div className="col-6 mb-1">
                  <p className="text-secondary text-center">
                    {businessData.specialServices.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="col-12 mb-5 row justify-content-center david-font">
              {businessData.specialServices.data.length > 2 ? (
                <Slider {...settings4}>
                  {businessData.specialServices.data.map((dish, index) => (
                    <div
                      key={index}
                      className="dish-div col-12 col-lg-6 text-center p-3"
                    >
                      <div className="col-12 position-relative">
                        <img
                          src={dish.image && dish.image.length > 0 ? dish.image : Placeholder}
                          alt={dish.title}
                          style={{
                            width: "100%",
                            height: "auto",
                            maxWidth: "300px",
                            objectFit: "cover",
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
                  ))}
                </Slider>
              ) : (
                businessData.specialServices.data.map((dish, index) => (
                  <div
                    key={index}
                    className="dish-div col-12 col-lg-6 text-center p-3"
                  >
                    <div className="col-12 position-relative">
                      <img
                        src={dish.image && dish.image.length > 0 ? dish.image : Placeholder}
                        alt={dish.title}
                        style={{
                          width: "100%",
                          height: "auto",
                          maxWidth: "300px",
                          objectFit: "cover",
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
              <div className="col-6 text-center">
                <h1 className="text-dark fw-bold david-font banner-title fs-45">
                  Products
                </h1>
              </div>
            </div>
          </div>

          <div className="mt-5 david-font">
            <div className="mb-5">
              <div className="row justify-content-center mb-3">
                {businessData.productSection.map((item, index) => (
                  <div className="col-12 col-lg-6 mt-3" key={index}>
                    <div className="row  product-section align-items-center">
                      <div className="col-2">
                        <img src={item.image && item.image.length > 0 ? item.image : Placeholder} alt="" className="w-100" />
                      </div>
                      <div className="col-8">
                        <h1 className="fs-20 fw-bold">{item.title}</h1>
                        <p className="mt-2">{item.description}</p>
                      </div>
                      <div className="col-2 p-0">
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
        style={{ backgroundColor: "#F3F3F4" }}
      >
        <div className="container p-top">
          <div className="col-12 mt-5 text-center ">
            <h1 className="fw-bold text-center">Services We Provide</h1>
          </div>
          <div className="col-12 mb-5 row justify-content-center">
            {businessData.service.length > 3 ? (
              <Slider {...setting2} className="mb-5">
                {businessData.service.map((service, index) => (
                  <div
                    key={index}
                    className={`col-12 col-lg-4 service-design ${index === currentSlide ? "active" : ""
                      } mt-5 mb-5 text-center`}
                  >
                    <div className="col-12 text-center">
                      <h3>{service.title}</h3>
                    </div>
                    <div className="col-12 mt-5">
                      <p className="text-center">{service.description}</p>
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              businessData.service.map((service, index) => (
                <div
                  key={index}
                  className={`col-12 col-lg-4 service-design ${index === currentSlide ? "active" : ""
                    } mt-5 mb-5 text-center`}
                >
                  <div className="col-12 text-center">
                    <h3>{service.title}</h3>
                  </div>
                  <div className="col-12 mt-5">
                    <p className="text-center">{service.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="col-12 mb-5" id="gallery">
            <div className="col-12 mb-5 mt-5">
              <h1 className="fw-bold text-center">Gallery</h1>
            </div>
            <Slider {...gallery} className="gallery-slider">
              {businessData?.gallery?.map((image, index) => (
                <div key={index} className="p-2">
                  <img src={image && image.length > 0 ? image : Placeholder} alt="" className="w-100 gallery-img" />
                </div>
              ))}
            </Slider>
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    non neque elit. Sed ut tellus ac neque fermentum tristique.
                    Donec sed facilisis tellus, a vulputate turpis. Duis eget
                    turpis non tellus tincidunt fermentum.
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
      <section className="" style={{ backgroundColor: "#F3F3F4" }}>
        <div className="container david-font p-top">
          <div className="col-12 text-center">
            <h1>Reviews</h1>
          </div>
          <div className="col-12">
            <p className="text-center">
              At Our Restaurant, we strive to provide the best dining experience
              possible. Our loyal customers have been satisfied with our
              culinary skills, service, and overall ambiance. Our positive
              feedback has helped us continuously improve our dining experience.
              If you&apos;re a loyal customer, we&apos;d love to hear from you!
            </p>
          </div>

          <div className="mt-5">
            <Slider {...settings3}>
              {businessData.testimonial.reviews.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white col-12 p-3 mt-2 test-div-bottom"
                >
                  <div className="col-12 text-center test-button-img-div">
                    <img
                      src="/images/user.png"
                      alt={testimonial.name}
                      className="img-fluid"
                    />
                  </div>

                  <div className="text-warning text-center mt-0 m-0">
                    {[...Array(Math.floor(testimonial.rating))].map(
                      (star, i) => (
                        <i key={i} className="bi bi-star-fill"></i>
                      )
                    )}
                    {testimonial.rating % 1 !== 0 && (
                      <i className="bi bi-star-half"></i>
                    )}
                  </div>

                  <div className="col-12 mt-3">
                    <p>{testimonial.review}</p>
                  </div>

                  <div className="col-12 text-center mb-5">
                    <span className="fw-bold david-font">
                      {testimonial.name}
                    </span>
                  </div>
                </div>
              ))}
            </Slider>
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
        style={{ width: "50vw" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
      >
        <div className="container">
          <div className="p-3 justify-content-center">
            <Rating
              value={review.rating}
              onChange={(e) => setReview({ ...review, rating: e.value })}
              cancel={false}
            />
          </div>
          <div className="col-12">
            <InputText
              keyfilter="text"
              placeholder="Full Name"
              className="w-100"
              value={review.name}
              name="name"
              onChange={handleInputChange}
            />
          </div>

          {/* Description Input Field */}
          <div className="col-12 mt-3">
            <div className="card flex justify-content-center">
              <InputTextarea
                value={review.description} // Bind the description from state
                onChange={handleInputChange} // Update description in state
                rows={5}
                cols={30}
                name="description" // Important: use `name` for targeting in handleInputChange
                placeholder="Write your review here..."
              />
            </div>
          </div>
          <div className="col-12 mt-3">
            <div className="row">
              <button className="btn-theme2 btn theme radius">
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </Dialog>
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
                      type="text"
                      style={{ border: "0 !important" }}
                      className="form-control form-control-lg"
                    />
                  </div>
                  <div className="col-lg-4">
                    <button className="btn theme btn-lg w-100">
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
                      type="text"
                      style={{ border: "0 !important" }}
                      className="form-control form-control-sm"
                    />
                  </div>
                  <div className="col-12">
                    <button className="btn theme btn-sm mt-1 w-100">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="h-auto">
        <div className="container pjs  p-top">
          <div className="mt-5">
            <div className="row">
              <div className="col-12 col-lg-3">
                <div className="col-12 d-block d-lg-flex text-center text-lg-start text mt-5">
                  <div className="nav-logo width-fit">
                    <img src={businessData.logo && businessData.logo.length > 0 ? businessData.logo : Placeholder} alt="" />
                  </div>
                  <span className="ms-2 fs-30 text-white">
                    {businessData.businessName}
                  </span>
                </div>
                <div
                  className="col-12 mt-4  text-center text-lg-start"
                  style={{ color: "#A4B3CB" }}
                >
                  <p>{businessData.description}</p>
                </div>
              </div>

              <div className="col-12 col-lg-2">
                <div className="col-12 mt-5">
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

              <div className="col-12 col-lg-4">
                <div className="row">
                  <div className="col-12 col-lg-3">
                    <div className="col-12 col-lg-3">
                      <div className="col-12 mt-3 mb-3 text-center text-lg-start">
                        <a
                          href="#"
                          className=" fs-14 text-decoration-none text-orange"
                        >
                          OPENING DAYS
                        </a>
                      </div>
                      <div
                        className="mt-3 text-center text-lg-start"
                        style={{ color: "#A4B3CB" }}
                      >
                        {businessData.businessTiming.workingDays.map(
                          (day, index) => (
                            <p key={index}> {day}</p>
                          )
                        )}
                      </div>
                      <div
                        className="mt-3 text-center text-lg-start"
                        style={{ color: "#A4B3CB" }}
                      >
                        <span>8:00 am to 9:00 pm</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="col-12 mt-5 text-center text-lg-start">
                      <div className="mt-3" style={{ color: "#A4B3CB" }}>
                        {closeDays.map((day, index) => (
                          <p key={index}>{day}</p>
                        ))}
                      </div>
                      <div className="mt-3" style={{ color: "#A4B3CB" }}>
                        <span>CLOSED</span>
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
                      Follow Us
                    </a>
                  </div>

                  <div className="mt-5 col-12 row gap-3 jcc-md text-center text-lg-start">
                    <a
                      href={businessData.socialMediaLinks[0].link}
                      className="contact-banner text-orange text-center text-lg-start"
                    >
                      <i className="bi bi-facebook text-orange"></i>
                    </a>
                    <a
                      href={businessData.socialMediaLinks[1].link}
                      className="contact-banner text-center text-lg-start"
                    >
                      <i className="bi bi-instagram text-orange"></i>
                    </a>
                    <a
                      href={businessData.socialMediaLinks[2].link}
                      className="contact-banner text-center text-lg-start"
                    >
                      <i className="bi bi-twitter text-orange"></i>
                    </a>
                    {/* <hr style={{width:"fit-content",opacity: 0.15,}}></hr> */}
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="row">
                  <div
                    className="col-12 col-lg-6  text-center text-lg-start mb-5 mt-5"
                    style={{ color: "#A4B3CB" }}
                  >
                    <div className="row">
                      <div className="col-12 col-lg-6">Terms of Service</div>
                      <div className="col-12 col-lg-6">Privacy Policy</div>
                    </div>
                  </div>
                  <div
                    className="col-12 col-lg-8 mt-5 text-center text-lg-start"
                    style={{ color: "#A4B3CB" }}
                  >
                    <span>© 2024 Business Bazaar. All Right Reserved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default BusinessPreview;
