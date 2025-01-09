/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Cropper from "react-easy-crop";
import { Button, TextField } from "@mui/material";
import { updateBusinessDetails } from "../store/businessSlice";
import { preRequestFun } from "../service/s3url";
import getCroppedImg from "../../../utils/cropper.utils";
import { handleWordExceeded } from "../../../utils/app.utils";

const BusinessDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const businessState = useSelector((state) => state.business);

  const [logo, setLogo] = useState(businessState?.logo || "");
  const [cropLogo, setCropLogo] = useState(null)
  const [businessName, setBusinessName] = useState(
    businessState?.businessName || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ logo: null, name: null });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPrev, setLogoPrev] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState(null);
  const [showCropper, setShowCropper] = useState(false);

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {

      // setLogoFile(file);
      setError((prev) => ({ ...prev, logo: null }));
      const reader = new FileReader();
      reader.onload = function (e) {

        setLogoPrev(e.target.result);
        setShowCropper(true);
      };
      reader.onerror = function () {
        console.error("Error reading file:", reader.error);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    try {

      const { fileUrl, blob } = await getCroppedImg(logoPrev, croppedArea);
      // setLogoPrev(fileUrl);
      setCropLogo(fileUrl)
      setLogo(fileUrl);
      setShowCropper(false);

      const croppedFile = new File(
        [blob],
        logoFile?.name || "cropped-logo.png",
        {
          type: blob.type,
        }
      );

      setLogoFile(croppedFile);
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  };

  const imageUpload = () => {
    document.getElementById("ImageLogo").click();
  };



  // Handle form submission with validation
  const handleBusinessSubmit = async (e) => {
    e.preventDefault()
    let hasError = false;
    if (!businessName) {
      setError((prev => ({ ...prev, name: "Business name is required." })))
      hasError = true;
    }
    if (!logoFile && !logo) {
      setError((prev => ({ ...prev, logo: "Business logo is required." })))
      hasError = true;
    }
    if (hasError) return;

    setError({});
    try {
      setIsLoading(true);
      let preReq = null;
      if (logoFile) {
        preReq = await preRequestFun(logoFile, "Landing");
      }
      dispatch(
        updateBusinessDetails({
          businessName,
          ...(preReq && { logo: preReq.accessLink }),
        })
      );
      navigate("/create-business/contact");
    } catch (e) {
      console.error("An error occurred during submission", e);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    let isHappened = false
    if (isHappened && businessName) {
      setError((prev => ({ ...prev, name: "Business name is required." })))
      isHappened = true
    } else {
      setError((prev => ({ ...prev, name: null })))
    }

  }, [businessName])


  const handlePrevStep = () => navigate("/create-business");

  useEffect(() => {
    setLogo(businessState?.logo);
    setBusinessName(businessState?.businessName);
  }, [businessState]);
  return (
    <div className="business-details-page">
      {/* Cropper Modal */}
      {showCropper && (
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
                  onClick={() => setShowCropper(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div
                  className="cropper-container position-relative"
                  style={{ height: "400px" }}
                >
                  <Cropper
                    image={logoPrev}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <Button className="mx-2" variant="contained" color="primary" onClick={handleCropSave}>
                  Save Crop
                </Button>
                <Button
                  variant="filled"
                  color="warning"
                  onClick={() => setShowCropper(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container-fluid">
        <div className="row justify-content-center align-items-center">
          {/* Left Section - Form */}
          <div className="col-12 col-md-6 p-5">
            <div className="form-container">
              <button
                className="btn btn-dark w-auto mb-4"
                onClick={handlePrevStep}
              >
                <i className="bi bi-arrow-left"></i>
              </button>
              <h2 className="fw-bold text-start mb-4">
                <span style={{ color: "#000000" }}>Enter Your</span> Business
                Details
              </h2>

              <div className="input-group mb-4 mt-2 w-100">
                <TextField
                  fullWidth
                  required
                  label="Business Name (8 words)"
                  id="businessName"
                  variant="filled"
                  name="businessName"
                  autoComplete="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  error={handleWordExceeded(businessName, 8)}
                  helperText={handleWordExceeded(businessName, 8) ? "exceeded the limit" : ""}
                />
              </div>
              {error?.name && (
                <div className="text-danger mb-4">{error?.name}</div>
              )}
              <div className="mb-4">
                <label htmlFor="ImageLogo" className="form-label">
                  Upload Business Logo*
                  <span style={{ color: "grey" }}> (Ratio 1 : 1)</span>
                </label>

                <input
                  type="file"
                  id="ImageLogo"
                  style={{ display: "none" }}
                  onChange={handleLogoChange}
                />
                <div
                  onClick={imageUpload}
                  className="logo-upload p-4 text-center"
                  style={{ cursor: "pointer" }}
                >
                  {isLoading ? (
                    <div
                      className="spinner-border text-primary"
                      role="status"
                    ></div>
                  ) : logo || cropLogo ? (
                    <img
                      src={cropLogo ?? logo}
                      alt="Business Logo"
                      width="100"
                      className="img-thumbnail"
                    />
                  ) : (
                    <div>
                      <img
                        src="/images/add_image.png"
                        width="50"
                        alt="Add Logo"
                      />
                      <div>Add Logo</div>
                    </div>
                  )}
                </div>
              </div>

              {error?.logo && (
                <div className="text-danger mb-4">{error?.logo}</div>
              )}
              <div className="text-center">
                <Button disabled={isLoading} onClick={handleBusinessSubmit} variant="contained" className="w-100 submit-button" type="submit">save & next</Button>
              </div>
            </div>
          </div>

          {/* Right Section - Business Name Display */}
          <div className="col-12 col-md-6 p-5 left-portion vh-100  ">
            <div className="business-preview">
              <div className="text-center mb-4">
                <h3 className="fw-bold">Business Name Preview</h3>
              </div>
              <div className="preview-content text-center">
                {logo ? (
                  <img src={logo} alt="Business Logo" width="120" />
                ) : (
                  <div className="logo-placeholder">No Logo Uploaded</div>
                )}
                <h4 className="mt-4 text-uppercase">
                  {businessName || "Your Business Name"}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .h-100vh {
          height: 100vh;
        }
        .left-portion {
          background-color: #f5f5f5;
        }
        .right-portion {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 2rem;
          position: relative;
        }
        .back-button-container {
          position: absolute;
          top: 1rem;
          left: 1rem;
          margin-top: 0.5rem;
          margin-left: 0.5rem;
        }
        .title-text {
          text-align: left;
        }
        .title-main {
          color: black;
        }
        .title-highlight {
          color: #105193;
        }
        .btn-primary {
          background-color: #105193;
          border-color: #105193;
        }
        .btn-primary:hover {
          background-color: #107d93;
          border-color: #107d93;
        }
        @media (max-width: 768px) {
          .right-portion {
            padding: 1rem;
          }
          .back-button-container {
            margin-top: 0.75rem;
            margin-left: 0.75rem;
          }
        }
        @media (max-width: 576px) {
          .right-portion {
            padding: 0.5rem;
          }
          .back-button-container {
            margin-top: 1rem;
            margin-left: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default BusinessDetails;