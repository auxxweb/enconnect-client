import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { Carousel } from "react-bootstrap";
import LocationAutocomplete from "../../../components/LocationAutoComplete";
import Placeholder from "/images/placeholder.jpg";

const libraries = ["places"];

const CarouselSection = ({ bannerData, onSearch, setLocation }) => {
  const [searchData, setSearchData] = useState("");

  const handleSearchSubmit = useCallback(() => {
    onSearch(searchData);
  }, [searchData, onSearch]);

  return (
    <div id="#home" className="h-100vh ">
      <div className="h-100 bg-red">
      <div className="border-1 surface-border border-round text-center h-100">
      <Carousel controls={false}  className="banner-slick h-100">
        {bannerData && bannerData.length > 0 ? (
          bannerData.map((banner) => (
            <Carousel.Item key={`key-${banner?._id}`} className="h-100">
              <img
                className="d-block w-100"
                src={
                  banner?.image && banner?.image.length > 0
                    ? banner?.image
                    : Placeholder
                }
                alt="Banner slide"
                style={{
                  objectFit: "cover",
                  height: "100%",
                  filter: "brightness(0.3)",
                }}
              />
            </Carousel.Item>
          ))
        ) : (
          <Carousel.Item className="h-100">
            <img
              className="d-block w-100"
              src="/images/1.jpg"
              alt="First slide"
              style={{
                objectFit: "cover",
                height: "100%",
                filter: "brightness(0.3)",
              }}
            />
          </Carousel.Item>
        )}
      </Carousel>
    </div>
      </div>
      <div className="search-bar-div sm:flex sm:justify-center sm:items-center ">
        <div className="container ">
          <div className="row banner-main-div flex flex-row items-center justify-between">
            {/* Left Section */}
            <div className="col-12 col-md-6 banner-head-text" style={{ textAlign: "left" }}>
              <h1 className="text-5xl sm:text-4xl md:text-7xl text-white fw-bold font-bold text-start" >
                En<span className="text-theme2">Connect</span> <br />
                Your Digital Platform for Growing Your Business
              </h1>
              <p className="text-white d-none d-md-block" >
                EnConnect is your one-stop platform to create, showcase, and share your business online. Get a personalized NFC card to connect with clients instantly, boost referrals, and expand your reach. Build a professional online presence effortlessly with subscription-based tools. Connect and grow with EnConnect!
              </p>
            </div>

            {/* Right Section */}
            <div
              className="col-12 col-md-6 search-div text-end flex flex-column items-center justify-center"
              style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              {/* Location Input */}
              <LocationAutocomplete setLocation={setLocation} libraries={libraries} />

              {/* Search Input */}
              <div className="col-12 col-md-9 mt-3">
                <div
                  className="input-group banner-input-div"
                  style={{
                    border: "1px solid #ced4da",
                    borderRadius: "8px",
                    overflow: "hidden",
                    background: "none",
                  }}
                >
                  <span
                    className="input-group-text"
                    style={{
                      backgroundColor: "white",
                      border: "none",
                      padding: "0 12px",
                      display: "flex",
                      alignItems: "center",
                      color: "white",
                      background: "none",
                    }}
                  >
                    <i className="bi bi-search fw-bold" style={{ fontSize: "1.2em" }}></i>
                  </span>
                  <input
                    type="text"
                    className="form-control custom-placeholder"
                    placeholder="Search businesses by name..."
                    value={searchData}
                    onInput={(e) => setSearchData(e.target.value)}
                    style={{
                      border: "none",
                      boxShadow: "none",
                      paddingLeft: "0",
                      fontSize: "1em",
                      color: "white",
                      background: "none",
                    }}
                  />
                  <button className="btn btn-md bg-theme" style={{ border: "none" }} onClick={handleSearchSubmit}>
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

  );
};

CarouselSection.propTypes = {
  bannerData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      image: PropTypes.string,
    })
  ),
  onSearch: PropTypes.func.isRequired,
  setLocation: PropTypes.func.isRequired,
};

export default CarouselSection;
