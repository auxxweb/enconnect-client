import PropTypes from "prop-types";
import Placeholder from "/images/placeholder.jpg";
import { Link } from "react-router-dom";
import { useState } from "react"; // Import useState for managing button loading state
import { Spinner } from "react-bootstrap";

const CategorySection = ({
  loading,
  categoryData,
  visibleCategories,
  loadMoreCategories,
}) => {
  const [buttonLoading, setButtonLoading] = useState(false); // Track button loading state

  const handleLoadMore = async () => {
    await loadMoreCategories(); // Call the loadMoreCategories function
  };

  return (
    <section id="category" className=" bg-light h-auto" >
      <div className="container" style={{ width: "90%" }}>
        <div className="mb-5 p-4">
          <h1 className="text-center fw-bold mt-4" style={{ marginTop: "20px" }}>
            Discover Diverse Categories
          </h1>
          <p className="mt-3 text-center">
          Explore a wide range of services and experiences 
          tailored to suit your every need. From local businesses
           to global enterprises, our local business directory
            listing helps you find the best options effortlessly. 
            Connect with trusted businesses, discover new opportunities, 
          and access the services you need with ease!
          </p>
        </div>
        <div className="mb-5 mt-2" id="category">
          <div className="home-category-div">
            {
              categoryData.map((category) => (
                <Link
                  className="cat-div text-decoration-none"
                  
                  to={`/category/${category._id}`} // Dynamically generate the URL with the category ID
                  key={category._id} // Unique key for each category
                >
                  <img
                    src={
                      category.image && category.image.length > 0
                        ? category.image
                        : Placeholder
                    }
                    alt={category.name}
                    className="cat-img"
                  />
                  <div className="cat-text">{category.name}</div>{" "}
                  {/* Wrap category.name in a div */}
                </Link>
              ))}
          </div>

          {visibleCategories <= categoryData.length && ( // Check if more categories are available
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
                  onClick={handleLoadMore}
                  className="btn btn-dark btn-md"
                  disabled={buttonLoading}
                >
                  View More <i className="bi bi-arrow-right"></i>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

CategorySection.propTypes = {
  loading: PropTypes.bool.isRequired,
  categoryData: PropTypes.array.isRequired,
  visibleCategories: PropTypes.number.isRequired,
  loadMoreCategories: PropTypes.func.isRequired,
};

export default CategorySection;
