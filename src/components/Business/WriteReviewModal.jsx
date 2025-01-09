/* eslint-disable react/prop-types */
import { Rating } from "@mui/material";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useState } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import {
  createBusinessReview,
} from '../../Functions/functions'

const WriteReviewModal = ({ visible, setVisible, theme }) => {

  const [review, setReview] = useState(
    {
      rating: "",
      name: "",
      description: "",
    },
  );
  const { id } = useParams()
  const [reviewLoading, setReviewLoading] = useState(false)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReview((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleReviewSubmit = (e) => {
    e.preventDefault()
    setReviewLoading(true)
    createBusinessReview({
      ...review,
      businessId: id,
    })
      .then((response) => {
        setReviewLoading(false)
        setReview({
          rating: '',
          name: '',
          review: '',
        })
        if (response?.data) {
          toast.success('Thank you for your review!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'colored',
            style: {
              backgroundColor: '#38a20e', // Custom red color for error
              color: '#FFFFFF', // White text
            },
          })
          setVisible(false)
        }
      })
      .catch((err) => {
        setReview({
          rating: '',
          name: '',
          review: '',
        })
        console.log(err.message)
      })
    setReviewLoading(false)
    setVisible(false)
  }
  return (
    <Dialog
      header="Write a Review"
      visible={visible}
      onHide={() => {
        if (!visible) return
        setVisible(false)
      }}
      style={{
        minWidth: '50vw',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
      breakpoints={{ '960px': '75vw', '641px': '100vw' }}
    >
      <div className="container ">
        <form onSubmit={handleReviewSubmit}>
          <div className=" mb-3 d-flex justify-content-center">
            <Rating
              name="simple-controlled"
              value={review.rating}
              color="warning"
              onChange={(event, newValue) => {
                setReview({ ...review, rating: newValue })
              }}
            />
          </div>

          <div className="">
            <InputText
              keyfilter="text"
              placeholder="Full Name"
              className="w-100"
              value={review.name}
              name="name"
              required
              onChange={handleInputChange}
            />
          </div>

          {/* Description Input Field */}
          <div className=" mt-3">
            <div className="w-100 d-flex justify-content-center">
              <InputTextarea
                value={review.review} // Bind the description from state
                onChange={handleInputChange} // Update description in state
                rows={5}
                cols={30}
                name="review" // Important: use `name` for targeting in handleInputChange
                placeholder="Write your review here..."
                className="w-100"
              />
            </div>
          </div>

          <div className="col-12 mt-3 text-center">
            {reviewLoading ? (
              <div
                className="spinner-border"
                style={{ color: theme }}
                role="status"
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <button
                type="submit"
                className="btn-theme2 btn  theme radius  "
              >
                Submit Review
              </button>
            )}
          </div>
        </form>
      </div>
    </Dialog>
  );
};

export default WriteReviewModal;
