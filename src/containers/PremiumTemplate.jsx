import { Box, Button, Typography } from "@mui/material";
import TemplateHeader from "/src/components/Business/TemplateHeader";
import useBusiness from "/src/Hooks/useBusiness";
import BackdropLoader from "/src/components/BackdropLoader";
import WelcomeCard from "/src/components/Business/WelcomeCard";
import TemplateFooter from "/src/components/Business/TemplateFooter";
import SpecialServices from "/src/components/Business/SpecialServices";
import SubscribeSection from "/src/components/Business/SubscribeSection";
import ReviewSection from "/src/components/Business/ReviewSection";
import Gallery from "/src/components/Business/Gallery";
import ServicesSection from "/src/components/Business/ServicesSection";
import MenuSection from "/src/components/Business/MenuSection";
import ContactForm from "/src/components/Business/contactForm";
import Loader from "../../src/components/Loader/Loader";
import ShareButton from "../components/ShareButton";
import { useEffect, useState } from "react";
import NewsArticles from "./NewsArticles";
import { useParams } from "react-router";
import BusinessReviews from "./BusinessReviews";


const PremiumTemplate = () => {
  const { businessData, loading, closeDays } = useBusiness();
  const [showNews, setShowNews] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const { id } = useParams()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

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
                        background-color: ${businessData?.theme}; /* Color of the scrollbar thumb */
                        border-radius: 10px;     /* Rounded edges of the thumb */
                        border: 3px solid  ${businessData?.theme}; /* Padding around the thumb */
                    }
                .theme
                {
                    background-color: ${businessData?.theme};
                    color: white;
                    border: none;
                }.service-design.active{
                    background-color: ${businessData?.theme};
                }.address-section{
                background-color:${businessData?.theme};
                }.address-logo i{
                color: ${businessData?.theme};
                }.cat-option{
                    border-right: 1px dashed ${businessData?.theme};
                }.text-orange{
                        color: ${businessData?.theme};
                    }.dish-div:hover{
                        background-color: ${businessData?.theme};
                        color:white;
                    }.product-section{
                    padding:20px;
                    border:1px solid ${businessData?.theme};
                    border-radius:16px;
                        }.slick-dots .slick-active button{
                            background-color: ${businessData?.theme};
                            border-radius: 16px;
                        }
                    `}
      </style>

      <Box sx={{ overflowX: "hidden" }}>
        <TemplateHeader businessData={businessData} colorTheme={businessData?.theme} />
        <ShareButton number={businessData?.contactDetails?.primaryNumber} />
        <div id="news">
        {showNews && (
          <NewsArticles
            businessId={id}
            newsData={businessData?.landingPageHero}
            colorTheme={businessData?.theme}
          />
        )}
        </div>

{showAllReviews && (
        <BusinessReviews
          theme={businessData?.theme}
          secondaryTheme={businessData?.secondaryTheme}
          bgBanner={businessData?.logo}
        />
      )}
        {!showAllReviews && !showNews && <>
          <Box
            sx={{
              position: "relative",
              width: "100vw",
              height: "760px",
              display: "flex",
              justifyContent: "center",
              overflow: "hidden",
            }}
            className="align-items-start align-items-md-center mt-4 pt-4"
            id='home'
          >
            {/* Background Image */}
            <Box
              sx={{
                backgroundImage: `url(${businessData?.landingPageHero?.coverImage ? businessData?.landingPageHero?.coverImage : "https://products.otis.com/hubfs/raw_assets/public/Otis_Oct2020/images/grayscale-mountain.png"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
                filter: "brightness(0.4)",
                zIndex: 1,
                opacity: 1
              }}
            />

            {/* Overlay Content */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "#D3DFEB",
                maxWidth: "611px",
                textAlign: "center",
                zIndex: 2, // Ensure content is above the background
              }}
              className=" pt-4 mt-4"
            >
              <Typography
                fontSize={"64px"}
                lineHeight={"76.8px"}
                fontWeight={"bold"}
                marginBottom={"15px"}
                className={'d-none d-sm-flex'}
              >
                {businessData?.landingPageHero?.title}
              </Typography>
              <Typography
                fontSize={"40px"}
                lineHeight={"56.8px"}
                fontWeight={"bold"}
                marginBottom={"15px"}
                className={'d-flex d-sm-none'}

              >
                {businessData?.landingPageHero?.title}
              </Typography>
              <Typography className="" fontSize={"16px"} lineHeight={"24px"}>
                {businessData?.landingPageHero?.description}
              </Typography>
              <Box className={'d-none d-sm-flex'} marginTop={"10px"} marginBottom={"30px"}>
                <Button
                  sx={{
                    textTransform: "capitalize",
                    background: "#212529",
                    color: "#ffffff",
                    borderTopLeftRadius: "10px",
                    borderBottomRightRadius: "10px",
                    marginRight: "19px",
                  }}
                >
                  {" "}
                  View More{" "}
                </Button>
                <Button
                href="#service"
                  sx={{
                    textTransform: "capitalize",
                    background: businessData?.theme,
                    color: "#ffffff",
                    borderTopLeftRadius: "10px",
                    borderBottomRightRadius: "10px",
                  }}
                >
                  {" "}
                  Services{" "}
                </Button>
              </Box>
              <div className=" col-12 social-media gap-2 d-flex justify-content-center my-2  ">
                {businessData?.socialMediaLinks?.map((social) => (
                  <div className="position-relative">
                    <div style={{ zIndex: -1 }} className="position-absolute bg-dark w-100 h-100 opacity-75 border border-secondary  rounded-circle "></div>
                    <a
                      href={social?.link}
                      target="_blank"
                      style={{ width: "2.5rem", height: "2.5rem", zIndex: "999" }}
                      className=" text-white  rounded-circle  d-flex justify-content-center align-items-center"
                    >
                      <i
                        className={`bi bi-${social?.tag} text-3xl sm:text-xl `}
                      ></i>
                    </a>
                  </div>
                ))}
              </div>
              
              <div className="mt-2 mb-3 sm:mt-0 sm:mb-0 d-flex d-sm-none">
                <div className="container px-4 sm:px-0">

                  <div className="col-12 address-section">
                    <div className="row d-flex justify-content-between align-items-center  p-2">

                      {/* Address Section */}
                      <div className="col-12 col-sm-4  my-1">
                        <div className=" d-flex align-items-center  justify-content-start">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              `${businessData?.address?.buildingName},${businessData.address?.streetName}, ${businessData?.address?.landMark}, ${businessData?.address?.city},   ${businessData.address?.state}`,
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"

                            className="text-decoration-none   p-0 m-0"
                          >
                            <div className="row">
                              <div className="col-auto address-logo my-auto ">
                                <i className="bi bi-geo-alt-fill text-2xl sm:text-lg" />
                              </div>
                              <div className="col text-start  text-white">
                                <span className="fs-12 sm:fs-10 ">Address</span>
                                <p
                                  style={{ textDecoration: 'none' }}

                                  className="fs-14 sm:fs-12  pt-1 lh-sm ">{`${businessData?.address?.buildingName},${businessData.address?.streetName}, ${businessData?.address?.landMark}, ${businessData?.address?.city},   ${businessData.address?.state}`}</p>
                              </div>
                            </div>
                          </a>
                        </div>
                      </div>
                      {/* Email Section */}
                      <div className="col-12 col-sm-4 my-1  mb-sm-0">
                        <div className="row align-items-center justify-content-start">
                          <div className="col-auto address-logo">
                            <i className="bi bi-envelope-fill text-2xl sm:text-lg" />
                          </div>
                          <div className="col text-start ">
                            <a
                              href={`mailto:${businessData?.contactDetails?.email}`}
                              className="text-decoration-none text-white"
                            >
                              <span className="fs-12 sm:fs-10 ">Send Email</span>
                              <p className="fs-14 sm:fs-12 pt-1"
                                style={{ textDecoration: 'none' }}
                              >
                                {businessData?.contactDetails?.email}
                              </p>
                            </a>
                            <ShareButton
                              number={businessData?.contactDetails?.primaryNumber}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Contact Section */}
                      <div className="col-12 col-sm-4 my-1 mb-sm-0">
                        <div className="row align-items-center justify-content-start">
                          <div className="col-auto address-logo">
                            <i className="bi bi-telephone text-2xl sm:text-lg" />
                          </div>
                          <div className="col text-start  ">
                            <span className="fs-12 sm:fs-10" >
                              Contact
                            </span>
                            <p className="fs-14 sm:fs-12 mb-0 pt-1 ">
                              <a className="text-white "
                                style={{ textDecoration: 'none' }}
                                href={`tel:${businessData?.contactDetails?.primaryNumber}`}
                              >
                                {businessData?.contactDetails?.primaryNumber}
                              </a>
                            </p>
                            <p className="fs-14 sm:fs-12 mt-0">
                              <a
                              className="text-white lh-sm"
                                style={{ textDecoration: 'none' }}
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
            </Box>
          </Box>
          <div className="mt-2 mb-3 sm:mt-0 sm:mb-0 d-none d-sm-flex  ">
            <div className="container px-4 sm:px-0">

              <div className="col-12 address-section mt-4">
                <div className="row d-flex justify-content-between align-items-center  p-2">

                  {/* Address Section */}
                  <div className="col-12 col-sm-4  my-1">
                    <div className=" d-flex align-items-center  justify-content-start">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${businessData?.address?.buildingName},${businessData.address?.streetName}, ${businessData?.address?.landMark}, ${businessData?.address?.city},   ${businessData.address?.state}`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"

                        className="text-decoration-none   p-0 m-0"
                      >
                        <div className="row">
                          <div className="col-auto address-logo my-auto ">
                            <i className="bi bi-geo-alt-fill text-2xl sm:text-lg" />
                          </div>
                          <div className="col text-white">
                            <span className="fs-12 sm:fs-10">Address</span>
                            <p
                              style={{ textDecoration: 'none' }}

                              className="fs-14 sm:fs-12 ">{`${businessData?.address?.buildingName},${businessData.address?.streetName}, ${businessData?.address?.landMark}, ${businessData?.address?.city},   ${businessData.address?.state}`}</p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                  {/* Email Section */}
                  <div className="col-12 col-sm-4 my-1  mb-sm-0">
                    <div className="row align-items-center justify-content-start">
                      <div className="col-auto address-logo">
                        <i className="bi bi-envelope-fill text-2xl sm:text-lg" />
                      </div>
                      <div className="col">
                        <a
                          href={`mailto:${businessData?.contactDetails?.email}`}
                          className="text-decoration-none text-white"
                        >
                          <span className="fs-12 sm:fs-10 ">Send Email</span>
                          <p className="fs-14 sm:fs-12"
                            style={{ textDecoration: 'none' }}
                          >
                            {businessData?.contactDetails?.email}
                          </p>
                        </a>
                        <ShareButton
                          number={businessData?.contactDetails?.primaryNumber}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div className="col-12 col-sm-4 my-1 mb-sm-0">
                    <div className="row align-items-center justify-content-start">
                      <div className="col-auto address-logo">
                        <i className="bi bi-telephone text-2xl sm:text-lg" />
                      </div>
                      <div className="col">
                        <span className="fs-12 sm:fs-10" >
                          Contact
                        </span>
                        <p className="fs-14 sm:fs-12 mb-0">
                          <a
                            style={{ textDecoration: 'none' }}
                            href={`tel:${businessData?.contactDetails?.primaryNumber}`}
                          >
                            {businessData?.contactDetails?.primaryNumber}
                          </a>
                        </p>
                        <p className="fs-14 sm:fs-12 mt-0">
                          <a
                            style={{ textDecoration: 'none' }}
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
          <Box mt={{ xs: "10rem", md: "5rem" }}>
            <WelcomeCard businessData={businessData} />
          </Box>
          {/* <SpecialServices service={businessData.specialServices} theme={businessData?.theme} /> */}
          <MenuSection productSection={businessData?.specialServices} theme={businessData?.theme} />
          <MenuSection productSection={businessData?.productSection} theme={businessData?.theme} product />
          <MenuSection productSection={businessData?.service} theme={businessData?.theme} />
          {/* <ServicesSection businessData={businessData} /> */}
          <div id="gallery">
          <Gallery businessData={businessData} />
          </div>
          <ReviewSection businessData={businessData} />
          <ContactForm businessData={businessData} />
          <SubscribeSection />
        </>}
        <TemplateFooter businessData={businessData} closeDays={closeDays} />
        <a href="#" style={{ width: "2.5rem", height: "2.5rem", right: "16px", }} className="btn btn-lg btn-bottom btn-lg-square bg-transparent rounded-circle back-to-top1"><i className="bi bi-arrow-up"></i></a>
        {loading && <Loader />}
      </Box>
    </>
  );
};

export default PremiumTemplate;
