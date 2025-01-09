import PropTypes from "prop-types";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import Placeholder from "/images/placeholder.jpg";
import { Spinner } from "react-bootstrap";

const BusinessesSection = ({
  loading,
  businessData,
  visibleBusiness,
  totalBusinessData,
  loadMoreBusiness,
  scroll
}) => {
  const slugify = (text) => {
    if(!text) return text;
    return text
      .toLowerCase()
      .replace(/ /g, "-") // Replace spaces with hyphens
      .replace(/[^\w-]+/g, ""); // Remove non-word characters
  };
  return (
    <section className="home-spot h-auto mb-5" ref={scroll}>
      <div className="container padding" id="business">
        <div className="text-center mb-5 ">
          <h1 className="fw-bold" >
            Discover the Top Profiles
          </h1>
          <p className="mt-3 text-center" >
            Explore the most popular profile listings in your area through our
            local profile directory listing, highly rated by locals and
            visitors alike. Our platform makes it easy to find top-rated
            profiles based on customer reviews and expert recommendations.
            Whether you're looking for trusted services, shopping options, or
            professional solutions, our comprehensive directory ensures you
            connect with the best profiles available!
          </p>
        </div>
        <div className="row justify-content-around gap-2">
          {businessData?.map((business) => (
            <Link
            to={
              business?.selectedPlan?.isPremium
                ? `/profile/premium/${slugify(business?.businessName) }/${business?._id}`
                : `/profile/${slugify(business?.businessName)}/${business?._id}`
            }
            
              key={business._id}
              className="text-decoration-none text-dark col-12 col-md-5 b-theme location-card mt-3 business-card"
            >
              <div
                className="row p-2"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                <div className="col-4 p-0">
                  <img
                    src={
                      business?.logo && business?.logo?.length > 0
                        ? business?.logo
                        : Placeholder
                    }
                    alt=""
                    className="w-100 br-theme"
                    style={{ objectFit: "cover" }} // Ensure image is responsive
                  />
                </div>
                <div
                  className="col-8"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                >
                  <div className="col-12 mb-2 mt-2">
                    <h2
                      style={{
                        fontSize: "28px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {business?.businessName}
                    </h2>
                  </div>
                  <div className="col-12">
                    <span>{business?.category?.name}</span>
                  </div>
                  <div
                    className="col-12 mt-3"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3, // Limit to 3 lines
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <h3 className="fs-16">
                      <i className="bi bi-crosshair"></i>
                      <span className="ms-1 fs-15">
                        {business?.address?.buildingName},{" "}
                        {business?.address?.city}, {business?.address?.landMark}
                        , {business?.address?.streetName},{" "}
                        {business?.address?.state}
                      </span>
                    </h3>
                  </div>

                  {/* Rating Section (on the right side) */}
                  <div className="col-12 mt-3 d-flex justify-content-end align-items-center">
                    <div
                      className="d-flex align-items-center"
                      style={{
                        backgroundColor: "white", // White background
                        borderRadius: "10px",
                        padding: "5px 10px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for clean look
                      }}
                    >
                      {/* Always show a yellow star */}
                      <FaStar color="gold" size={20} />
                      <span
                        className="ms-2"
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          color: "#d48a27", // Dark gold color for the rating count
                        }}
                      >
                        {business?.rating > 0 ? business?.rating : 0}{" "}
                        {/* Show 0 if no rating */}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {visibleBusiness < totalBusinessData && (
          <div className="mb-3 mt-5 text-center">
            {loading ? (
              <Spinner
                style={{
                  borderWidth: "0.2em",
                  width: "1.5rem",
                  height: "1.5rem",
                  display: "inline-block",
                }}
                variant="primary"
              />
            ) : (
              <button
                onClick={loadMoreBusiness}
                className="btn btn-dark btn-md"
              >
                View More <i className="bi bi-arrow-right"></i>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

BusinessesSection.propTypes = {
  loading: PropTypes.bool.isRequired,
  businessData: PropTypes.array.isRequired,
  visibleBusiness: PropTypes.number.isRequired,
  totalBusinessData: PropTypes.number.isRequired,
  loadMoreBusiness: PropTypes.func.isRequired,
};

export default BusinessesSection;
