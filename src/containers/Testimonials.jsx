/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { toast } from 'react-toastify'
import { createReveiw, getAllReviews } from '../Functions/functions';
import { ReviewModal, ViewReview } from './BusinessReviews';
import { formatDate } from '../utils/app.utils';
import { Rating } from '@mui/material';
import { FooterSection } from '../views/Home/components';


const Testimonials = () => {
  const [visible, setVisible] = useState(false);
  const [openReviewModal, setOpenReviewModal] = useState(false)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [viewReview, setViewReview] = useState(null)
  const [totalCount, setTotalCount] = useState(0)
  const [isAllReviewsLoaded, setIsAllReviewsLoaded] = useState(false);

  const [review, setReview] = useState([
    {
      rating: "",
      name: "",
      description: "",
    },
  ]);
  const [allReviews, setAllReviews] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReview((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getAllReviews(page)
        setAllReviews(data?.data?.data)
        setTotalCount(data?.data?.totalCount)
      } catch (error) {
        console.log(error);
        toast.error(
          error?.response?.data?.message ??
          'An error occurred. Please try again.',
          {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'colored',
            style: {
              backgroundColor: '#e74c3c', // Custom red color for error
              color: '#FFFFFF', // White text
            },
          },
        )
      }
    }
    fetchReviews()
  }, [refetch])

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    createReveiw(review).then((response) => {
      console.log(response);
      if (response?.data) {
        toast.success("Thank you for your review!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          style: {
            backgroundColor: "#38a20e", // Custom red color for error
            color: "#FFFFFF", // White text
          },
        });
        setVisible(false);
        setRefetch(!refetch)
      }
      setLoading(false)
    }).catch((err) => {
      setLoading(false)
      console.log(err.message);
    })
  };
  const handleReviewModal = (data) => {
    setViewReview(data)
    setOpenReviewModal(true)
  }

  const handleLoadMoreReview = (e) => {
    e.preventDefault();
    setPage(page + 1);
    getAllReviews(page + 1)
      .then((response) => {
        setAllReviews([...allReviews, ...response?.data?.data]);
        // Check if we've loaded all reviews
        if (allReviews.length + response?.data?.data.length >= totalCount) {
          setIsAllReviewsLoaded(true);
        }
      })
      .catch((err) => {
        console.log(err, "something went wrong");
      });
  };





return (
  <Layout title="Reviews" navClass='home'>
    <section className="d-block bg-light">
      <div className="col-12 h-50-vh"><img src="/images/testi-banner.jpg" alt="" className='w-100 h-100' style={{ objectFit: 'cover', filter: "brightness(0.5)" }} /></div>
      <div className="container d-block" id="review">
        <div className="mt-3 mb-3">
          <h1 className="text-center p-3 pt-5 fw-bold " >
            Review
          </h1>
          <p className="mt-3 text-center" >
            Hear from those who have experienced our services firsthand. Read
            their stories and see why we’re a trusted choice for so many.
            Their feedback is a testament to our commitment to excellence!
          </p>
        </div>
      </div>
    </section>

    <div className="container">
      {visible && <ReviewModal
        visible={visible}
        setVisible={setVisible}
        handleInputChange={handleInputChange}
        handleReviewSubmit={handleReviewSubmit}
        setReview={setReview}
        review={review}
        reviewLoading={loading}
      />}
      {openReviewModal && <ViewReview
        data={viewReview}
        setVisible={setOpenReviewModal}
        visible={openReviewModal} />}
      <div className="container">
        <div className="row">
          <div className="col-12 d-flex justify-content-center py-4 align-items-center mx-auto ">
            <button className="btn text-white  btn-theme " onClick={(() => setVisible(true))}>write Review</button>
          </div>
          {allReviews && allReviews?.map((item) => (
            <div  key={item?._id} className="  testi-slide col-12 col-md-6 col-lg-4  mx-auto  p-3  " >
              <div
                style={{ minHeight: "15.5rem" }}
                className={`p-3  rounded shadow position-relative bg-white h-full  d-flex justify-content-between flex-column `}
              >
                <div className="">
                  <div className="row  ">
                    <div className="col-2 ">
                      <img
                        width={50}
                        height={50}
                        src="/images/user.png"
                        alt={item?.name}
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col-10">
                      <h3 className="fs-20 p-0 m-0 ms-4 text-capitalize">
                        {item?.name}
                      </h3>
                      <div className="text-warning text-center mt-0 m-0">
                        <Rating
                          name="simple-controlled"
                          value={item?.rating}
                          readOnly // Makes the rating non-hoverable
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-100 mt-4 ">
                    <p className='p-0 m-0' >
                      {item?.review?.split(' ').length < 20 ? item?.review : item?.review?.split(' ')?.slice(0, 20).join(' ') + '...'}
                    </p>
                  </div>
                </div>
                <div className="d-flex  justify-content-between align-items-center">
                  <p style={{ fontSize: "12px" }} className="text-secondary p-0 m-0 fst-italic">Created At : {formatDate(item?.createdAt ?? '')}</p>
                  {item?.review?.split(' ').length > 20 && <span onClick={(() => handleReviewModal(item))} className=" btn  text-white btn-theme  ">Read More</span>}
                </div>
              </div>
            </div>
          ))}
          {totalCount > 12 && !isAllReviewsLoaded && allReviews.length < totalCount && (
            <div className="pt-4 d-flex justify-content-center align-items-center">
              <button
                onClick={handleLoadMoreReview}
                className="btn btn-theme text-white"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    <FooterSection />

  </Layout>
)
}

export default Testimonials