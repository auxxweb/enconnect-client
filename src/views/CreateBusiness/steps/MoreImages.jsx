import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import Cropper from 'react-easy-crop'
import CloseIcon from '@mui/icons-material/Close'
import Slider from 'react-slick'
import axios from 'axios'
import { updateBusinessDetails } from '../store/businessSlice'
import { Spinner } from 'react-bootstrap'
import getCroppedImg from '../../../utils/cropper.utils'
import { Button } from '@mui/material'

const gallery = {
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
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
  ],
}

const GALLERY_IMAGES_LIMIT = 10

const initialImgState = {
  file: null,
  fileType: '',
  fileName: '',
  accessLink: '',
}

const initialCropState = { x: 0, y: 0 }

const MoreImages = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const businessState = useSelector((state) => state.business)

  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [images, setImages] = useState([initialImgState])

  const [crop, setCrop] = useState(initialCropState)
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState(null)
  const [showCropper, setShowCropper] = useState(false)
  const [selectedImgIndex, setSelectedImgIndex] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels)
  }

  const handleCropSave = async () => {
    try {
      setImageLoading(true)
      if (selectedImgIndex >= 0) {
        const file = images?.[selectedImgIndex]?.file
        const { blob } = await getCroppedImg(imagePreview, croppedArea)

        const croppedFile = new File([blob], file?.name || 'cropped-logo.png', {
          type: blob.type,
        })

        setImages((prev) => {
          const updatedImages = [...prev]
          updatedImages[selectedImgIndex].file = croppedFile
          return updatedImages
        })

        setCrop(initialCropState)
      }
      setImageLoading(false)
    } catch (e) {
      setImageLoading(false)
      console.error('Error cropping image:', e)
    } finally {
      setShowCropper(false)
    }
  }

  const handleFileChange = (index, event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()

      setSelectedImgIndex(index)

      reader.onload = async (e) => {
        setImagePreview(e.target.result)
        setShowCropper(true)
      }

      reader.readAsDataURL(file)
    }
  }

  const addImageInput = () => {
    setImages((prevImages) => [
      ...prevImages,
      { file: null, fileType: '', fileName: '' },
    ])
  }

  const handleAddImageClick = (index) => {
    document.getElementById(`file-input-${index}`).click()
  }

  const removeImage = (index) => {
    if (images?.length > 1) {
      const updatedImages = images.filter((_, i) => i !== index)
      setImages(updatedImages)
    } else {
      setImages([{ file: null, fileType: '', fileName: '' }])
    }
  }

  const handleGallerySubmit = async () => {
    const imagesToUpload = images?.filter(({ accessLink }) => !accessLink)
    const imageFiles = imagesToUpload?.map(({ file }) => file)
    const imageFilesLength = imagesToUpload
      ?.map(({ file }) => file)
      .filter((file) => file != null);
    console.log(imageFilesLength, "imageFiles");

    if (imageFilesLength?.length > 0) {
      setLoading(true)

      const requestBody = {
        files: imageFiles?.map((file) => ({
          position: 'gallery',
          file_type: file.type,
        })),
      }

      try {
        const baseUrl = import.meta.env.VITE_APP_BE_API_KEY ?? ''

        const url = `${baseUrl}/api/v1/s3url`

        // Fetch pre-signed S3 URLs for new files
        const response = await axios.post(url, requestBody, {
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const s3Urls = response.data.data

        // Upload each file to its respective S3 URL
        await Promise.all(
          s3Urls.map(async (data, index) => {
            const { url } = data
            const file = imageFiles[index]

            await axios.put(url, file, {
              headers: { 'Content-Type': file.type },
            })
          }),
        )

        // Collect new access links
        const newAccessLinks = s3Urls.map((s3Data) => s3Data.accessLink)

        // Merge original images with new access links, maintaining the original order
        const finalAccessLinks = images.map((image) =>
          image.accessLink ? image.accessLink : newAccessLinks.shift(),
        )

        dispatch(updateBusinessDetails({ gallery: finalAccessLinks }))

        navigate('/create-business/subscription')
      } catch (error) {
        console.error('Error fetching S3 URLs or uploading files:', error)
      } finally {
        setLoading(false)
      }
    } else {
      if (images.length !== 0) {
        const imageData = [];
        images.map((item) => imageData.push(item?.accessLink))
        dispatch(updateBusinessDetails({ gallery: imageData }))
      }
      navigate('/create-business/subscription') // Proceed if no new files to upload
    }
  }

  const handlePrevStep = () => navigate('/create-business/seo')

  useEffect(() => {
    if (businessState?.gallery?.length > 0) {
      setImages(
        businessState?.gallery?.map((accessLink) => ({
          accessLink,
        })),
      )
    } else {
      setImages([initialImgState])
    }
  }, [businessState])

  return (
    <div className="h-100vh create-business-div">
      {/* Cropper Modal */}
      {showCropper && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
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
                  style={{ height: '400px' }}
                >
                  <Cropper
                    image={imagePreview}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 5}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
              </div>
              <div className="modal-footer ">
                <Button
                  variant="contained"
                  className="mx-2 bg-danger border-danger"
                  onClick={() => setShowCropper(false)}
                >
                  Cancel
                </Button>
                {imageLoading ? <Spinner variant="primary" /> : <Button variant="contained" className="mx-2" onClick={handleCropSave}>
                  Save Crop
                </Button>}
              </div>
            </div>
          </div>
        </div>
      )}

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

          <div className="row justify-content-start">
            <div className="col-12 text-center text-md-start mt-4">
              <h1 className="fw-bold title-text">
                <span className="title-main">Add </span>
                <span className="title-highlight">Gallery</span>
              </h1>
            </div>

            {/* Image Upload Fields */}
            <div className="col-12  flex justify-content-start">
              <div className="row mb-3 gap-2">
                {images.map((image, index) => (
                  <div className="col-4 col-md-3 mb-3 mx-2 text-center" key={index}>
                    <input
                      type="file"
                      hidden
                      id={`file-input-${index}`}
                      accept="image/*"
                      onChange={(e) => handleFileChange(index, e)}
                    />
                    <div className="p-2 add-logo-div ">
                      {/* Remove Button for all except the first image */}
                      {images?.length > 1 || image.file ? (
                        <div className="d-flex justify-content-end">
                          <CloseIcon
                            style={{
                              top: '10px',
                              right: '10px',
                              cursor: 'pointer',
                              color: '#ff4d4f',
                              fontSize: '18px',
                              fontWeight: 'bold',
                              zIndex: 9,
                            }}
                            onClick={() => removeImage(index)}
                          />
                        </div>
                      ) : (
                        <div style={{ height: '1.5rem' }}></div>
                      )}
                      <div
                        className="text-center"
                        onClick={() => handleAddImageClick(index)}
                      >
                        <span style={{ color: 'grey' }}>(Ratio 4 : 5)</span>
                        {image?.file || image?.accessLink ? (
                          <img
                            src={
                              image?.file
                                ? URL.createObjectURL(image?.file)
                                : image?.accessLink
                            }
                            alt={`Uploaded Preview ${index}`}
                            className="img-preview"
                            width="100"
                            height="80"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <img
                            src="/images/add_image.png"
                            width="50"
                            alt="Add Image"
                            className='mx-auto'
                            style={{ height: '70px', objectFit: 'contain' }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {images?.length < GALLERY_IMAGES_LIMIT && (
                <Button
                  variant='contained'
                  className="w-100 submit-button"
                  onClick={addImageInput}
                >
                  + Add another image
                </Button>
              )}
            </div>
          </div>

          {/* Save & Next Button */}
          <div className="col-12 text-center ">
            {loading ? <Spinner variant='primary' /> : (
              <Button
                variant='contained'
                className="w-100 submit-button"
                onClick={handleGallerySubmit}
              >
                Save & Next
              </Button>
            )}
          </div>
        </div>

        {/* Left Image Section - Hidden on small screens */}
        <div className="d-none d-md-block left-portion p-0 col-md-6 h-100">
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
            rel="stylesheet"
          />
          <style>
            {' '}
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
          <section
            className="h-auto david-font"
            style={{ backgroundColor: '#F3F3F4' }}
          >
            <div className="container p-top">
              <div className="col-12 mb-5" id="gallery">
                <div className="col-12 mb-5 mt-5">
                  <h1 className="fw-bold text-center">Gallery</h1>
                </div>
                {images.length !== 1 ? (
                  <Slider {...gallery} className="gallery-slider">
                    {images.map((image, index) =>
                      image?.file || image?.accessLink ? (
                        <div key={index} className="p-2">
                          <img
                            src={
                              image?.file
                                ? URL.createObjectURL(image.file)
                                : image?.accessLink
                            }
                            alt=""
                            className="w-100 gallery-img"
                          />
                        </div>
                      ) : null,
                    )}
                  </Slider>
                ) : <div className={`d-flex justify-content-center align-items-center`} >
                  {!images[0]?.file && !images[0]?.accessLink ? <img src="/images/add_image.png" alt="" /> :
                    <img className='w-50' src={images[0].file ? URL.createObjectURL(images[0]?.file) : images[0].accessLink} alt="" />}
                </div>}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default MoreImages
