/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import Slider from "react-slick";
import WriteReviewModal from "./WriteReviewModal";
import { Box, Button, Rating, Typography } from "@mui/material";
import { useParams } from "react-router";
import { getAllBusinessReviews } from "../../Functions/functions";
import { formatDate } from "../../utils/app.utils";
import { NavLink } from "react-bootstrap";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
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
      breakpoint: 390,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};
const ReviewSection = ({ businessData }) => {
  const [visible, setVisible] = useState(false);
  const [reviews, setReviews] = useState([])
  const [reviewCount, setReviewCount] = useState(0)
  const [reviewFetch, setreviewFetch] = useState(false)
  const { id } = useParams()

  useEffect(() => {
    const fetchReview = async () => {
      const response = await getAllBusinessReviews({ businessId: id })
      console.log(response, 'data-validation')
      setReviews(response?.data?.data)
      setReviewCount(response?.data?.totalCount)
    }
    fetchReview()
  }, [id, reviewFetch])

  return (
    <Box backgroundColor={"#F3F3F4"} padding={"3rem 5rem"}>
      <Box
        maxWidth={"lg"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        margin={"1rem 2rem"}
      >
        <Box
          display={"flex"}
          justifyContent={"flex-start"}
          flexDirection={{ xs: "column", md: "row" }}
          alignItems={"flex-start"}
          gap={{ xs: "1rem", lg: "5rem" }}
          marginBottom={"1rem"}
        >
          <Box>
            <Typography
              sx={{
                fontSize: "38px",
                fontWeight: 700,
                // lineHeight: "54px",
                letterSpacing: 0,
                textTransform: "uppercase",
              }}
            >
               Customer Reviews
            </Typography>
            <Box
              sx={{
                border: `2px solid ${businessData?.theme}`,
                width: "4rem",
              }}
            ></Box>
          </Box>
          <Box maxWidth={"72%"}>
            <Typography
              sx={{
                color: "#3C4247",
                mt: "1rem",
              }}
              className=""
            >
              At Our Restaurant, we strive to provide the best dining experience
              possible. Our loyal customers have been satisfied with our
              culinary skills, service, and overall ambiance. Our positive
              feedback has helped us continuously improve our dining experience.
              If you&apos;re a loyal customer, we&apos;d love to hear from you!
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box className="col-12">
        <Box className="col-12 text-center mb-3">
          <Button
            className="btn btn-dark text-white radius-theme box-shadow theme mt-5"
            onClick={() => setVisible(true)}
          >
            Write Review
          </Button>
        </Box>
      </Box>
      <div className="">
        <Slider {...settings}>
          {reviews?.map((testimonial, index) => (
            <div key={index} className=" ">
              <div
                className={` `}
                style={{
                  backgroundColor:
                    '#f0f8ff',// Light blue background for the active card
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
                      <Rating
                        name="simple-controlled"
                        value={testimonial.rating}
                        color="warning"
                      />
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
      </div>
      <Box className="col-12">
        <Box className="col-12 text-center mb-3">
          <Button
          href="#reviews"
            className="btn btn-dark text-white radius-theme box-shadow theme mt-5"
          >
            view more
          </Button>
        </Box>
      </Box>
      
      <WriteReviewModal visible={visible} setVisible={setVisible} theme={businessData?.theme} />
    </Box>
  );
};

export default ReviewSection;