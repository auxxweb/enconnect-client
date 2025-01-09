import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Autocomplete, Button, CircularProgress, TextField } from "@mui/material";
import { updateBusinessDetails } from "../store/businessSlice";
import { fetchCategories } from "../../../Functions/functions";
import { Spinner } from "react-bootstrap";

const CategoryDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const businessState = useSelector((state) => state.business);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);

  const handleCategoryChange = (event, value) => {
    dispatch(updateBusinessDetails({ category: value ? value._id : "" }));
    setError("");
  };

  const handleNext = () => {
    setLoading(true)
    if (!businessState?.category) {
      setError("Please select any category.");
    } else {
      navigate("/create-business/timing");
    }
    setLoading(false)
  };

  const handlePrevStep = () => navigate("/create-business/contact");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoryDetails = await fetchCategories();
        setCategoryData(categoryDetails?.data?.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="h-100vh create-business-div">
      <div className="row h-100 justify-content-center">
        <div className="col-12 col-md-7 d-flex flex-column justify-content-between align-items-center right-portion h-100 p-5">
          <div className="col-12 text-start">
            <button
              className="btn btn-dark w-auto float-start"
              onClick={handlePrevStep}
            >
              <i className="bi bi-arrow-left"></i>
            </button>
          </div>
          <div className="col-12">
            <h1 className="fw-bold title-text">
              <span className="title-main">Select</span> <br />
              <span className="title-highlight">Business Category</span>
            </h1>
          </div>

          <div className="input-group mt-4 w-100 align-items-center">
            <span
              className=" bg-white p-3"
              style={{ flexBasis: "50px" }}
            >
              <i className="bi bi-search"></i>
            </span>

            <div style={{ flexGrow: 1, position: "relative" }}>
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <CircularProgress size={24} />
                </div>
              ) : (
                <Autocomplete
                  disablePortal
                  options={categoryData}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Categories*"
                      variant="filled"
                      fullWidth
                      error={!!error} // Display error style if there's an error
                      helperText={error}
                    />
                  )}
                  onChange={handleCategoryChange}
                  name="category"
                  value={
                    categoryData.find(
                      (category) => category._id === businessState.category
                    ) || null
                  } // Controlled component
                />
              )}
            </div>
          </div>

          <div className="col-12 mt-5"></div>

          <div className="col-12 text-center mt-5">
            {loading ? <Spinner variant="primary" /> : <Button
              variant="contained" className="w-100 submit-button" type="submit"
              onClick={handleNext}
            >
              Save & Next
            </Button>}
          </div>
        </div>

        <div className="left-portion col-12 col-lg-5 h-100 p-3 row align-items-center">
          <div
            className="p-3"
            style={{ border: "1px dashed black", borderRadius: "16px" }}
          >
            <p className="text-center">
              Please select the business category that best represents your
              company. This helps us tailor the services and features
              specifically to your industry needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetails;
