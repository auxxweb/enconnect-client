import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Button, TextField } from "@mui/material";
import { updateBusinessDetails } from "../store/businessSlice";
import Loader from "../../../components/Loader/Loader";
import { Spinner } from "react-bootstrap";
import { handleWordExceeded } from "../../../utils/app.utils";

const SeoDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const businessState = useSelector((state) => state.business);
  const [errorMessage, setErrorMessage] = useState("");
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState('')

  const [socialMediaLinks, setSocialMediaLinks] = useState([
    { tag: "instagram", link: "" },
    { tag: "facebook", link: "" },
    { tag: "twitter", link: "" },
    { tag: "youtube", link: "" },
    { tag: "linkedin", link: "" },
  ]);
  const [loading, setLoading] = useState(false)

  const [seoData, setSeoData] = useState({
    title: "",
    description: "",
    metaTags: [""],
  });

  // Handle tag change
  const handleTagChange = (index, value) => {
    const updatedTags = [...seoData.metaTags];
    updatedTags[index] = value;
    setSeoData((prevSeo) => ({
      ...prevSeo,
      metaTags: updatedTags,
    }));
  };

  // Add more tags
  const addTag = () => {
    setSeoData((prevSeo) => ({
      ...prevSeo,
      metaTags: [...prevSeo.metaTags, ""], // Add a new empty string for the new tag
    }));
  };

  // Remove a tag
  const removeTag = (index) => {
    setSeoData((prevSeo) => ({
      ...prevSeo,
      metaTags: prevSeo.metaTags.filter((_, i) => i !== index), // Remove tag at the specified index
    }));
  };



  // Handle changes in SEO data fields
  const handleSeoInputChange = (e) => {
    const { name, value } = e.target;

    // Split the input by spaces to count words
    const words = value.trim().split(/\s+/);

    // Prevent typing if the word limit is exceeded
    if (words.length > 8) {
      setErrorMessage("Title cannot exceed 8 words."); // Set error message
      return; // Stop further input
    }

    // Clear error if within the limit
    setErrorMessage("");

    // Update state as usual
    setSeoData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleDescriptionInputChange = (e) => {
    const { name, value } = e.target;

    // Words to exclude from the count
    const excludedWords = ["is", "am", "I", "are", "the", "a", "an", "of", "to", "in"];

    // Split the input into words and filter out excluded words
    const words = value
      .trim()
      .split(/\s+/)
      .filter((word) => !excludedWords.includes(word.toLowerCase())); // Case insensitive check

    // Prevent typing if the word limit is exceeded
    if (words.length > 50) {
      setDescriptionErrorMessage("Description cannot exceed 50 words."); // Set error message
      return; // Stop further input
    }

    // Clear error if within the limit
    setDescriptionErrorMessage("");

    // Update state as usual
    setSeoData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  // Handle social media input changes
  const handleSocialMediaChange = (index, value) => {
    const updatedLinks = [...socialMediaLinks];
    updatedLinks[index].link = value;
    setSocialMediaLinks(updatedLinks);
  };

  // Handle form submit and update formData with socialMediaLinks and seoData
  const handleSeoSubmit = () => {
    setLoading(true)
    dispatch(updateBusinessDetails({ socialMediaLinks, seoData }));
    navigate("/create-business/gallery");
    setLoading(false)
  };

  const handlePrevStep = () => navigate("/create-business/product");

  useEffect(() => {

    setSocialMediaLinks(
      JSON.parse(JSON.stringify(businessState?.socialMediaLinks))
    );
    setSeoData(JSON.parse(JSON.stringify(businessState?.seoData)));
  }, [businessState]);

  if (loading) {
    return (
      <div className="h-100vh">
        <div className="d-flex h-100 justify-content-center align-items-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="h-100vh create-business-div">
      <div className="row h-100 justify-content-center">
        {/* Right Form Section */}
        <div className="col-12 col-md-6 row align-items-end justify-content-center h-100 p-3 p-md-5 right-portion">
          <div className="col-12 text-start">
            <button
              className="btn btn-dark w-auto float-start"
              onClick={handlePrevStep}
            >
              <i className="bi bi-arrow-left"></i>
            </button>
          </div>
          <div className=" ">
            <div className="col-12 text-center text-md-start mt-4">
              <h1 className="fw-bold title-text">
                <span className="title-main">Add </span>
                <span className="title-highlight">SEO Details</span>
              </h1>
            </div>

            {/* Form Fields */}
            <div className="col-12">
              <TextField
                fullWidth
                label="Title (Max 8 Words)"
                id="title"
                className="my-2"
                variant="filled"
                name="title"
                autoComplete="title"
                value={seoData.title}
                onChange={handleSeoInputChange}
                error={handleWordExceeded(seoData?.title, 8) ? true : false}
                helperText={handleWordExceeded(seoData?.title, 8) ? "exceeded the limit" : ""}
              />
              {errorMessage && <span className="text-danger">{errorMessage}</span>}

              <TextField
                fullWidth
                label="Description (50 Words)"
                id="description"
                className="my-2"
                variant="filled"
                name="description"
                autoComplete="description"
                multiline
                rows={4} // Adjust rows as needed
                value={seoData.description}
                onChange={handleDescriptionInputChange} // Use the new function
                error={handleWordExceeded(seoData?.description, 50) ? true : false}
                helperText={handleWordExceeded(seoData?.description, 50) ? "exceeded the limit" : ""}
              />

              {descriptionErrorMessage && <span className="text-danger">{descriptionErrorMessage}</span>}

              {/* Tags Section */}
              <div className="input-group my-4 w-100">
                {seoData.metaTags.map((tag, index) => (
                  <div className="input-group mb-2" key={index}>
                    <TextField
                      fullWidth
                      type="text"
                      label="Tag"
                      className="my-2"
                      variant="filled"
                      inputProps={{ maxLength: 35 }}
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                    />
                    {seoData?.metaTags?.length > 1 && (
                      <div
                        onClick={() => removeTag(index)}
                        className="remove-button position-absolute"
                        style={{
                          top: "5px",
                          right: "10px",
                          cursor: "pointer",
                          color: "#ff4d4f",
                          fontSize: "18px",
                          fontWeight: "bold",
                          zIndex: 9,
                        }}
                      >
                        X
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Button
                  variant="contained"
                  className="w-100 submit-button"
                  type="button"
                  onClick={addTag}
                >
                  Add More tags
                </Button>
              </div>
              <div className=" h-100">
                {/* Social Media Links */}
                {socialMediaLinks.map((link, index) => (
                  <div className="input-group mb-3 mt-4 w-100 " key={index}>
                    <TextField
                      fullWidth
                      type="text"
                      id="link"
                      variant="filled"
                      name={link.tag}
                      label={link.tag}
                      value={link.link}
                      onChange={(e) =>
                        handleSocialMediaChange(index, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Save & Next Button */}
          <div className="col-12 text-center">
            {loading ? <Spinner variant="primary" /> : <Button
              variant="contained"
              className="w-100 submit-button"
              onClick={handleSeoSubmit}
            >
              Save & Next
            </Button>}
          </div>
        </div>

        <div className="left-portion col-12 col-lg-6 h-100 p-3 row align-items-center">
          <div
            className="p-3"
            style={{ border: "1px dashed black", borderRadius: "16px" }}
          >
            <p className="text-center">
              Please provide the SEO information and social media links to
              enhance your business&apos;s online visibility. Accurate SEO data
              and active social media profiles can help improve your reach and
              engagement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeoDetails;
