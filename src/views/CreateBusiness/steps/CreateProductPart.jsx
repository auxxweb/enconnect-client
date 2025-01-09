import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Cropper from "react-easy-crop";
import Slider from "react-slick";
import { Button, TextField } from "@mui/material";
import { updateBusinessDetails } from "../store/businessSlice";
import { preRequestFun } from "../service/s3url";
import { Spinner } from "react-bootstrap";
import getCroppedImg from "../../../utils/cropper.utils";
import { handleWordExceeded } from "../../../utils/app.utils";

const CreateProductPart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const businessState = useSelector((state) => state.business);

  const [specialService, setSpecialService] = useState({
    title: "",
    description: "",
    data: [{ title: "", description: "", image: "", price: "", link: "" }],
  });
  const [isLoading, setIsLoading] = useState({
    specialService: {},
  });
  const [cropLoading, setCropLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors] = useState([]);
  const [crop1, setCrop1] = useState({ x: 0, y: 0 });
  const [zoom1, setZoom1] = useState(1);
  const [croppedArea1, setCroppedArea1] = useState(null);
  const [showCropper1, setShowCropper1] = useState(false);
  const [spServiceFile, setSpServiceFile] = useState(null);
  const [spServiceImgPrev, setSpServiceImgPrev] = useState(null);
  const [selectedSpServiceIndex, setSelectedSpServiceIndex] = useState(null);

  const [currentImage, setCurrentImage] = useState({ image: null, file: null, preview: null })

  const onCropComplete1 = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea1(croppedAreaPixels);
  };

  const handleCropSave1 = async () => {
    try {
      setCropLoading(true);
      const { fileUrl, blob } = await getCroppedImg(
        currentImage?.preview,
        croppedArea1
      );

      const croppedFile = new File(
        [blob],
        spServiceFile?.name || "cropped-logo.png",
        {
          type: blob.type,
        }
      );

      const preReq = await preRequestFun(croppedFile, "service");
      if (preReq?.accessLink) {
        setSpecialService((prevData) => {
          const updatedData = [...prevData.data];
          updatedData[selectedSpServiceIndex].image = preReq.accessLink;
          return { ...prevData, data: updatedData };
        });
      } else {
        console.error("Access link not found in response.");
      }

      setSpServiceImgPrev(fileUrl);
      setSpServiceFile(croppedFile);
    } catch (e) {
      setCropLoading(false);
      console.error("Error cropping image:", e);
    } finally {
      setCropLoading(false);
      setShowCropper1(false);
    }
  };

  // Handle change for individual special service fields
  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    setSpecialService((prevData) => {
      const updatedData = [...prevData.data];
      updatedData[index][name] = value;

      // Validate the current product
      const product = updatedData[index];
      product.errors = getValidationErrors(product);

      return { ...prevData, data: updatedData };
    });
  };
  const handleFileChange = async (type, index, e) => {
    const file = e.target.files[0];

    if (file) {
      // Set loading state for the specific type and index
      setIsLoading((prevLoading) => ({
        ...prevLoading,
        [type]: { ...prevLoading[type], [index]: true },
      }));

      const reader = new FileReader();

      // Update state with the selected file and index for cropping or further processing
      if (type === "specialService") {
        setSpServiceFile(file); // Store file for further use
        setCurrentImage((prev) => ({ ...prev, file: file }))
        setSelectedSpServiceIndex(index); // Track the specific index for cropping or processing
      }

      reader.onload = async (event) => {
        const imagePreview = event.target.result;

        // Set the image preview and trigger the cropper for "specialService"
        if (type === "specialService") {
          setCurrentImage((prev) => ({ ...prev, preview: imagePreview }))
          // setSpServiceImgPrev(imagePreview); // Set preview for cropping
          setShowCropper1(true); // Open cropper modal
        }

        // Update the corresponding product data in the state
        // setSpecialService((prevData) => {
        //   const updatedData = [...prevData.data];
        //   updatedData[index].image = imagePreview; // Add image preview to the product
        //   updatedData[index].errors = getValidationErrors(updatedData[index]); // Validate the product
        //   return { ...prevData, data: updatedData };
        // });
      };

      reader.readAsDataURL(file); // Read file as Data URL for preview

      // Remove loading state after the file is processed
      setIsLoading((prevLoading) => ({
        ...prevLoading,
        [type]: { ...prevLoading[type], [index]: false },
      }));
    } else {
      // Clear image and validation errors if no file is selected
      setSpecialService((prevData) => {
        const updatedData = [...prevData.data];
        updatedData[index].image = null; // Reset image
        updatedData[index].errors = getValidationErrors(updatedData[index]); // Validate the product
        return { ...prevData, data: updatedData };
      });
    }
  };

  // Trigger file upload for image input
  const uploadImage = (type, index) => {
    const inputClass =
      type === "specialService"
        ? ".specialServiceImageInput"
        : ".serviceImageInput";
    document.querySelectorAll(inputClass)[index].click();
  };

  const handleWordExceeded = (text, limit) => {
    if (!text) return false; // No error if field is empty
    const wordCount = text.trim().split(/\s+/).length;
    return wordCount > limit;
  };

  const isValidationNeeded = (product) => {
    return Boolean(
      product.title || product.description || product.price || product.image
    );
  };

  const getValidationErrors = (product) => {
    const errors = {};
    if (isValidationNeeded(product)) {
      if (!product.title) errors.titleError = "Title is required.";
      else if (handleWordExceeded(product.title, 8))
        errors.titleError = "Title exceeded the word limit.";

      if (!product.description)
        errors.descriptionError = "Description is required.";
      else if (handleWordExceeded(product.description, 50))
        errors.descriptionError = "Description exceeded the word limit.";

      if (!product.image) errors.imageError = "Image is required.";
    }
    return errors;
  };

  // Submit function to store data
  const handleServiceSubmit = () => {
    let isValid = true;

    setSpecialService((prevData) => {
      const updatedData = prevData.data.map((product) => {
        const errors = getValidationErrors(product);
        if (Object.keys(errors).length > 0) isValid = false;
        return { ...product, errors };
      });

      return { ...prevData, data: updatedData };
    });

    if (!isValid) {
      toast.error("Please fill in the required fields.");
      return;
    }

    // Proceed with submission
    setLoading(true);
    dispatch(
      updateBusinessDetails({
        productSection: specialService,
      })
    );
    navigate("/create-business/seo");
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
    }
    setSpecialService((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const removeSpecialService = (index) => {
    setSpecialService((prevData) => {
      const updatedData = prevData.data.filter((_, i) => i !== index);
      return { ...prevData, data: updatedData };
    });
  };

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

  const handlePrevStep = () => navigate("/create-business/services");

  useEffect(() => {
    setSpecialService(
      JSON.parse(JSON.stringify(businessState?.productSection))
    );
  }, [businessState]);

  return (
    <>
      <div className="h-100vh create-business-div">
        {showCropper1 && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Crop Your Image</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowCropper1(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div
                    className="cropper-container position-relative"
                    style={{ height: "400px" }}
                  >
                    <Cropper
                      image={currentImage?.preview}
                      crop={crop1}
                      zoom={zoom1}
                      aspect={4 / 3}
                      onCropChange={setCrop1}
                      onZoomChange={setZoom1}
                      onCropComplete={onCropComplete1}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <Button
                    variant="contained"
                    className="bg-danger border-danger mx-2"
                    onClick={() => setShowCropper1(false)}
                  >
                    Cancel
                  </Button>
                  {cropLoading ? (
                    <Spinner variant="primary" />
                  ) : (
                    <Button
                      variant="contained"
                      className=" mx-2"
                      onClick={handleCropSave1}
                    >
                      Save Crop
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row h-100 justify-content-center">
          {/* Left Image Section */}

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

            <div className="row justify-content-center">
              <div className="col-12 mt-5 text-center text-md-start">
                <h1 className="fw-bold title-text title-main">
                  Add <span className="title-highlight">Product Details</span>
                </h1>
              </div>

              <div className="col-12">
                {/* Special Service Title */}
                <TextField
                  fullWidth
                  className="my-2"
                  label="Title (8 words)"
                  id="title-1"
                  variant="filled"
                  name="title"
                  autoComplete="title-1"
                  onChange={handleChange}
                  error={handleWordExceeded(specialService.title, 8)}
                  helperText={
                    handleWordExceeded(specialService.title, 8)
                      ? "exceeded the limit"
                      : ""
                  }
                  value={specialService.title}
                />
                <TextField
                  fullWidth
                  className="my-2"
                  label="Description (50 words)"
                  id="description-1"
                  variant="filled"
                  name="description"
                  autoComplete="description-1"
                  multiline // Makes the TextField behave like a textarea
                  rows={4} // You can adjust the number of rows (height) here
                  value={specialService.description}
                  onChange={handleChange}
                  error={handleWordExceeded(specialService.description, 50)}
                  helperText={
                    handleWordExceeded(specialService.description, 50)
                      ? "exceeded the limit"
                      : ""
                  }
                />
                <hr
                  style={{
                    border: "2px solid #105193",
                    borderRadius: "5px",
                    margin: "35px 0",
                  }}
                />

                {/* Special Services List */}
                <div className="col-12 text-center">
                  <h5 className="fs-18 mb-4 p-1 text-center text-md-start text-dark fw-bold mt-3">
                    Add Product Cards
                  </h5>
                </div>

                {specialService?.data?.map((p, index) => (
                  <div
                    key={`index-${index}`}
                    className="mt-2 card p-3 pt-5 position-relative shadow-sm"
                    style={{ border: "1px solid #ddd", borderRadius: "8px" }}
                  >
                    {/* Add "X" button to remove item from every card except the last one */}
                    {index < specialService?.data?.length - 1 && (
                      <div
                        onClick={() => removeSpecialService(index)}
                        className="remove-button position-absolute"
                        style={{
                          top: "10px",
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

                    {index !== 0 && <div className="divider"></div>}
                    <TextField
                      fullWidth
                      className="my-2"
                      label="Title (8 words)"
                      id="title"
                      variant="filled"
                      name="title"
                      autoComplete="Service Name"
                      value={p.title}
                      onChange={(e) => handleProductChange(index, e)}
                      error={Boolean(p.errors?.titleError)}
                      helperText={p.errors?.titleError || ""}
                    />

                    <TextField
                      fullWidth
                      className="my-2"
                      label="Description (50 words)"
                      id="description"
                      variant="filled"
                      name="description"
                      autoComplete="description"
                      multiline
                      rows={4}
                      value={p.description}
                      onChange={(e) => handleProductChange(index, e)}
                      error={Boolean(p.errors?.descriptionError)}
                      helperText={p.errors?.descriptionError || ""}
                    />

                    <TextField
                      fullWidth
                      className="my-2"
                      type="number"
                      id="price"
                      name="price"
                      variant="filled"
                      label="Price"
                      value={p.price}
                      onChange={(e) => handleProductChange(index, e)}
                    />

                    <TextField
                      fullWidth
                      className="my-2"
                      type="text"
                      id="link"
                      name="link"
                      variant="filled"
                      label="Link"
                      value={p.link}
                      onChange={(e) => handleProductChange(index, e)}
                    />

                    <div className="col-12 col-md-3 mb-3 mx-auto">
                      <input
                        type="file"
                        hidden
                        className="specialServiceImageInput"
                        onChange={(e) =>
                          handleFileChange("specialService", index, e)
                        }
                      />
                      <div
                        onClick={() => uploadImage("specialService", index)}
                        className={`p-2 mt-2 add-logo-div ${p.errors?.imageError ? "error-border" : ""
                          }`}
                      >
                        <span style={{ color: "grey" }}>(Ratio 4 : 3) </span>
                        <div className="text-center">
                          {isLoading?.specialService[index] ? (
                            <div
                              className="spinner-border text-primary"
                              role="status"
                            ></div>
                          ) : (
                            <img
                              src={
                                p.image || "/images/add_image.png"
                              }
                              width="50"
                              alt="Add Service Image"
                            />
                          )}
                        </div>
                        {p.errors?.imageError && (
                          <p className="text-danger">{p.errors.imageError}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Service Button */}
                <div className="text-center">
                  <Button
                    className="w-100 submit-button"
                    variant="contained"
                    href="#"
                    onClick={() =>
                      setSpecialService((prevData) => ({
                        ...prevData,
                        data: [
                          ...prevData?.data,
                          { title: "", description: "", image: "", price: "" },
                        ],
                      }))
                    }
                  >
                    + Add Products cards
                  </Button>
                </div>
              </div>
              {errors && (
                <p className="text-danger text-danger mt-3">
                  {errors.toString()}
                </p>
              )}
            </div>
            {/* Save & Next Button */}
            <div className="col-12 mt-4 text-center">
              {loading ? (
                <Spinner variant="primary" />
              ) : (
                <Button
                  variant="contained"
                  className="w-100 submit-button"
                  onClick={handleServiceSubmit}
                >
                  Save & Next
                </Button>
              )}
            </div>
          </div>

          <div className="d-none d-md-block left-portion p-0 col-md-6 h-100">
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin
            />
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
                                  background-color: ${businessState?.theme}; /* Color of the scrollbar thumb */
                                  border-radius: 10px;     /* Rounded edges of the thumb */
                                  border: 3px solid  ${businessState?.theme}; /* Padding around the thumb */
                              }
                          .theme
                          {
                              background-color: ${businessState?.theme};
                              color: white;
                              border: none;
                          }.service-design.active{
                              background-color: ${businessState?.theme};
                          }.address-section{
                          background-color:${businessState?.theme};
                          }.address-logo i{
                          color: ${businessState?.theme};
                          }.cat-option{
                              border-right: 1px dashed ${businessState?.theme};
                          }.text-orange{
                                  color: ${businessState?.theme};
                              }.dish-div:hover{
                                  background-color: ${businessState?.theme};
                                  color:white;
                              }.product-section{
                              padding:20px;
                              border:1px solid ${businessState?.theme};
                              border-radius:16px;
                                  }.slick-dots .slick-active button{
                                      background-color: ${businessState?.theme};
                                      border-radius: 16px;
                                  }
                              `}
            </style>
            <div>
              <section
                className="h-auto"
                style={{ backgroundColor: "#F3F3F4", overflowY: "scroll" }}
              >
                <div className="container p-top">
                  <div className="col-12 mb-5">
                    <div className="mt-5 text-center">
                      <div className="col-12">
                        <h1 className="text-center text-dark fw-bold david-font fw-bold banner-title fs-45">
                          {specialService.title}
                        </h1>
                      </div>
                      <div className="row justify-content-center">
                        <div className="col-6 mb-1">
                          <p className="text-secondary text-center">
                            {specialService.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="col-12 mb-5 row justify-content-center david-font">
                      {specialService?.data?.length > 2 ? (
                        <Slider {...settings4}>
                          {specialService.data.map((dish, index) => (
                            <div
                              key={index}
                              className="dish-div col-12 col-lg-6 text-center p-3"
                            >
                              <div className="col-12 position-relative ">
                                <img
                                  src={dish.image}
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
                              <div className="col-12 mt-3 mb-3">
                                <p>{dish.price}</p>
                              </div>
                            </div>
                          ))}
                        </Slider>
                      ) : (
                        specialService?.data?.map((dish, index) => (
                          <div
                            key={index}
                            className="dish-div col-12 col-lg-6 text-center p-3 "
                          >
                            <div className="col-12 position-relative ">
                              <img
                                src={dish.image}
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
                            <div className="col-12 mt-3 mb-3">
                              <p>{dish?.price}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProductPart;
