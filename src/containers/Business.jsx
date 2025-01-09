import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Link, useParams } from "react-router-dom";
import {
  fetchBusiness,
  getCategoryBusiness,
  getCategoryData,
} from "../Functions/functions";
import Loader from "../components/Loader/Loader";
import Placeholder from "/images/placeholder.jpg";
import debounce from "lodash.debounce";

export default function Business() {
  const [categoryData, setCategoryData] = useState([]);
  const [businessData, setBusinessData] = useState([]);
  const [totalBusinessData, setTotalBusinessData] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10); // Adjusting the limit as needed
  const [visibleBusiness, setVisibleBusiness] = useState(10);
  const { id } = useParams();

  // Scroll to the top when category changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch data whenever currentPage, id, searchTerm, or visibleBusiness changes
  useEffect(() => {
    const fetchData = async () => {
      // setLoading(true);
      try {
        if (id) {
          // Fetch data for a specific category
          console.log("Fetching category data...");
          const category = await getCategoryData({
            categoryId: id,
            searchTerm,
            page: currentPage,
            limit,
          });
          console.log("Category Data:", category);
          setCategoryData(category.data);

          const business = await getCategoryBusiness(
            currentPage,
            id,
            searchTerm,
            visibleBusiness
          );
          console.log("Business Data:", business);
          setTotalBusinessData(business.data.totalCount);
          setBusinessData(business.data.data);
        } else {
          // Fetch all businesses if no category id is provided
          console.log("Fetching all business data...");
          const business = await fetchBusiness(currentPage, visibleBusiness);
          console.log("Business Data:", business);
          setTotalBusinessData(business.data.totalCount);
          setBusinessData(business.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        console.log("Data fetch complete");
        setLoading(false); // Make sure this is being reached
      }
    };

    fetchData();
  }, [currentPage, id, searchTerm, visibleBusiness]);

  const totalPages = Math.ceil(totalBusinessData / limit);

  // Load more businesses when the button is clicked
  const loadMoreBusiness = () => {
    setVisibleBusiness((prev) => prev + 10);
  };

  // Debounced search function
  const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on new search
  }, 500); // 500 ms delay

  // Handle immediate input update
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value); // Immediate update for the input field
    debouncedSearch(value); // Trigger debounced search for API call
  };

  // If loading, show the Loader component
  // if (loading) {
  //   return <Loader />;
  // }
  const slugify = (text) => {
    if(!text) return '';
    return text
      .toLowerCase()
      .replace(/ /g, "-") // Replace spaces with hyphens
      .replace(/[^\w-]+/g, ""); // Remove non-word characters
  };
  

  return (
    <Layout title="Business" navClass="home">
      <section className="business-view-banner">
        <img
          src={
            id ? categoryData.coverImage : "/images/businesses.jpg"
          }
          className="w-100 h-100"
          style={{ filter: "brightness(0.4)" }}
          alt=""
        />
        <div className="text-center image-title">
          <h2 className="text-white">
            {id ? categoryData.name : "All Businesses"}
          </h2>
        </div>
      </section>

      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <div className="row justify-content-center">
              <div className="col-12 mb-3 col-md-8">
                <div className="input-group">
                  <span
                    className="input-group-text"
                    style={{
                      backgroundColor: "white",
                      borderTopLeftRadius: "50px",
                      borderBottomLeftRadius: "50px",
                      border: "1px solid #ced4da",
                    }}
                  >
                    <i className="bi bi-search fw-bold"></i>
                  </span>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search for Businesses"
                    value={searchTerm}
                    onChange={handleSearch} // Immediate update with debounce for API call
                    style={{
                      borderTopRightRadius: "50px",
                      borderBottomRightRadius: "50px",
                      borderLeft: "none",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="home-spot h-auto mb-5">
        <div className="container padding" id="business">
          <div className="text-center mb-5">
            <h1 className="fw-bold">Discover the Top Profiles</h1>
            <p className="mt-3 text-center">
              Explore the top-rated profiles in your area, highly recommended
              by locals and visitors alike. Discover what makes these
              establishments stand out and start your next great experience
              here!!
            </p>
          </div>

          <div className="row justify-content-around gap-2">
            {businessData.length > 0 ? (
              businessData.map((business) => (
                <Link
                to={
                  business?.selectedPlan?.isPremium
                    ? `/profile/premium/${slugify(business?.businessName )}/${business?._id}`
                    : `/profile/${slugify(business?.businessName) }/${business?._id}`
                }
                  key={business._id}
                  className="text-decoration-none text-dark col-12 col-md-5 b-theme location-card mt-3 business-card"
                >
                  <div className="row p-2">
                    <div className="col-4 p-0">
                      <img
                        src={business.logo ? business.logo : Placeholder}
                        alt=""
                        className="w-100 br-theme"
                      />
                    </div>
                    <div className="col-8">
                      <div className="col-12 mb-2 mt-2">
                        <h2 className="responsive-input ">
                          {business.businessName}
                        </h2>
                      </div>
                      <div className="col-12">
                        <span>{business.category.name}</span>
                      </div>
                      <div className="col-12 mt-3">
                        <h3 className="fs-16">
                          <i className="bi bi-crosshair"></i>
                          <span className="ms-1 fs-15">
                            {business.address.buildingName},{" "}
                            {business.address.city}, {business.address.landMark}
                            , {business.address.streetName},{" "}
                            {business.address.state}
                          </span>
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center mt-5">
                <h3>No businesses found</h3>
                <p>Please check back later or refine your search.</p>
              </div>
            )}
          </div>

          {visibleBusiness < totalBusinessData && (
            <div className="mt-5 text-center mb-1">
              <button
                onClick={loadMoreBusiness}
                className="btn btn-dark btn-md"
              >
                View More <i className="bi bi-arrow-right"></i>
              </button>
            </div>
          )}
        </div>
      </section>

      <a href="#" className="btn btn-lg btn-bottom btn-lg-square back-to-top">
        <i className="bi bi-arrow-up"></i>
      </a>
    </Layout>
  );
}
