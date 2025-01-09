import PropTypes from "prop-types";
import Slider from "react-slick";
import { useNavigate } from "react-router";
import { formatDate } from "../../../utils/app.utils";
import { REVIEW_LIMIT } from "../constants";

const ReviewSection = ({
  setVisible,
  settings,
  reviews,
  currentSlide,
  review,
}) => {
  const navigate = useNavigate();
  const sliderSettings = { ...settings };
  if (reviews?.length < 2) sliderSettings.infinite = false;
  return (
    <section className="mt-3 bg-light">
      <div className="container" id="review">
        <div className="mt-3 mb-3">
          <h1 className="text-center p-3 pt-5 fw-bold " >
            Reviews
          </h1>
          <p className="mt-3 text-center" >
          Take a look at genuine reviews and heartfelt testimonials
           that highlight experiences, impressions, and the impact of our work. 
           Whether it’s about personal achievements or professional services,
           these reviews reflect the trust and value we bring to every interaction.
          </p>
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

        <div className="col-12">
          <Slider {...sliderSettings}>
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
                          const isFilled = i < Math.floor(testimonial?.rating);
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
          {review?.length < REVIEW_LIMIT && (
            <div className="text-center mt-5 mb-5">
              <a
                onClick={() => navigate("/reviews")}
                className="btn btn-dark btn-md text-decoration-none text-theme2"
              >
                View more <i className="bi bi-arrow-right"></i>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

ReviewSection.propTypes = {
  setVisible: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      review: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  currentSlide: PropTypes.number.isRequired,
  review: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ReviewSection;
