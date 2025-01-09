import { useState } from "react";
import { Button, Spinner } from "react-bootstrap"
import Cropper from "react-easy-crop"
import getCroppedImg from "../utils/cropper.utils";

export const ReactCropperComponent = ({
    setShowCropper,
    setResultImage,
    resultImage,
    showCropper,
    label,
    ratio,
    setPreviewImage,
    previewImage,
    aspectRatio
}) => {
    const [logoFile, setLogoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState(null);

    const handleCropSave = async () => {
        try {
            setLoading(true)
            const { fileUrl, blob } = await getCroppedImg(previewImage, croppedArea);
            setPreviewImage(fileUrl)
            setShowCropper(false);

            const croppedFile = new File(
                [blob],
                logoFile?.name || "cropped-logo.png",
                {
                    type: blob.type,
                }
            );
            setResultImage(croppedFile);
            setLoading(false)
        } catch (e) {
            console.error("Error cropping image:", e);
        }
    }
    const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
        setCroppedArea(croppedAreaPixels);
    };

    const handleLogoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onload = function (e) {
                setPreviewImage(e.target.result)
                setShowCropper(true);
            };
            reader.onerror = function () {
                console.error("Error reading file:", reader.error);
            };
            reader.readAsDataURL(file);
        }
    };

    const imageUpload = () => {
        document.getElementById("ImageLogo").click();
    };
    const handleCancel = (e) => {
        e.preventDefault()
        setShowCropper(false)
    }
    return (
        <>
            <div className="">
                <div className="mb-4">
                    <label htmlFor="ImageLogo" className="form-label">
                        {label} {" "}
                        <span style={{ color: "grey" }}>(Ratio {ratio})</span>
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
                        {loading ? <Spinner variant="primary" /> : resultImage || previewImage ? (
                            <img
                                src={previewImage ?? resultImage}
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
            </div>
            {showCropper && <div
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
                                    image={previewImage}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={aspectRatio}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <Button variant="primary" onClick={handleCropSave}>
                                Save Crop
                            </Button>
                            <Button
                                variant="filled"
                                onClick={handleCancel}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}
